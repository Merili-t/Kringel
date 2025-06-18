import createFetch from "./utils/createFetch";

let testId = null;
let blocks = [];
let currentBlock = 0;
let interval;

const elements = {
  loading: document.getElementById("loading"),
  errorMessage: document.getElementById("error-message"),
  mainContent: document.getElementById("main-content"),
  testTitle: document.getElementById("test-title"),
  testDuration: document.getElementById("test-duration"),
  questionCount: document.getElementById("question-count"),
  timer: document.getElementById("timer"),
  questionsWrapper: document.getElementById("blocks-container"),
  progressBar: document.getElementById("progress-bar"),
  progressText: document.getElementById("progress-text"),
  nextButton: document.getElementById("next-button"),
  endButton: document.getElementById("end-button")
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("[DEBUG] DOMContentLoaded event fired.");
  testId = getTestIdFromUrl() || "01977d6c-6084-7329b550-5ae9c632bd01";
  console.log("[DEBUG] Test ID:", testId);
  // Store the testId if not already in sessionStorage.
  if (!sessionStorage.getItem("testId")) {
    sessionStorage.setItem("testId", testId);
  }
  await loadTestData(testId);
});

function getTestIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("testId");
  console.log("[DEBUG] Retrieved testId from URL:", id);
  return id;
}

async function loadTestData(testId) {
  try {
    console.log("[DEBUG] Loading test data...");
    showLoading();
    const token = localStorage.getItem("token");
    console.log("[DEBUG] Token:", token);

    // Fetch test details.
    const testData = await createFetch(`/test/${testId}`, "GET");
    console.log("[DEBUG] Test data received:", testData);

    // Fetch blocks for the test.
    const blockData = await createFetch(`/block/test/${testId}`, "GET", "");
    console.log("[DEBUG] Block data received:", blockData);

    if (!testData || !Array.isArray(blockData.blocks)) {
      throw new Error("Vigased andmed");
    }

    const allBlocks = [];
    for (const block of blockData.blocks) {
      console.log("[DEBUG] Processing block:", block);
      const response = await createFetch(`/question/block/${block.id}`, "GET", "");
      console.log("[DEBUG] Block questions response:", response);
      const questions = Array.isArray(response.blockQuestions)
        ? response.blockQuestions
        : [];
      const formattedQuestions = questions.map(q => ({
        id: q.id,           // Use provided id
        type: q.type,       // Numeric value expected by backend
        text: q.description,
        points: q.points ?? 0
      }));
      allBlocks.push({
        blockOrder: block.block_number ?? 0,
        questions: formattedQuestions
      });
    }

    blocks = allBlocks
      .sort((a, b) => a.blockOrder - b.blockOrder)
      .map(b => b.questions);
    console.log("[DEBUG] Final blocks array:", blocks);

    populateTestData(testData, blocks.flat().length);
    renderBlocks();
    updateProgressBar();

    if (testData.timeLimit) {
      console.log(
        "[DEBUG] Starting timer with timeLimit (sec):",
        testData.timeLimit * 60
      );
      startTimer(testData.timeLimit * 60);
    } else {
      console.warn("No timeLimit provided in test data. Timer will not start.");
    }
    showMainContent();
  } catch (error) {
    console.error("[DEBUG] Test loading failed:", error);
    showError("Testi laadimine ebaonnestus");
  }
}

function populateTestData(testData, count) {
  elements.testTitle.textContent = testData.name || "Nimetu test";
  elements.testDuration.textContent = formatDuration(testData.timeLimit);
  elements.questionCount.textContent = count || "0";
  document.title = testData.name || "Testi lahendamine";
  console.log("[DEBUG] Populated test data:", testData, "Total questions:", count);
}

function renderBlockIndicators() {
  const container = document.getElementById("block-indicator");
  container.innerHTML = "";
  blocks.forEach((_, index) => {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    if (index < currentBlock) circle.classList.add("completed");
    else if (index === currentBlock) circle.classList.add("active");
    circle.textContent = index + 1;
    container.appendChild(circle);
  });
  console.log("[DEBUG] Rendered block indicators; Current block:", currentBlock);
}

function renderBlocks() {
  const container = elements.questionsWrapper;
  container.innerHTML = "";
  let globalQuestionNumber = 1;

  blocks.forEach((block, blockIndex) => {
    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    if (blockIndex === currentBlock) blockDiv.classList.add("active");

    const questionContainer = document.createElement("div");
    questionContainer.className = "question-grid";

    block.forEach(q => {
      const questionWrapper = document.createElement("div");
      questionWrapper.className = "question";

      const qDiv = document.createElement("div");
      qDiv.className = "question-card";

      // Prepare hidden inputs and header.
      const hiddenId = `<input type="hidden" class="question-id" value="${q.id}" />`;
      const hiddenType = `<input type="hidden" class="question-type" value="${q.type}" />`;
      const questionHeader = `<div class="question-header"><strong>${globalQuestionNumber}. </strong>${q.text} <span class="points-badge">${q.points}p</span></div>`;

      // Render input fields based on question type.
      if (["text", "one_correct", "short"].includes(q.type.toString())) {
        qDiv.innerHTML = `
          ${questionHeader}
          ${hiddenId}
          ${hiddenType}
          <input type="text" placeholder="Vastus..." class="auto-save-input" />
        `;
        const inputField = qDiv.querySelector('input[type="text"]');
        inputField.addEventListener("blur", async () => {
          await saveSingleAnswer(qDiv);
        });
      } else if (q.type === 7) {
        // Calculator type question.
        qDiv.innerHTML = `
          ${questionHeader}
          ${hiddenId}
          ${hiddenType}
          <iframe src="../html/calculator.html" class="calculator-iframe" width="100%" height="300" style="border: none; margin-top: 10px;"></iframe>
          <input type="hidden" class="calculator-answer" />
        `;
        // Optionally attach event listeners if the calculator triggers changes.
      } else {
        // For longer text answers.
        qDiv.innerHTML = `
          ${questionHeader}
          ${hiddenId}
          ${hiddenType}
          <textarea placeholder="Pikk vastus..." rows="4" class="auto-save-input"></textarea>
        `;
        const textareaField = qDiv.querySelector("textarea");
        textareaField.addEventListener("blur", async () => {
          await saveSingleAnswer(qDiv);
        });
      }

      questionWrapper.appendChild(qDiv);
      questionContainer.appendChild(questionWrapper);
      globalQuestionNumber++;
    });

    blockDiv.appendChild(questionContainer);
    container.appendChild(blockDiv);
  });

  renderBlockIndicators();
  updateProgressBar();
  console.log("[DEBUG] Blocks rendered. Current block index:", currentBlock);
}

function updateProgressBar() {
  const percent = Math.round(((currentBlock + 1) / blocks.length) * 100);
  elements.progressBar.style.width = `${percent}%`;
  elements.progressText.textContent = `${percent}%`;
  console.log("[DEBUG] Progress bar updated:", percent + "%");
}

function moveToNextBlock() {
  const allBlocks = document.querySelectorAll(".block");
  if (currentBlock < allBlocks.length - 1) {
    console.log("[DEBUG] Moving from block", currentBlock, "to block", currentBlock + 1);
    allBlocks[currentBlock].classList.remove("active");
    currentBlock++;
    allBlocks[currentBlock].classList.add("active");
    updateProgressBar();
    renderBlockIndicators();
    if (currentBlock === allBlocks.length - 1) {
      elements.nextButton.style.display = "none";
      elements.endButton.style.display = "inline-block";
      console.log("[DEBUG] Last block reached, hiding next button, showing finish button.");
    }
  } else {
    console.warn("[DEBUG] Already at last block; cannot move to next block.");
  }
}

function startTimer(duration) {
  let time = duration;
  console.log("[DEBUG] Timer started with duration:", duration, "seconds");
  interval = setInterval(async () => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    elements.timer.textContent = `${minutes} : ${seconds}`;
    if (--time < 0) {
      clearInterval(interval);
      console.log("[DEBUG] Time expired - initiating auto-save.");
      // Optionally auto-save remaining answers here.
      triggerTimeUpPopup();
      elements.nextButton.disabled = true;
    }
  }, 1000);
}

function endTest() {
  clearInterval(interval);
  console.log("[DEBUG] Test ended manually.");
  alert("Test lopetatud! Aitäh vastamast.");
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} minutit`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0
    ? `${h} tund${h !== 1 ? "i" : ""} ja ${m} minutit`
    : `${h} tund${h !== 1 ? "i" : ""}`;
}

function showLoading() {
  elements.loading.style.display = "block";
  elements.errorMessage.style.display = "none";
  elements.mainContent.style.display = "none";
}

function showError(msg) {
  elements.loading.style.display = "none";
  elements.errorMessage.style.display = "block";
  elements.mainContent.style.display = "none";
  const p = elements.errorMessage.querySelector("p");
  if (p) p.textContent = msg;
  console.error("[DEBUG] Error shown:", msg);
}

function showMainContent() {
  elements.loading.style.display = "none";
  elements.errorMessage.style.display = "none";
  elements.mainContent.style.display = "block";
  console.log("[DEBUG] Main content displayed.");
}

// New function to save a single question's answer on blur using FormData.
async function saveSingleAnswer(card) {
  try {
    // Pull the attempt ID from sessionStorage (set elsewhere during team/attempt creation).
    const attemptId = sessionStorage.getItem("attemptId");
    if (!attemptId) {
      console.error("[DEBUG] Attempt ID not found in sessionStorage.");
      return;
    }
    let answer = "";
    const textInput = card.querySelector("input[type='text']");
    if (textInput) answer = textInput.value.trim();
    const textarea = card.querySelector("textarea");
    if (textarea) answer = textarea.value.trim();
    const calcInput = card.querySelector(".calculator-answer");
    if (calcInput) answer = calcInput.value.trim();

    // Retrieve hidden fields for question identification.
    const idInput = card.querySelector(".question-id");
    const typeInput = card.querySelector(".question-type");
    const questionId = idInput ? idInput.value : "";
    const questionType = typeInput ? typeInput.value : "";

    // Build the FormData payload.
    const formData = new FormData();
    formData.append("testId", testId);
    formData.append("attemptId", attemptId);
    formData.append("questionId", questionId);
    formData.append("questionType", questionType);
    formData.append("answer", answer);

    console.log("[DEBUG] Saving single question answer using FormData:", {
      testId,
      attemptId,
      questionId,
      questionType,
      answer
    });

    // Post the FormData to the backend.
    const response = await createFetch("/team/answer/upload", "POST", formData);
    console.log("[DEBUG] Single question answer upload response:", response);
  } catch (error) {
    console.error("[DEBUG] Single answer saving failed:", error);
    const qId = (card.querySelector(".question-id") && card.querySelector(".question-id").value) || "";
    showError("Answer saving failed for question " + qId);
  }
}

// Navigation button event listeners.
elements.nextButton.addEventListener("click", () => {
  moveToNextBlock();
});
elements.endButton.addEventListener("click", () => {
  endTest();
});

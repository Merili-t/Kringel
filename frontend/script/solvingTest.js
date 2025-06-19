import createFetch from "./utils/createFetch";

let testId = null;
let blocks = [];
let currentBlock = 0;
let timerInterval = null;

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
  const urlId = getTestIdFromUrl();
  if (urlId) {
    testId = urlId;
  } else {
    const stored = sessionStorage.getItem("currentTest");
    try {
      const current = stored ? JSON.parse(stored) : {};
      testId = current.testId;
    } catch {
      testId = null;
    }
  }

  if (!testId) {
    showError("Testi ID puudub. Proovi uuesti.");
    return;
  }

  sessionStorage.setItem("testId", testId);
  await loadTestData(testId);
});

function getTestIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("testId");
}

async function loadTestData(testId) {
  try {
    showLoading();

    const testData = await createFetch(`/test/${testId}`, "GET");
    const blockResponse = await createFetch(`/block/test/${testId}`, "GET");

    const allBlockEntries = [];
    const blockList = Array.isArray(blockResponse.blocks)
      ? blockResponse.blocks
      : [];

    // Filter only blocks belonging to this test
    const filteredBlocks = blockList.filter(block => String(block.testId) === String(testId));

    for (const blockEntry of filteredBlocks) {
      const questionResponse = await createFetch(`/question/block/${blockEntry.id}`, "GET");
      const rawQuestions = Array.isArray(questionResponse.blockQuestions)
        ? questionResponse.blockQuestions.filter(q => String(q.blockId) === String(blockEntry.id))
        : [];

      const mappedQuestions = rawQuestions.map(item => ({
        id: item.id,
        type: item.type,
        text: item.description,
        points: item.points ?? 0,
        answerOptions: Array.isArray(item.answerVariables)
          ? item.answerVariables.map(opt => ({
              text: String(opt.answer),      // ensure it's a string
              isCorrect: opt.correct === true
            }))
          : []
      }));

      allBlockEntries.push({
        order: blockEntry.block_number ?? 0,
        questions: mappedQuestions
      });
    }

    // Sort blocks by their order number and extract question arrays
    blocks = allBlockEntries
      .sort((a, b) => a.order - b.order)
      .map(entry => entry.questions);

    populateTestData(testData, blocks.flat().length);
    renderBlocks();
    updateProgressBar();

    if (testData.timeLimit) {
      startTimer(testData.timeLimit * 60);
    }

    showMainContent();
  } catch (error) {
    console.error("[DEBUG] loadTestData error:", error);
    showError("Testi laadimine ebaõnnestus");
  }
}

function populateTestData(testData, totalQuestions) {
  elements.testTitle.textContent = testData.name || "";
  elements.testDuration.textContent = formatDuration(testData.timeLimit);
  elements.questionCount.textContent = String(totalQuestions);
  document.title = testData.name;
}

function renderBlocks() {
  const container = elements.questionsWrapper;
  container.innerHTML = "";
  let questionCounter = 1;

  blocks.forEach((questionList, blockIndex) => {
    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    if (blockIndex === currentBlock) blockDiv.classList.add("active");

    const gridDiv = document.createElement("div");
    gridDiv.className = "question-grid";

    questionList.forEach(question => {
      const wrapperDiv = document.createElement("div");
      wrapperDiv.className = "question";

      const cardDiv = document.createElement("div");
      cardDiv.className = "question-card";

      const headerHTML = `
        <div class="question-header">
          <strong>${questionCounter}. </strong>${question.text}
          <span class="points-badge">${question.points}p</span>
        </div>
      `;
      const hiddenIdInput = `<input type="hidden" class="question-id" value="${question.id}" />`;
      const hiddenTypeInput = `<input type="hidden" class="question-type" value="${question.type}" />`;

      if (question.type === 0 || question.type === 1) {
        const inputType = question.type === 0 ? "radio" : "checkbox";
        const inputName = `question-${question.id}`;

        const optionsHTML = question.answerOptions.length > 0
          ? question.answerOptions.map((opt, idx) => `
              <label style="display:block; margin:4px 0;">
                <input
                  type="${inputType}"
                  name="${inputName}"
                  value="${opt.text}"
                  data-index="${idx}"
                />
                ${opt.text}
              </label>
            `).join("")
          : "<p><i>Vastusevariandid puuduvad</i></p>";

        cardDiv.innerHTML = `
          ${headerHTML}
          ${hiddenIdInput}
          ${hiddenTypeInput}
          <div class="choice-options">${optionsHTML}</div>
        `;

        const inputs = cardDiv.querySelectorAll(`input[type="${inputType}"]`);
        inputs.forEach(input => {
          input.addEventListener("change", () => saveChoiceAnswer(cardDiv));
        });

      } else if (question.type === 7) {
        cardDiv.innerHTML = `
          ${headerHTML}
          ${hiddenIdInput}
          ${hiddenTypeInput}
          <iframe src="../html/calculator.html" class="calculator-iframe"></iframe>
          <input type="hidden" class="calculator-answer" />
        `;

      } else if (question.type === 5) {
        cardDiv.innerHTML = `
          ${headerHTML}
          ${hiddenIdInput}
          ${hiddenTypeInput}
          <iframe src="../html/chemistryKeyboard.html" class="chemistry-iframe"></iframe>
          <input type="hidden" class="chemistry-answer" />
        `;

      } else {
        cardDiv.innerHTML = `
          ${headerHTML}
          ${hiddenIdInput}
          ${hiddenTypeInput}
          <textarea class="auto-save-input" placeholder="Pikk vastus..."></textarea>
        `;
        const textAreaElement = cardDiv.querySelector("textarea");
        textAreaElement.addEventListener("blur", () => saveSingleAnswer(cardDiv));
      }

      wrapperDiv.appendChild(cardDiv);
      gridDiv.appendChild(wrapperDiv);
      questionCounter++;
    });

    blockDiv.appendChild(gridDiv);
    container.appendChild(blockDiv);
  });

  renderBlockIndicators();
}

function renderBlockIndicators() {
  const indicatorContainer = document.getElementById("block-indicator");
  indicatorContainer.innerHTML = "";
  blocks.forEach((_, index) => {
    const circleDiv = document.createElement("div");
    circleDiv.classList.add("circle");
    if (index < currentBlock) circleDiv.classList.add("completed");
    if (index === currentBlock) circleDiv.classList.add("active");
    circleDiv.textContent = String(index + 1);
    indicatorContainer.appendChild(circleDiv);
  });
}

function updateProgressBar() {
  const percentage = Math.round(((currentBlock + 1) / blocks.length) * 100);
  elements.progressBar.style.width = `${percentage}%`;
  elements.progressText.textContent = `${percentage}%`;
}

function moveToNextBlock() {
  const allBlocks = document.querySelectorAll(".block");
  if (currentBlock < allBlocks.length - 1) {
    allBlocks[currentBlock].classList.remove("active");
    currentBlock++;
    allBlocks[currentBlock].classList.add("active");
    updateProgressBar();
    renderBlockIndicators();
  } else {
    endTest();
  }
}

function startTimer(totalSeconds) {
  let remainingSeconds = totalSeconds;
  timerInterval = setInterval(() => {
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
    const seconds = String(remainingSeconds % 60).padStart(2, "0");
    elements.timer.textContent = `${minutes} : ${seconds}`;
    if (--remainingSeconds < 0) {
      clearInterval(timerInterval);
      elements.nextButton.disabled = true;
    }
  }, 1000);
}

function endTest() {
  clearInterval(timerInterval);
  alert("Test lõpetatud!");
}

function formatDuration(minutesTotal) {
  if (minutesTotal < 60) return `${minutesTotal} minutit`;
  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;
  return minutes
    ? `${hours} tund${hours !== 1 ? "i" : ""} ja ${minutes} minutit`
    : `${hours} tund${hours !== 1 ? "i" : ""}`;
}

function showLoading() {
  elements.loading.style.display = "block";
  elements.errorMessage.style.display = "none";
  elements.mainContent.style.display = "none";
}

function showError(message) {
  elements.loading.style.display = "none";
  elements.errorMessage.style.display = "block";
  elements.mainContent.style.display = "none";
  const paragraph = elements.errorMessage.querySelector("p");
  if (paragraph) paragraph.textContent = message;
}

function showMainContent() {
  elements.loading.style.display = "none";
  elements.errorMessage.style.display = "none";
  elements.mainContent.style.display = "block";
}

// Keep track of last-saved answers to prevent duplicate saves
const lastSavedAnswers = new Map();

async function saveSingleAnswer(cardElement) {
  try {
    const attemptId = sessionStorage.getItem("attemptId");
    if (!attemptId) return;

    let answerText = "";
    const textArea = cardElement.querySelector("textarea");
    const calculatorInput = cardElement.querySelector(".calculator-answer");
    const chemistryInput = cardElement.querySelector(".chemistry-answer");

    if (textArea) answerText = textArea.value.trim();
    if (calculatorInput) answerText = calculatorInput.value.trim();
    if (chemistryInput) answerText = chemistryInput.value.trim();

    const questionId = cardElement.querySelector(".question-id").value;
    const questionType = Number(cardElement.querySelector(".question-type").value);

    if (lastSavedAnswers.get(questionId) === answerText) return;
    lastSavedAnswers.set(questionId, answerText);

    const formData = new FormData();
    formData.append("attemptId", attemptId);
    formData.append("questionId", questionId);
    formData.append("questionType", questionType);
    formData.append("answer", answerText);

    await createFetch("/team/answer/upload", "POST", formData);
  } catch (error) {
    console.error("[ERROR] Saving single answer failed:", error);
  }
}

async function saveChoiceAnswer(cardElement) {
  try {
    const attemptId = sessionStorage.getItem("attemptId");
    if (!attemptId) return;

    const questionId = cardElement.querySelector(".question-id").value;
    const questionType = Number(cardElement.querySelector(".question-type").value);

    const selectedInputs = cardElement.querySelectorAll(
      'input[type="checkbox"]:checked, input[type="radio"]:checked'
    );
    const selectedValues = Array.from(selectedInputs).map(input => input.value.trim());
    const answerText = selectedValues.join("||");

    if (lastSavedAnswers.get(questionId) === answerText) return;
    lastSavedAnswers.set(questionId, answerText);

    const formData = new FormData();
    formData.append("attemptId", attemptId);
    formData.append("questionId", questionId);
    formData.append("questionType", questionType);
    formData.append("answer", answerText);

    await createFetch("/team/answer/upload", "POST", formData);
  } catch (error) {
    console.error("[ERROR] Saving choice answer failed:", error);
  }
}

// Handle calculator and chemistry iframe messages
window.addEventListener("message", event => {
  if (event.data?.type === "CALCULATOR_ANSWER") {
    const answerText = String(event.data.payload || "");
    const cardElement = document
      .querySelector(".block.active .calculator-iframe")
      ?.closest(".question-card");
    if (cardElement) {
      const inputElement = cardElement.querySelector(".calculator-answer");
      if (inputElement) {
        inputElement.value = answerText;
        saveSingleAnswer(cardElement);
      }
    }
  }

  if (event.data?.type === "chemistry-balance-answer") {
    const answerText = String(event.data.value || "");
    const cardElement = document
      .querySelector(".block.active .chemistry-iframe")
      ?.closest(".question-card");
    if (cardElement) {
      const inputElement = cardElement.querySelector(".chemistry-answer");
      if (inputElement) {
        inputElement.value = answerText;
        saveSingleAnswer(cardElement);
      }
    }
  }
});

elements.nextButton.addEventListener("click", moveToNextBlock);
elements.endButton.addEventListener("click", endTest);

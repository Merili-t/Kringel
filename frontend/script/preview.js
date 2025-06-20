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
  questionsWrapper: document.getElementById("blocks-container"),
  progressBar: document.getElementById("progress-bar"),
  progressText: document.getElementById("progress-text"),
  nextButton: document.getElementById("next-button"),
  endButton: document.getElementById("end-button"),
};

document.addEventListener("DOMContentLoaded", async () => {
  // Get the test ID from the URL or fallback to a default value.
  //testId = getTestIdFromUrl() || "01976907-0aad-775e-acc5-a2b5f1f60426";
  testId = getCurrentTestId();
  await loadTestData(testId);
});

function getTestIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("testId");
}

function getCurrentTestId() {
  const testId = sessionStorage.getItem("testId");
  if (!testId) {
    throw new Error("Test ID not found. Please create a test first.");
  }
  return testId;
}

function mapQuestionType(type) {
  switch (type) {
    case 0: return "one_correct";
    case 1: return "many_correct";
    case 2: return "text";
    case 3: return "matrix";
    case 4: return "picture";
    case 5: return "chemistry";
    case 6: return "drawing";
    case 7: return "calculator";
    default: return "unknown";
  }
}

async function loadTestData(testId) {
  try {
    showLoading();

    const token = localStorage.getItem("token") || "";

    const testData = await createFetch(
      `/test/${testId}`,
      "GET",
      "",
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    const blockRes = await createFetch(`/block/test/${testId}`, "GET", "");
    const blockList = Array.isArray(blockRes.blocks)
      ? blockRes.blocks
      : Array.isArray(blockRes)
        ? blockRes
        : [];

    const relevantBlocks = blockList.filter(b => b.testId === testId);

    const allBlocks = [];

    for (const block of relevantBlocks) {
      const qRes = await createFetch(`/question/block/${block.id}`, "GET", "");
      let rawQs = Array.isArray(qRes.blockQuestions) ? qRes.blockQuestions : [];

      rawQs = rawQs.filter(q => q.blockId === block.id);

      const sortedQs = rawQs.sort((a, b) => (a.question_order ?? 0) - (b.question_order ?? 0));

      const formattedQuestions = await Promise.all(sortedQs.map(async (q) => {
        let answerVariables = [];
        if (q.type === 0 || q.type === 1) {
          try {
            const aRes = await createFetch(`/answer/question/${q.id}`, "GET");
            answerVariables = aRes?.answers ?? [];
          } catch (err) {
            console.warn("Vastusevariantide laadimine ebaõnnestus küsimusele", q.id);
          }
        }

        return {
          id: q.id,
          type: mapQuestionType(q.type),
          rawType: q.type,
          text: q.description || "",
          points: q.points ?? 0,
          answerVariables
        };
      }));

      allBlocks.push({
        blockOrder: block.block_number ?? 0,
        questions: formattedQuestions
      });
    }

    blocks = allBlocks
      .sort((a, b) => a.blockOrder - b.blockOrder)
      .map((b) => b.questions);

    populateTestData(testData, blocks.flat().length);
    renderBlocks();
    updateProgressBar();
    showMainContent();

  } catch (error) {
    console.error("Testi laadimine ebaõnnestus:", error);
    showError("Testi laadimine ebaõnnestus");
  }
}

function populateTestData(testData, count) {
  elements.testTitle.textContent = `${testData.name || "Nimetu test"} (eelvaade)`;
  elements.testDuration.textContent = formatDuration(testData.timeLimit);
  elements.questionCount.textContent = count || "0";
  document.title = testData.name || "Testi koostamise eelvaade";
}

function renderBlockIndicators() {
  const container = document.getElementById("block-indicator");
  container.innerHTML = "";

  blocks.forEach((_, index) => {
    const circle = document.createElement("div");
    circle.classList.add("circle");

    if (index < currentBlock) {
      circle.classList.add("completed");
    } else if (index === currentBlock) {
      circle.classList.add("active");
    }

    circle.textContent = index + 1;
    container.appendChild(circle);
  });
}

function renderBlocks() {
  const container = elements.questionsWrapper;
  container.innerHTML = "";

  let globalQuestionNumber = 1;

  blocks.forEach((block, index) => {
    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    if (index === currentBlock) blockDiv.classList.add("active");

    const questionContainer = document.createElement("div");
    questionContainer.className = "question-grid";

    block.forEach((q) => {
      const questionWrapper = document.createElement("div");
      questionWrapper.className = "question";

      const qDiv = document.createElement("div");
      qDiv.className = "question-card";

      const questionHeader = `
        <div class="question-header">
          <strong>${globalQuestionNumber}.</strong> ${q.text}
          <span class="points-badge">${q.points}p</span>
        </div>
      `;

      if (["text", "one_correct", "short"].includes(q.type)) {
        qDiv.innerHTML = `
          ${questionHeader}
          <input type="text" placeholder="Vastus..." />
        `;
      } else if (q.type === "calculator") {
        qDiv.innerHTML = `
          ${questionHeader}
          <iframe 
            src="../html/calculator.html"
            class="calculator-iframe"
            width="100%" 
            height="300" 
            style="border: none; margin-top: 10px;"></iframe>
          <input type="hidden" class="calculator-answer" />
        `;
      } else {
        qDiv.innerHTML = `
          ${questionHeader}
          <textarea placeholder="Pikk vastus..." rows="4"></textarea>
        `;
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
}

function updateProgressBar() {
  const percent = Math.round(((currentBlock + 1) / blocks.length) * 100);
  elements.progressBar.style.width = `${percent}%`;
  elements.progressText.textContent = `${percent}%`;
}

function moveToNextBlock() {
  const allBlocks = document.querySelectorAll(".block");

  if (currentBlock < allBlocks.length - 1) {
    allBlocks[currentBlock].classList.remove("active");
    currentBlock++;
    allBlocks[currentBlock].classList.add("active");
    updateProgressBar();
    renderBlockIndicators();

    if (currentBlock === blocks.length - 1) {
      elements.nextButton.style.display = "none";
      elements.endButton.style.display = "inline-block";
    } else {
      elements.nextButton.style.display = "inline-block";
      elements.endButton.style.display = "none";
    }
  }
}

function startTimer(duration) {
  let time = duration;

  interval = setInterval(() => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    elements.timer.textContent = `${minutes}:${seconds}`;

    if (--time < 0) {
      clearInterval(interval);
      triggerTimeUpPopup();
      elements.nextButton.disabled = true;
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const endBtn = document.getElementById("end-button");

  if (endBtn) {
    endBtn.addEventListener("click", endTest);
  }
});

function endTest() {
  clearInterval(interval);
  alert("Test koostatud!");
  window.location.href = "/html/allTests.html";
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} minutit`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0
    ? `${h} tund${h !== 1 ? "i" : ""}`
    : `${h} tund${h !== 1 ? "i" : ""} ja ${m} minutit`;
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
}

function showMainContent() {
  elements.loading.style.display = "none";
  elements.errorMessage.style.display = "none";
  elements.mainContent.style.display = "block";
}

elements.nextButton.addEventListener("click", moveToNextBlock);
elements.endButton.addEventListener("click", endTest);

function triggerTimeUpPopup() {
  // Call the global function from timeOut.js.
  if (typeof initTimeOut === 'function') {
    initTimeOut();
  } else {
    console.warn("initTimeOut() not found.");
  }
}
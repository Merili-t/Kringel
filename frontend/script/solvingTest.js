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
    const blockRes = await createFetch(`/block/test/${testId}`, "GET");

    let blockList = Array.isArray(blockRes.blocks)
      ? blockRes.blocks
      : Array.isArray(blockRes)
        ? blockRes
        : [];

    const relevantBlocks = blockList.filter(b => String(b.testId) === String(testId));
    const allBlocks = [];

    for (const block of relevantBlocks) {
      const qRes = await createFetch(`/question/block/${block.id}`, "GET");
      let rawQs = Array.isArray(qRes.blockQuestions) ? qRes.blockQuestions : [];

      rawQs = rawQs.filter(q => String(q.blockId) === String(block.id));

      const qs = await Promise.all(rawQs.map(async q => {
        let answerVariables = [];
        if ((q.type === 0 || q.type === 1) && (!Array.isArray(q.answerVariables) || q.answerVariables.length === 0)) {
          // Kui andmebaas ei anna kaasa answerVariables, proovi laadida eraldi
          try {
            const vRes = await createFetch(`/variant/question/${q.id}`, "GET");
            if (Array.isArray(vRes)) {
              answerVariables = vRes.map(av => ({
                answer: av.answer,
                correct: av.correct === true
              }));
            }
          } catch (err) {
            console.warn(`Ei saanud laadida vastusevariante küsimusele ${q.id}`);
          }
        } else if (Array.isArray(q.answerVariables)) {
          answerVariables = q.answerVariables.map(av => ({
            answer: av.answer,
            correct: av.correct === true
          }));
        }

        return {
          id: q.id,
          type: q.type,
          text: q.description,
          points: q.points ?? 0,
          answerVariables
        };
      }));

      allBlocks.push({ order: block.block_number ?? 0, questions: qs });
    }

    blocks = allBlocks
      .sort((a, b) => a.order - b.order)
      .map(b => b.questions);

    populateTestData(testData, blocks.flat().length);
    renderBlocks();
    updateProgressBar();

    if (testData.timeLimit) {
      startTimer(testData.timeLimit * 60);
    }

    showMainContent();
  } catch (e) {
    console.error("[DEBUG] loadTestData error:", e);
    showError("Testi laadimine ebaõnnestus");
  }
}

function populateTestData(testData, count) {
  elements.testTitle.textContent = testData.name || "";
  elements.testDuration.textContent = formatDuration(testData.timeLimit);
  elements.questionCount.textContent = count.toString();
  document.title = testData.name;
}

function renderBlocks() {
  const c = elements.questionsWrapper;
  c.innerHTML = "";
  let num = 1;

  blocks.forEach((blk, idx) => {
    const div = document.createElement("div");
    div.className = "block";
    if (idx === currentBlock) div.classList.add("active");

    const grid = document.createElement("div");
    grid.className = "question-grid";

    blk.forEach(q => {
      const wrap = document.createElement("div");
      wrap.className = "question";
      const card = document.createElement("div");
      card.className = "question-card";

      const header = `<div class="question-header"><strong>${num}. </strong>${q.text} <span class="points-badge">${q.points}p</span></div>`;
      const hidId = `<input type="hidden" class="question-id" value="${q.id}"/>`;
      const hidTyp = `<input type="hidden" class="question-type" value="${q.type}"/>`;

      if (q.type === 0 || q.type === 1) {
        // Ühe- või mitme valikvastusega küsimus
        const inputType = q.type === 0 ? "radio" : "checkbox";
        const nameAttr = `question-${q.id}`;

        const options = q.answerVariables || [];
        const optionsHTML = options.length > 0
          ? options.map((opt, idx) => `
              <label style="display:block;margin:4px 0;">
                <input type="${inputType}" name="${nameAttr}" value="${opt.answer}" data-index="${idx}">
                ${opt.answer}
              </label>
            `).join("")
          : "<p><i>Vastusevariandid puuduvad</i></p>";

        card.innerHTML = `${header}${hidId}${hidTyp}<div class="choice-options">${optionsHTML}</div>`;

        const inputs = card.querySelectorAll(`input[type="${inputType}"]`);
        inputs.forEach(input => {
          input.addEventListener("change", () => saveChoiceAnswer(card));
        });

      } else if (q.type === 7) {
        // Kalkulaator
        card.innerHTML = `${header}${hidId}${hidTyp}
          <iframe src="../html/calculator.html" class="calculator-iframe"></iframe>
          <input type="hidden" class="calculator-answer"/>`;

      } else if (q.type === 5) {
        // Keemia tasakaalustamine
        card.innerHTML = `${header}${hidId}${hidTyp}
          <iframe src="../html/chemistryKeyboard.html" class="chemistry-iframe"></iframe>
          <input type="hidden" class="chemistry-answer"/>`;

      } else {
        // Pikk või lühike tekst
        card.innerHTML = `${header}${hidId}${hidTyp}
          <textarea class="auto-save-input" placeholder="Pikk vastus..."></textarea>`;
        const ta = card.querySelector("textarea");
        ta.addEventListener("blur", () => saveSingleAnswer(card));
      }

      wrap.appendChild(card);
      grid.appendChild(wrap);
      num++;
    });

    div.appendChild(grid);
    c.appendChild(div);
  });

  renderBlockIndicators();
}

function renderBlockIndicators() {
  const cont = document.getElementById("block-indicator");
  cont.innerHTML = "";
  blocks.forEach((_, i) => {
    const circ = document.createElement("div");
    circ.classList.add("circle");
    if (i < currentBlock) circ.classList.add("completed");
    else if (i === currentBlock) circ.classList.add("active");
    circ.textContent = (i + 1).toString();
    cont.appendChild(circ);
  });
}

function updateProgressBar() {
  const pct = Math.round(((currentBlock + 1) / blocks.length) * 100);
  elements.progressBar.style.width = `${pct}%`;
  elements.progressText.textContent = `${pct}%`;
}

function moveToNextBlock() {
  const all = document.querySelectorAll(".block");

  if (currentBlock < all.length - 1) {
    all[currentBlock].classList.remove("active");
    currentBlock++;
    all[currentBlock].classList.add("active");

    updateProgressBar();
    renderBlockIndicators();

  } else {
    console.log("[DEBUG] Viimane plokk täidetud – lõpetan testi automaatselt");
    endTest();
  }
}

function startTimer(sec) {
  let t = sec;
  interval = setInterval(() => {
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    elements.timer.textContent = `${m} : ${s}`;
    if (--t < 0) {
      clearInterval(interval);
      elements.nextButton.disabled = true;
    }
  }, 1000);
}

function endTest() {
  clearInterval(interval);
  alert("Test lõpetatud!");
}

function formatDuration(min) {
  if (min < 60) return `${min} minutit`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} tund${h !== 1 ? 'i' : ''} ja ${m} minutit` : `${h} tund${h !== 1 ? 'i' : ''}`;
}

function showLoading() {
  elements.loading.style.display = 'block';
  elements.errorMessage.style.display = 'none';
  elements.mainContent.style.display = 'none';
}

function showError(msg) {
  elements.loading.style.display = 'none';
  elements.errorMessage.style.display = 'block';
  elements.mainContent.style.display = 'none';
  const p = elements.errorMessage.querySelector('p');
  if (p) p.textContent = msg;
}

function showMainContent() {
  elements.loading.style.display = 'none';
  elements.errorMessage.style.display = 'none';
  elements.mainContent.style.display = 'block';
}

async function saveSingleAnswer(card) {
  try {
    const attemptId = sessionStorage.getItem('attemptId');
    if (!attemptId) return;

    let ans = '';
    const ti = card.querySelector("input[type='text']");
    if (ti) ans = ti.value.trim();
    const ta = card.querySelector('textarea');
    if (ta) ans = ta.value.trim();
    const ci = card.querySelector('.calculator-answer');
    if (ci) ans = ci.value.trim();
    const chem = card.querySelector('.chemistry-answer');
    if (chem) ans = chem.value.trim();

    const qId = card.querySelector('.question-id').value;
    const qType = Number(card.querySelector('.question-type').value);

    if (lastSavedAnswers.get(qId) === ans) return;
    lastSavedAnswers.set(qId, ans);

    const fd = new FormData();
    fd.append('attemptId', attemptId);
    fd.append('questionId', qId);
    fd.append('questionType', qType);
    fd.append('answer', ans);

    await createFetch('/team/answer/upload', 'POST', fd);
  } catch (e) {
    console.error(e);
  }
}

async function saveChoiceAnswer(card) {
  try {
    const attemptId = sessionStorage.getItem('attemptId');
    if (!attemptId) return;

    const qId = card.querySelector('.question-id').value;
    const qType = Number(card.querySelector('.question-type').value);

    // Leia kõik valikud (checkboxid või raadionupud)
    const selectedInputs = card.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
    const selectedValues = Array.from(selectedInputs).map(input => input.value);
    const ans = selectedValues.join("||"); 

    if (lastSavedAnswers.get(qId) === ans) return;
    lastSavedAnswers.set(qId, ans);

    const fd = new FormData();
    fd.append('attemptId', attemptId);
    fd.append('questionId', qId);
    fd.append('questionType', qType);
    fd.append('answer', ans);

    await createFetch('/team/answer/upload', 'POST', fd);
  } catch (e) {
    console.error("Error saving choice answer:", e);
  }
}


window.addEventListener("message", function(event) {
  if (event.data && event.data.type === "CALCULATOR_ANSWER") {
    const answer = String(event.data.payload || '');

    // ainult aktiivse ploki sees oleva esimese kalkulaatori salvestamine
    const activeBlock = document.querySelector(".block.active");
    if (!activeBlock) return;

    const iframe = activeBlock.querySelector(".calculator-iframe");
    if (!iframe) return;

    const card = iframe.closest(".question-card");
    if (!card) return;

    const hiddenInput = card.querySelector(".calculator-answer");
    if (!hiddenInput) return;

    hiddenInput.value = answer;
    saveSingleAnswer(card);
  }
});

window.addEventListener("message", function(event) {
  if (event.data && event.data.type === "chemistry-balance-answer") {
    const answer = String(event.data.value || '');

    const activeBlock = document.querySelector(".block.active");
    if (!activeBlock) return;

    const iframe = activeBlock.querySelector(".chemistry-iframe");
    if (!iframe) return;

    const card = iframe.closest(".question-card");
    if (!card) return;

    const hiddenInput = card.querySelector(".chemistry-answer");
    if (!hiddenInput) return;

    hiddenInput.value = answer;
    saveSingleAnswer(card);
  }
});


elements.nextButton.addEventListener('click', moveToNextBlock);
elements.endButton.addEventListener('click', endTest);

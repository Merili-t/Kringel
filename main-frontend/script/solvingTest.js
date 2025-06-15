// solvingTest.js

let intervalId;
let blocks = [];
let currentBlock = 0;

// UTIL: group flat question list into an array of blocks
function groupQuestionsToBlocks(questions) {
  const map = {};
  questions.forEach(q => {
    if (!map[q.block_number]) map[q.block_number] = [];
    map[q.block_number].push({
      type: q.type === 1 ? "short" : "long",
      text: q.description
    });
  });
  return Object
    .keys(map)
    .sort((a,b) => a - b)
    .map(num => map[num]);
}

async function loadTest(testId) {
  try {
    // 1) fetch test metadata
    const respTest = await fetch(`http://localhost:3006/test/${testId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!respTest.ok) throw new Error(`Test fetch failed: ${respTest.status}`);
    const testData = await respTest.json();

    // Set the page title
    document.getElementById('test-title').textContent = testData.name;

    // 2) fetch questions for that test
    const respQs = await fetch(`http://localhost:3006/questions?testId=${testId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!respQs.ok) throw new Error(`Questions fetch failed: ${respQs.status}`);
    const questions = await respQs.json();

    // 3) build your `blocks` array from the questions
    blocks = groupQuestionsToBlocks(questions);

    // 4) kick off the timer
    startTimer(testData.time_limit * 60);

    // 5) initial render
    renderBlocks();
    updateProgressBar();

  } catch (err) {
    console.error(err);
    alert("Ei õnnestu testi laadida. Kontrolli konsooli.");
  }
}

function renderBlocks() {
  const container = document.getElementById("blocks-container");
  container.innerHTML = "";

  blocks.forEach((block, idx) => {
    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    if (idx === currentBlock) blockDiv.classList.add("active");

    const grid = document.createElement("div");
    grid.className = "question-grid";

    block.forEach(q => {
      const wrap = document.createElement("div");
      wrap.className = "question";
      const card = document.createElement("div");
      card.className = "question-card";

      if (q.type === "short") {
        card.innerHTML = `
          <label>${q.text}</label><br/>
          <input type="text" placeholder="Vastus..." />
        `;
      } else {
        card.innerHTML = `
          <label>${q.text}</label><br/>
          <textarea rows="4" placeholder="Pikk vastus..."></textarea>
        `;
      }

      wrap.appendChild(card);
      grid.appendChild(wrap);
    });

    blockDiv.appendChild(grid);
    container.appendChild(blockDiv);
  });
}

function updateProgressBar() {
  const bar = document.getElementById("progress-bar");
  const txt = document.getElementById("progress-text");
  const percent = Math.round(((currentBlock + 1) / blocks.length) * 100);
  bar.style.width = `${percent}%`;
  txt.textContent = `${percent}%`;
}

function moveToNextBlock() {
  const all = document.querySelectorAll(".block");
  if (currentBlock < all.length - 1) {
    all[currentBlock].classList.remove("active");
    currentBlock++;
    all[currentBlock].classList.add("active");
    updateProgressBar();
    if (currentBlock === all.length - 1) {
      document.getElementById("next-button").style.display = "none";
      document.getElementById("end-button").style.display = "inline-block";
    }
  }
}

function startTimer(durationSec) {
  let remaining = durationSec;
  const display = document.getElementById("timer");
  intervalId = setInterval(() => {
    const min = String(Math.floor(remaining/60)).padStart(2, "0");
    const sec = String(remaining%60).padStart(2, "0");
    display.textContent = `${min}:${sec}`;
    if (remaining-- <= 0) {
      clearInterval(intervalId);
      triggerTimeUpPopup();
      document.getElementById("next-button").disabled = true;
    }
  }, 1000);
}

function endTest() {
  clearInterval(intervalId);
  // TODO: gather answers & POST to server...
  alert("Test lõpetatud! Aitäh vastamast.");
}

// get testId from URL: ?testId=...
const params = new URLSearchParams(window.location.search);
const testId = params.get("testId");
if (!testId) {
  alert("Testi ID puudub URL-is!");
} else {
  document.getElementById("next-button")
          .addEventListener("click", moveToNextBlock);
  document.getElementById("end-button")
          .addEventListener("click", endTest);

  loadTest(testId);
}

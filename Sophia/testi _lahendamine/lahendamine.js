
let interval; //Timeri jaoks edaspidi
const blocks = [
  [
    { type: "short", text: "1. Test küsimus" },
    { type: "long", text: "2. Kirjelda..." }
  ],
  [
    { type: "long", text: "3. Kirjelda..." }
  ],
  
];



let currentBlock = 0;
const totalBlocks = blocks.length;

function renderBlocks() {
  const container = document.getElementById("blocks-container");
  container.innerHTML = "";

  blocks.forEach((block, index) => {
    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    if (index === currentBlock) blockDiv.classList.add("active");

    const questionContainer = document.createElement("div");
    questionContainer.className = "question-grid";

    block.forEach((q) => {
      const questionWrapper = document.createElement("div");
      questionWrapper.className = "question"; // uus ümbris igale küsimusele

      const qDiv = document.createElement("div");
      qDiv.className = "question-card";

      if (q.type === "short") {
        qDiv.innerHTML = `
          <label>${q.text}</label><br/>
          <input type="text" placeholder="Vastus..." />
        `;
      } else if (q.type === "long") {
        qDiv.innerHTML = `
          <label>${q.text}</label><br/>
          <textarea placeholder="Pikk vastus..." rows="4"></textarea>
        `;
      }

      questionWrapper.appendChild(qDiv);         // lisa question-card question divi sisse
      questionContainer.appendChild(questionWrapper); // lisa question question-gridi sisse
    });

    blockDiv.appendChild(questionContainer);
    container.appendChild(blockDiv);
  });
}

function updateProgressBar() {
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");
  const percent = Math.round(((currentBlock + 1) / totalBlocks) * 100);
  bar.style.width = `${percent}%`;
  text.textContent = `${percent}%`;
}

function moveToNextBlock() {
  const allBlocks = document.querySelectorAll(".block");

  if (currentBlock < allBlocks.length - 1) {
    allBlocks[currentBlock].classList.remove("active");
    currentBlock++;
    allBlocks[currentBlock].classList.add("active");
    updateProgressBar();

    // Kui jõudsid viimase plokini, näita "Lõpeta"
    if (currentBlock === allBlocks.length - 1) {
      document.getElementById("next-button").style.display = "none";
      document.getElementById("end-button").style.display = "inline-block";
    }
  }
}


function startTimer(duration) {
  let time = duration;
  const timerDisplay = document.getElementById("timer");

  const interval = setInterval(() => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;

    if (--time < 0) {
      clearInterval(interval);
      alert("Aeg sai läbi!");
      document.getElementById("next-button").disabled = true;
      //showPopUP (edaspidi)
    }
  }, 1000);
}


function endTest() {
  clearInterval(interval); // peatab taimeri
  // 1. Kogu kasutaja vastused (näide: kõik input ja textarea väärtused)
  //const responses = [];
  //document.querySelectorAll(".block.active input, .block.active textarea").forEach(el => {
    //responses.push(el.value);
  //});

  // 2.koodi mis salvestab vastused andmebaasi või saadab serverisse
  // Näiteks:
  // fetch('/save-responses', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ responses })
  // });
  //   .then(response => response.json())
  //   .then(data => console.log('Success:', data))
  //   .catch((error) => console.error('Error:', error));   
  alert("Test lõpetatud! Aitäh vastamast.");
}

// Test setup
document.getElementById("next-button").addEventListener("click", moveToNextBlock);
renderBlocks();
updateProgressBar();
startTimer(120);
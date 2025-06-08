// muutja vaade

let answerCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("previewData");
  if (stored) {
    const data = JSON.parse(stored);
    const questionField = document.getElementById("question");
    questionField.value = data.question;
    adjustTextarea(questionField);
    document.getElementById("answerType").value = data.answerType;
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    answerCount = 0;
    data.options.forEach(option => {
      addAnswer();
      const lastOption = answersDiv.lastChild;
      if (lastOption) {
        const textarea = lastOption.querySelector('textarea[name="answerText"]');
        if (textarea) {
          textarea.value = option.text;
          adjustTextarea(textarea);
        }
        const input = lastOption.querySelector('input[type="radio"], input[type="checkbox"]');
        if (input && option.isCorrect) {
          input.checked = true;
        }
      }
    });
  }
});

document.getElementById("answerType").addEventListener("change", () => {
  const newType = document.getElementById("answerType").value;
  const answerOptions = document.querySelectorAll(".answer-option");
  answerOptions.forEach(option => {
    const input = option.querySelector('input[type="radio"], input[type="checkbox"]');
    if (input) {
      input.type = newType === "single" ? "radio" : "checkbox";
      input.style.transform = "scale(1.3)";
      input.style.marginRight = "10px";
    }
  });
  if (newType === "single") {
    const radios = document.querySelectorAll(".answer-option input[type='radio']");
    let anyChecked = false;
    radios.forEach(radio => { if (radio.checked) anyChecked = true; });
    if (!anyChecked && radios.length > 0) {
      radios[0].checked = true;
    }
  }
});

document.getElementById("question").addEventListener("input", e => adjustTextarea(e.target));
adjustTextarea(document.getElementById("question"));

function addAnswer() {
  const type = document.getElementById("answerType").value;
  const container = document.getElementById("answers");
  const div = document.createElement("div");
  div.className = "answer-option";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.width = "40%";
  div.style.margin = "0 auto 10px";
  div.innerHTML = `
    <input type="${type === "single" ? "radio" : "checkbox"}" name="correct" value="${answerCount}">
    <textarea rows="1" placeholder="Vastusevariant" name="answerText" class="resizable"></textarea>
  `;
  container.appendChild(div);
  const input = div.querySelector("input");
  input.style.transform = "scale(1.3)";
  input.style.marginRight = "10px";
  const textarea = div.querySelector('textarea[name="answerText"]');
  textarea.addEventListener("input", e => adjustTextarea(e.target));
  adjustTextarea(textarea);
  if (type === "single") {
    const radios = document.querySelectorAll(".answer-option input[type='radio']");
    let anyChecked = false;
    radios.forEach(radio => { if (radio.checked) anyChecked = true; });
    if (!anyChecked) {
      input.checked = true;
    }
  }
  answerCount++;
}

function getFormData() {
  const question = document.getElementById("question").value;
  const answerType = document.getElementById("answerType").value;
  const options = Array.from(document.querySelectorAll(".answer-option")).map(el => {
    const isCorrect = el.querySelector('input[type="radio"], input[type="checkbox"]').checked;
    const text = el.querySelector('textarea[name="answerText"]').value;
    return { text, isCorrect };
  });
  return { question, answerType, options };
}

function preview() {
  const data = getFormData();
  localStorage.setItem("previewData", JSON.stringify(data));
  window.location.href = "index2.html";
}

function save() {
  const data = getFormData();
  fetch("/save-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => {
    if (res.ok) alert("Salvestatud!");
    else alert("Viga salvestamisel!");
  });
}

function adjustTextarea(el) {
  if (el.id === "question") {
    el.style.width = "40%";
  } else {
    el.style.width = "100%";
  }
  el.style.height = "auto";
  el.style.overflow = "hidden";
  el.style.height = el.scrollHeight + "px";
}

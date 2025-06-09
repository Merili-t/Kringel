let answerOptions = [];
function updatePreview() {
  const previewContainer = document.getElementById("preview");
  previewContainer.innerHTML = "";
  const imageElement = document.getElementById("imageUploadBox").querySelector("img");
  if (imageElement) {
    let clonedImg = imageElement.cloneNode(true);
    previewContainer.appendChild(clonedImg);
  }
  const questionPreview = document.createElement("div");
  questionPreview.className = "question-preview";
  questionPreview.textContent = document.getElementById("question").value;
  previewContainer.appendChild(questionPreview);
  const optionsContainer = document.createElement("div");
  optionsContainer.id = "optionsPreviewContainer";
  previewContainer.appendChild(optionsContainer);
  renderAnswerOptions();
}
function renderAnswerOptions() {
  const optionsContainer = document.getElementById("optionsPreviewContainer");
  optionsContainer.innerHTML = "";
  const type = document.getElementById("answerType").value;
  answerOptions.forEach((option, index) => {
    const row = document.createElement("div");
    row.className = "preview-option";
    const input = document.createElement("input");
    input.type = type === "single" ? "radio" : "checkbox";
    input.name = "previewAnswer";
    input.checked = option.isCorrect;
    input.addEventListener("change", () => {
      if (type === "single") {
        answerOptions.forEach(op => op.isCorrect = false);
        option.isCorrect = true;
      } else {
        option.isCorrect = input.checked;
      }
      renderAnswerOptions();
    });
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = option.text;
    textInput.style.flexGrow = "1";
    textInput.addEventListener("input", (e) => {
      option.text = e.target.value;
    });
    const upBtn = document.createElement("button");
    upBtn.textContent = "▲";
    upBtn.addEventListener("click", () => {
      if (index > 0) {
        [answerOptions[index - 1], answerOptions[index]] = [answerOptions[index], answerOptions[index - 1]];
        renderAnswerOptions();
      }
    });
    const downBtn = document.createElement("button");
    downBtn.textContent = "▼";
    downBtn.addEventListener("click", () => {
      if (index < answerOptions.length - 1) {
        [answerOptions[index + 1], answerOptions[index]] = [answerOptions[index], answerOptions[index + 1]];
        renderAnswerOptions();
      }
    });
    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => {
      answerOptions.splice(index, 1);
      renderAnswerOptions();
    });
    row.appendChild(input);
    row.appendChild(textInput);
    row.appendChild(upBtn);
    row.appendChild(downBtn);
    row.appendChild(delBtn);
    optionsContainer.appendChild(row);
  });
}
document.getElementById("addOptionLeftBtn").addEventListener("click", () => {
  const text = prompt("Sisesta vastusevariant:");
  if (text && text.trim()) {
    let isCorrectDefault = false;
    if (document.getElementById("answerType").value === "single" && answerOptions.length === 0) {
      isCorrectDefault = true;
    }
    answerOptions.push({ text: text.trim(), isCorrect: isCorrectDefault });
    updatePreview();
  }
});
document.getElementById("answerType").addEventListener("change", updatePreview);
document.getElementById("question").addEventListener("input", updatePreview);
const imageUploadBox = document.getElementById("imageUploadBox");
const questionImageInput = document.getElementById("questionImage");
imageUploadBox.addEventListener("click", () => {
  questionImageInput.click();
});
questionImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      imageUploadBox.innerHTML = "";
      const img = document.createElement("img");
      img.src = evt.target.result;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      imageUploadBox.appendChild(img);
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Eemalda pilt";
      removeBtn.className = "red-btn";
      removeBtn.addEventListener("click", () => {
        questionImageInput.value = "";
        imageUploadBox.innerHTML = '<span class="upload-icon">&#128247;</span>';
        updatePreview();
      });
      imageUploadBox.appendChild(removeBtn);
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
});
function clearQuestionForm() {
  document.getElementById("question").value = "";
  answerOptions = [];
  updatePreview();
  document.getElementById("questionImage").value = "";
  document.getElementById("imageUploadBox").innerHTML = '<span class="upload-icon">&#128247;</span>';
  document.getElementById("points").value = 20;
  document.getElementById("autoCheck").checked = false;
}
document.getElementById("saveQuestionBtn").addEventListener("click", () => {
  const data = {
    question: document.getElementById("question").value.trim(),
    answerType: document.getElementById("answerType").value,
    points: document.getElementById("points").value,
    autoCheck: document.getElementById("autoCheck").checked,
    answerOptions: answerOptions
  };
  if (!data.question) {
    alert("Palun sisesta küsimus.");
    return;
  }
  if (answerOptions.length < 2) {
    alert("Palun lisa vähemalt kaks vastusevariant.");
    return;
  }
  console.log("Saving data:", data);
  alert("Küsimus on salvestatud!");
});
updatePreview();

//eelvaade
const data = JSON.parse(localStorage.getItem("previewData"));
const container = document.getElementById("preview");

const wrapper = document.createElement("div");
wrapper.style.width = "40%";
wrapper.style.margin = "0 auto";
wrapper.style.textAlign = "left";

const questionEl = document.createElement("h3");
questionEl.textContent = data.question;
questionEl.style.marginBottom = "10px";
questionEl.style.fontWeight = "bold";
questionEl.style.wordWrap = "break-word";
wrapper.appendChild(questionEl);

const optionsBox = document.createElement("div");
optionsBox.style.backgroundColor = "white";
optionsBox.style.borderRadius = "10px";
optionsBox.style.padding = "15px";
optionsBox.style.boxSizing = "border-box";
optionsBox.style.width = "100%";
optionsBox.style.marginTop = "10px";

data.options.forEach((opt, index) => {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.margin = "5px 0";

  const input = document.createElement("input");
  input.type = data.answerType === "single" ? "radio" : "checkbox";
  input.name = "answer";
  input.value = index;
  input.style.transform = "scale(1.3)";
  input.style.marginRight = "10px";

  const label = document.createElement("label");
  label.textContent = opt.text;
  label.style.margin = "0";

  div.appendChild(input);
  div.appendChild(label);
  optionsBox.appendChild(div);
});

wrapper.appendChild(optionsBox);
container.appendChild(wrapper);

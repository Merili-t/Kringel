import createFetch from "./utils/createFetch"; 
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("questionForm");

  form.addEventListener("submit", handleSaveQuestion); 
});

async function handleSaveQuestion(e) {
  e.preventDefault();
  const form = document.getElementById("questionForm");

  const questionText = form.querySelector("#question-text").value.trim();
  if (!questionText) {
    alert("Palun sisesta küsimuse tekst!");
    return;
  }

  const fileInput = form.querySelector("#file-input");
  const imageFile = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

  const additionalPointsCheckbox = form.querySelector("#additional-points");
  const points =
    additionalPointsCheckbox && additionalPointsCheckbox.checked
      ? form.querySelector("#points-input").value.trim()
      : "";

  const autoControl = form.querySelector("#auto-control")?.checked;

  const dropdownSelected = form.querySelector("#dropdown-selected");
  let answerType = "";
  if (dropdownSelected) {
    answerType = dropdownSelected.getAttribute("data-value");
    if (!answerType || answerType === "Vali vastusetüüp...") {
      answerType = dropdownSelected.textContent.trim();
    }
  }

  try {
    let result;

    if (imageFile) {
      // If an image is present, build a FormData object
      const formData = new FormData();
      formData.append("questionText", questionText);
      formData.append("points", points);
      formData.append("autoControl", autoControl);
      formData.append("answerType", answerType);
      formData.append("image", imageFile);

      // Use fetch directly since createFetch is designed for JSON payloads
      const response = await fetch("http://localhost:3006/question/upload", {
        method: "POST",
        body: formData
      });
      result = await response.json();
    } else {
      // Use createFetch to send the JSON payload
      result = await createFetch("/question/upload", "POST", {
        questionText,
        points,
        autoControl,
        answerType
      });
    }

    if (result.error) {
      alert("Küsimuse salvestamine ebaõnnestus.");
    } else {
      alert(result.message || "Küsimus salvestatud edukalt!");
      // Optionally, reset the form to clear the input fields
      form.reset();
    }
  } catch (error) {
    console.error("Error saving question:", error);
    alert("Midagi läks valesti salvestamisel.");
  }
}

function toggleVisibility(icon) {
  const input = icon.previousElementSibling;
  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁";
  }
}

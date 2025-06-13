import createFetch from "../script/utils/createFetch.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="saveTest"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Test salvestatud", "Test on edukalt salvestatud.", [
        {
          text: "OK",
          action: async () => {
            const questionText = document.getElementById("question-text").value.trim();
            if (!questionText) {
              alert("Palun sisesta küsimuse tekst!");
              return;
            }

            const fileInput = document.getElementById("file-input");
            const imageFile = fileInput.files.length > 0 ? fileInput.files[0] : null;

            const additionalPointsCheckbox = document.getElementById("additional-points");
            const points = additionalPointsCheckbox.checked
              ? document.getElementById("points-input").value.trim()
              : "";

            const autoControl = document.getElementById("auto-control").checked;

            const dropdownSelected = document.getElementById("dropdown-selected");
            let answerType = dropdownSelected.getAttribute("data-value");
            if (!answerType || answerType === "Vali vastusetüüp...") {
              answerType = dropdownSelected.textContent.trim();
            }

            try {
              let result;

              if (imageFile) {
                // Use FormData manually when image is present
                const formData = new FormData();
                formData.append("questionText", questionText);
                formData.append("points", points);
                formData.append("autoControl", autoControl);
                formData.append("answerType", answerType);
                formData.append("image", imageFile);

                const response = await fetch("http://localhost:3006/questions/save", {
                  method: "POST",
                  body: formData
                });
                result = await response.json();
              } else {
                // Use createFetch when no image is present
                result = await createFetch('/questions/save', 'POST', {
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
                closePopup();
              }
            } catch (error) {
              console.error("Error saving question:", error);
              alert("Midagi läks valesti salvestamisel.");
            }
          }
        }
      ]);
    });
  });
});
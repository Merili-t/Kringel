document.addEventListener("DOMContentLoaded", () => {
  // Attach the event handler for each element that has the data-popup="saveTest" attribute.
  document.querySelectorAll('[data-popup="saveTest"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Test salvestatud", "Test on edukalt salvestatud.", [
        {
          text: "OK",
          action: async () => {
            // --- Gather question data from the form elements ---
            // Question text from the textarea:
            const questionText = document.getElementById("question-text").value.trim();
            if (!questionText) {
              alert("Palun sisesta küsimuse tekst!");
              return;
            }

            // File input for an optional image:
            const fileInput = document.getElementById("file-input");
            const imageFile = fileInput.files.length > 0 ? fileInput.files[0] : null;

            // Checkbox for additional points and its points input:
            const additionalPointsCheckbox = document.getElementById("additional-points");
            const points = additionalPointsCheckbox.checked
              ? document.getElementById("points-input").value.trim()
              : "";
            
            // Auto-control checkbox:
            const autoControl = document.getElementById("auto-control").checked;

            // Retrieve the selected answer type from the dropdown.
            // Assuming the element with id "dropdown-selected" holds a data attribute "data-value" or text content.
            const dropdownSelected = document.getElementById("dropdown-selected");
            let answerType = dropdownSelected.getAttribute("data-value");
            if (!answerType || answerType === "Vali vastusetüüp...") {
              answerType = dropdownSelected.textContent.trim();
            }

            // --- Prepare the request payload ---
            // (The endpoint and fetchOptions are defined here for reference)
            const endpoint = "http://localhost:3006/questions/save";
            let fetchOptions;

            // If an image file is selected, use FormData to send multipart/form-data.
            if (imageFile) {
              const formData = new FormData();
              formData.append("questionText", questionText);
              formData.append("points", points);
              formData.append("autoControl", autoControl);
              formData.append("answerType", answerType);
              formData.append("image", imageFile); 
              fetchOptions = {
                method: "POST",
                body: formData
              };
            } else {
              const data = {
                questionText,
                points,
                autoControl,
                answerType
              };
              fetchOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              };
            }

            // --- Stub for saving the question ---
            console.log("Simulating save to", endpoint, "with options:", fetchOptions);
            // Simulate network delay then "return" a successful response.
            setTimeout(() => {
              const result = { message: "Küsimus salvestatud edukalt! (Stub)" };
              alert(result.message);
              closePopup();
            }, 500);

            // --- End of stub ---
            /*
            // Original fetch call (removed in stub):
            try {
              const response = await fetch(endpoint, fetchOptions);
              const result = await response.json();
              alert(result.message || "Küsimus salvestatud edukalt!");
              closePopup();
            } catch (error) {
              console.error("Error saving question:", error);
              alert("Küsimuse salvestamine ebaõnnestus.");
            }
            */
          }
        }
      ]);
    });
  });
});

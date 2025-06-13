import createFetch from "./utils/createFetch";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[data-popup="delete"]').forEach(button => {
    button.addEventListener("click", () => {
      const testId = button.dataset.testId;
      
      showPopup("Kustuta", "Kas oled kindel, et soovid selle kustutada?", [
        {
          text: "Kustuta",
          action: () => handleDelete(testId)
        },
        { text: "Tühista", cancel: true }
      ]);
    });
  });
});

async function handleDelete(testId) {
  const data = {
    type: "kustuta",
    test_id: testId
  };

  try {
    // Replace '/test' with the correct endpoint for deleting a test from your database.
    const result = await createFetch("/test/delete", "DELETE", data);
    alert(result.message || "Testi kustutamine õnnestus.");
    clearQuestionForm();
    closePopup();
    // Optionally, remove the deleted test's element from the DOM if needed.
  } catch (error) {
    console.error("Viga testi kustutamisel:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
  }
}

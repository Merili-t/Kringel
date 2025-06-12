document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="delete"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Kustuta", "Kas oled kindel, et soovid selle kustutada?", [
        {
          text: "Kustuta",
          action: () => {
            setTimeout(() => {
              alert("Kustutamine õnnestus (stub).");
              clearQuestionForm();
              closePopup();
            }, 500);
          }
        },
        { text: "Tühista", cancel: true }
      ]);
    });
  });
});

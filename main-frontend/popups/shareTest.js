document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="shareTest"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Jaga testi", "Vali jagamise viis:", [
        {
          text: "Lingina",
          action: () => triggerPopup("link")
        },
        {
          text: "PDF",
          action: () => triggerPopup("pdfConfirm")  
        },
        {
          text: "Tühista",
          cancel: true
        }
      ]);
    });
  });
});

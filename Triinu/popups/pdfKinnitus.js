document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="pdfKinnitus"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("PDF allalaadimine", "Kas soovid PDF-i alla laadida?", [
        {
          text: "Lae alla",
          action: () => triggerPopup("pdf")
        },
        {
          text: "Tühista",
          cancel: true
        }
      ]);
    });
  });
});

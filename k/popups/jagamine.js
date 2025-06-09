document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="jagamine"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Jaga testi", "Vali jagamise viis:", [
        {
          text: "Lingina",
          action: () => triggerPopup("link")
        },
        {
          text: "PDF",
          action: () => triggerPopup("pdfKinnitus")  
        },
        {
          text: "Tühista",
          cancel: true
        }
      ]);
    });
  });
});

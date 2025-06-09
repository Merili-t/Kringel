document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="logout"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Logi valja", "Kas oled kindel, et soovid valja logida?", [
        { 
          text: "Jah", 
          action: () => {
            window.location.href = "../../Triinu/Konto/login/login.html";
          } 
        },
        { text: "Ei", cancel: true }
      ]);
    });
  });
});

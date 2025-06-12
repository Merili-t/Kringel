document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="logout"]').forEach((button) => {
    button.addEventListener("click", () => {
      showPopup(
        "Logi välja",
        "Kas oled kindel, et soovid välja logida?",
        [
          { 
            text: "Jah", 
            action: async () => {
              // Stub: simulate network delay and logout success.
              setTimeout(() => {
                alert("Oled välja logitud! (Stub)");
                window.location.href = "login.html";
              }, 500);
            } 
          },
          { 
            text: "Ei", 
            cancel: true 
          }
        ]
      );
    });
  });
});

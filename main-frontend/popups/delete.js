document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="delete"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Kustuta", "Kas oled kindel, et soovid selle kustutada?", [
        {
          text: "Kustuta",
          action: () => {
            fetch("../php/popups.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: "type=kustuta&test_id=123"
            })
              .then(res => res.text())
              .then(msg => {
                alert(msg);
                clearQuestionForm();
                closePopup();
              });
          }
        },
        { text: "Tühista", cancel: true }
      ]);
    });
  });
});

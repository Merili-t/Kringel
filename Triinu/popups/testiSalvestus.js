document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="testiSalvestus"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Test salvestatud", "Test on edukalt salvestatud.", [
        {
          text: "OK",
          action: () => {
            fetch("popups.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: "type=testiSalvestus&testisooritus_id=123&lahendaja_id=456"
            })
              .then(res => res.text())
              .then(msg => {
                alert(msg);
                closePopup();
                window.location.href = "index.html";
              });
          }
        }
      ]);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="aegOtsas"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Aeg sai otsa", "Testi tegemise aeg on läbi.", [
        {
          text: "OK",
          action: () => {
            fetch("popups.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: "type=testiSalvestus&testisooritus_id=123&lahendaja_id=456"
            })
              .then(() => {
                window.location.href = "index.html";
              });
          }
        }
      ]);
    });
  });
});

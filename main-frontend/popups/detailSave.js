document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="detailSave"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Salvesta", "Kas soovid muudatused salvestada?", [
        {
          text: "Salvesta",
          action: () => {
            fetch("../php/popups.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: "type=detailiSalvestus&some_field=muudetudV22rtus&test_id=123"
            })
              .then(res => res.text())
              .then(msg => {
                alert(msg);
                closePopup();
              });
          }
        },
        { text: "Tühista", cancel: true }
      ]);
    });
  });
});

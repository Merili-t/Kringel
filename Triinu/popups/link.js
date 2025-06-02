document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="link"]').forEach(button => {
    button.addEventListener("click", () => {
      fetch("popups.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "type=link&test_id=123"
      })
        .then(res => res.text())
        .then(link => {
          navigator.clipboard.writeText(link);
          showPopup("Link kopeeritud", link, [
            { text: "Tagasi", action: () => triggerPopup("jagamine") }
          ]);
        });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="link"]').forEach(button => {
    button.addEventListener("click", () => {
      const link = window.location.origin + "/index.html";
      
      navigator.clipboard.writeText(link)
        .then(() => {
          showPopup("Link kopeeritud", link, [
            { text: "Tagasi", action: () => triggerPopup("shareTest") }
          ]);
        })
        .catch(err => {
          console.error("Clipboard error:", err);
          alert("Linki ei õnnestunud kopeerida.");
        });
    });
  });
});

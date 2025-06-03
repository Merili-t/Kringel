document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="esitatud"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Test esitatud", "Sinu vastused on edukalt esitatud.", [
        { text: "Tagasi avalehele", action: () => window.location.href = "index.html" }
      ]);
    });
  });
});

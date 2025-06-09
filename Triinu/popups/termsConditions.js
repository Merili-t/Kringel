document.addEventListener("DOMContentLoaded", function () {
  const termsLink = document.getElementById("termsLink");
  const termsPopup = document.getElementById("terms-popup");
  const overlay = document.getElementById("overlay");

  if (termsLink) {
    termsLink.addEventListener("click", function (e) {
      e.preventDefault();
      termsPopup.style.display = "block";
      overlay.style.display = "block";
    });
  }

  const closeElements = document.querySelectorAll(".pdf-close, .pdf-popup-btn");
  closeElements.forEach(el => {
    el.addEventListener("click", function () {
      termsPopup.style.display = "none";
      overlay.style.display = "none";
    });
  });
});

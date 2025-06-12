document.addEventListener("DOMContentLoaded", function () {
  const forgotLink = document.getElementById("forgot-password-link");
  const forgotPopup = document.getElementById("forgot-popup");
  const overlay = document.getElementById("overlay");
  const cancelReset = document.getElementById("cancel-reset");
  const sendReset = document.getElementById("send-reset");

  if (forgotLink) {
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      forgotPopup.style.display = "block";
      overlay.style.display = "block";
    });
  }

  if (cancelReset) {
    cancelReset.addEventListener("click", function () {
      forgotPopup.style.display = "none";
      overlay.style.display = "none";
    });
  }

  if (sendReset) {
    sendReset.addEventListener("click", async function () {
      const emailInput = document.getElementById("reset-email");
      const email = emailInput.value.trim();
      if (!email) {
        alert("Palun sisesta email.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Palun sisesta kehtiv email.");
        return;
      }
      try {
        // Stub: simulate sending a password reset email.
        console.log("Simulating password reset request for email:", email);
        setTimeout(() => {
          // Simulate a successful response from the server.
          alert("Parooli lähtestuse juhised saadetud! (Stub)");
          forgotPopup.style.display = "none";
          overlay.style.display = "none";
        }, 500);
      } catch (error) {
        console.error("Viga:", error);
        alert("Midagi läks valesti.");
      }
    });
  }
});

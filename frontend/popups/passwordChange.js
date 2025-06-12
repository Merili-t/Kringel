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
        const formData = new FormData();
        formData.append("email", email);
        const response = await fetch("http://localhost:3006/user/password???", { 
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
          forgotPopup.style.display = "none";
          overlay.style.display = "none";
        }
      } catch (error) {
        console.error("Viga:", error);
        alert("Midagi läks valesti.");
      }
    });
  }
});

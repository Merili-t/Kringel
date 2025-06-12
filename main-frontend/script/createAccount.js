document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createForm");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;

    if (!email || !password || !confirmPassword) {
      alert("Kõik väljad peavad olema täidetud.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Palun sisesta kehtiv email.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Paroolid ei kattu.");
      return;
    }
    if (password.length < 8) {
      alert("Parool peab olema vähemalt 8 tähemärki.");
      return;
    }

    const formData = new FormData(form);
  });
});

function toggleVisibility(icon) {
  const input = icon.previousElementSibling;
  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createForm");
  form.addEventListener("submit", (e) => {
    const password = form.password.value.trim();
    const confirmPassword = form.confirm_password.value.trim();

    if (password !== confirmPassword) {
      e.preventDefault();
      alert("Paroolid ei ühti. Palun proovi uuesti.");
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`\\|=]).{8,}$/;
    if (!passwordPattern.test(password)) {
      e.preventDefault();
      alert("Parool peab olema vähemalt 8 tähemärki ja sisaldama tähti, numbreid ning sümboleid.");
      return;
    }
  });
});

function toggleVisibility(icon) {
  const input = icon.previousElementSibling;
  input.type = input.type === "password" ? "text" : "password";
  icon.textContent = icon.textContent === "👁" ? "🙈" : "👁";
}

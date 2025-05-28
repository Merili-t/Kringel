document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email && !password) {
      alert("Palun sisesta email ja parool.");
      return;
    }

    if (!email) {
      alert("Meiliaadress on sisestamata.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Palun sisesta kehtiv meiliaadress.");
      return;
    }

    if (!password) {
      alert("Parooli väli on tühi.");
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch("login.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Sisselogimine õnnestus!");
        window.location.href = "../dashboard.html";
      } else {
        alert(result.error || "Sisselogimine ebaõnnestus.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    }
  });
});
document.getElementById("forgot-password-link").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("forgot-modal").style.display = "block";
});

document.getElementById("cancel-reset").addEventListener("click", function () {
  document.getElementById("forgot-modal").style.display = "none";
});

document.getElementById("send-reset").addEventListener("click", async function () {
  const email = document.getElementById("reset-email").value.trim();

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

    const response = await fetch("forgotPassword.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    alert(result.message);
    if (result.success) {
      document.getElementById("forgot-modal").style.display = "none";
    }
  } catch (error) {
    console.error("Viga:", error);
    alert("Midagi läks valesti.");
  }
});

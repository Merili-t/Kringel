/*document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("createForm");

    form.addEventListener("submit", handleLogin);
  });
*/
  async function handleLogin(e) {
    e.preventDefault();
    const form = document.getElementById("createForm");

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
      alert("Parool on tühi.");
      return;
    }

    try {
      document.cookie = `token=${sessionStorage.getItem('token')}; path=/`;

      const response = await fetch('http://localhost:3006/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.message) {
        sessionStorage.setItem('token', result.token);
        document.cookie = `token=${result.token}; path=/`;

        alert("Sisselogimine õnnestus!");
        window.location.href = result.userType === "admin" ? "admin.html" : "allTests.html";
      } else {
        alert(result.error || "Sisselogimine ebaõnnestus.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    }
  }

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
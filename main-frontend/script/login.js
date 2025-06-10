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
      alert("Parool on tühi.");
      return;
    }

    const formData = new FormData(form);
    // Keeping the fetch call as it was:
    try {
      const response = await fetch('http://localhost:3006/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@kringel.ee',
          password: '1234',
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Sisselogimine õnnestus!");
        window.location.href = "../allTests/allTests.html";
      } else {
        alert(result.error || "Sisselogimine ebaõnnestus.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    }
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

import createFetch from "./utils/createFetch"; // Import in your file

document.addEventListener("DOMContentLoaded", function () { // This is inportat to have 
  const form = document.getElementById("createForm");

  form.addEventListener("submit", handleLogin); // handleLogin has to be a function where you use fetch
});

 
async function handleLogin(e) { // Needs to have async to be able to use fetch
  e.preventDefault();
  const form = document.getElementById("createForm");

  const data = {
    email: form.email.value.trim(),
    password: form.password.value
  }

  try {
    const result = await createFetch('/auth/login', 'POST', data); // createFetch wants (route, method, data) in this order. For POST data is an object and for GET a string

    if (result.message) {
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


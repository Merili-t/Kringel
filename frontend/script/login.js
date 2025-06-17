import createFetch from "./utils/createFetch"; // Import your fetch utility

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createForm");
  if (!form) {
    console.error("Error: Form with id 'createForm' not found.");
    return;
  }
  form.addEventListener("submit", handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();

  const form = document.getElementById("createForm");
  const data = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  console.log("Form data being submitted:", data);

  try {
    const result = await createFetch("/auth/login", "POST", data);
    console.log("Full login result received from server:", result);

    // Normalize user type from possible keys (checking user_type, userType, and userTypeMessage)
    const rawUserType = result.user_type || result.userType || result.userTypeMessage || "";
    const normalizedUserType = rawUserType.trim().toLowerCase();
    console.log("Raw user type from response:", rawUserType);
    console.log("Normalized user type for checking:", normalizedUserType);

    if (result.message || normalizedUserType) {
      const redirectUrl = normalizedUserType === "admin" ? "admin.html" : "allTests.html";
      console.log("Redirecting user to:", redirectUrl);
      window.location.href = redirectUrl;
    } else {
      const errorMsg = result.error || "Sisselogimine ebaõnnestus.";
      console.error("Login error:", errorMsg);
      alert(errorMsg);
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

// Expose toggleVisibility globally so inline onclick handlers can use it.
window.toggleVisibility = toggleVisibility;

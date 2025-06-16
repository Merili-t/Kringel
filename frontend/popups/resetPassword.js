// resetPassword.js
export async function openResetPasswordPopup(email, userId) {
  // Variables to hold the password values.
  let inputPassword = "";
  let inputPasswordConfirm = "";

  // Regular expression to require at least 8 characters, at least one digit, and at least one symbol.
  const passwordRegex = /^(?=.*[0-9])(?=.*[\W_]).{8,}$/;

  // Added rule information in the popup message text.
  showPopup(
    "Muuda parool",
    `Sisesta uus parool kasutajale ${email}.\nParool peab olema vähemalt 8 tähemärki ning sisaldama numbreid ja sümboleid.`,
    [
      {
        text: "Salvesta",
        action: async () => {
          // Check that both fields are filled.
          if (!inputPassword.trim() || !inputPasswordConfirm.trim()) {
            alert("Parooli väljad on tühjad. Parooli ei muudetud.");
            return;
          }
          // Check that both passwords match.
          if (inputPassword !== inputPasswordConfirm) {
            alert("Sisestatud paroolid ei kattu.");
            return;
          }
          // Validate password: at least 8 characters including numbers and symbols.
          if (!passwordRegex.test(inputPassword)) {
            alert("Parool peab olema vähemalt 8 tähemärki, sisaldama numbreid ning sümboleid.");
            return;
          }
          try {
            // Use PATCH on /admin/update.
            // Payload uses "email", "password" and "id" per backend expectations.
            const response = await fetch('http://localhost:3006/admin/update', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',  // Ensure cookies/token are sent.
              body: JSON.stringify({ email, password: inputPassword, id: userId })
            });
            const result = await response.json();
            if (result.message) {
              alert(`Parool muudetud: ${email}`);
              closePopup(); // Closes the popup (assumes closePopup() is defined in popupHelper.js)
            } else {
              alert(result.error || "Parooli muutmine ebaõnnestus.");
            }
          } catch (error) {
            console.error("Fetch error:", error);
            alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
          }
        }
      },
      { text: "Tühista", cancel: true }
    ]
  );

  // Ensure the popup is rendered before inserting the input fields.
  setTimeout(() => {
    const actions = document.getElementById("popup-actions");
    if (actions) {
      // Create a container for both password inputs.
      const container = document.createElement("div");
      container.className = "popup-input-container";
      
      // Create new password field with toggle.
      const passwordDiv = document.createElement("div");
      passwordDiv.className = "password-input-wrapper";
      const passwordInput = document.createElement("input");
      passwordInput.type = "password";
      passwordInput.placeholder = "Uus parool";
      passwordInput.className = "popup-input";
      passwordInput.addEventListener("input", (e) => {
        inputPassword = e.target.value;
      });
      const togglePass = document.createElement("span");
      togglePass.textContent = "👁";
      togglePass.className = "toggle-password";
      togglePass.style.cursor = "pointer";
      togglePass.addEventListener("click", () => {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          togglePass.textContent = "🙈";
        } else {
          passwordInput.type = "password";
          togglePass.textContent = "👁";
        }
      });
      passwordDiv.appendChild(passwordInput);
      passwordDiv.appendChild(togglePass);
      
      // Create confirm password field with toggle.
      const confirmDiv = document.createElement("div");
      confirmDiv.className = "password-input-wrapper";
      const confirmInput = document.createElement("input");
      confirmInput.type = "password";
      confirmInput.placeholder = "Korda parooli";
      confirmInput.className = "popup-input";
      confirmInput.addEventListener("input", (e) => {
        inputPasswordConfirm = e.target.value;
      });
      const toggleConfirm = document.createElement("span");
      toggleConfirm.textContent = "👁";
      toggleConfirm.className = "toggle-password";
      toggleConfirm.style.cursor = "pointer";
      toggleConfirm.addEventListener("click", () => {
        if (confirmInput.type === "password") {
          confirmInput.type = "text";
          toggleConfirm.textContent = "🙈";
        } else {
          confirmInput.type = "password";
          toggleConfirm.textContent = "👁";
        }
      });
      confirmDiv.appendChild(confirmInput);
      confirmDiv.appendChild(toggleConfirm);
      
      container.appendChild(passwordDiv);
      container.appendChild(confirmDiv);
      
      // Insert the container at the beginning of the actions area.
      actions.insertAdjacentElement("afterbegin", container);
    }
  }, 0);
}

// Expose the function globally so that admin.js can call it.
window.openResetPasswordPopup = openResetPasswordPopup;

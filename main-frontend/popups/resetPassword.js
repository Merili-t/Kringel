async function resetPassword(email) {
  let inputPassword = "";

  showPopup(
    "Muuda parool",
    `Sisesta uus parool kasutajale ${email}:`,
    [
      {
        text: "Salvesta",
        action: async () => {
          if (inputPassword.trim() !== "") {
            try {
              const response = await fetch('http://localhost:3006/auth/resetPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword: inputPassword })
              });

              const result = await response.json();
              if (result.message) {
                alert(`Parool muudetud: ${email}`);
              } else {
                alert(result.error || "Parooli muutmine ebaõnnestus.");
              }
            } catch (error) {
              console.error("Fetch error:", error);
              alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
            }
          } else {
            alert("Parooli väli oli tühi. Parooli ei muudetud.");
          }
        }
      },
      { text: "Tühista", cancel: true }
    ]
  );

  // Lisa input popupi sisse – enne nuppe
  const actions = document.getElementById("popup-actions");
  const input = document.createElement("input");
  input.type = "password";
  input.placeholder = "Uus parool";
  input.className = "popup-input";
  input.oninput = (e) => inputPassword = e.target.value;

  actions.insertAdjacentElement("afterbegin", input);
}
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
            // Stub: Simulate the async behavior and a successful password reset.
            setTimeout(() => {
              // Simulated result:
              const success = true; // Change as needed to simulate failures.
              if (success) {
                alert(`Parool muudetud: ${email}`);
              } else {
                alert("Parooli muutmine ebaõnnestus.");
              }
            }, 500);
          } else {
            alert("Parooli väli oli tühi. Parooli ei muudetud.");
          }
        }
      },
      { text: "Tühista", cancel: true }
    ]
  );

  // Add the input field inside the popup – before the action buttons.
  const actions = document.getElementById("popup-actions");
  const input = document.createElement("input");
  input.type = "password";
  input.placeholder = "Uus parool";
  input.className = "popup-input";
  input.oninput = (e) => (inputPassword = e.target.value);

  actions.insertAdjacentElement("afterbegin", input);
}

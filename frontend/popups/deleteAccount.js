import createFetch from "../script/utils/createFetch";

document.addEventListener("DOMContentLoaded", function () {
  // Attach event listeners to elements that trigger the deletion,
  // for instance, admin clicking on a delete icon next to a user entry.
  document.querySelectorAll('[data-action="delete-account"]').forEach(button => {
    button.addEventListener("click", () => {
      const email = button.dataset.email;
      showPopup(
        "Kustuta konto",
        `Oled kindel, et soovid kustutada konto: ${email}?`,
        [
          {
            text: "Jah",
            action: () => deleteAccount(email)
          },
          { text: "Ei", cancel: true }
        ]
      );
    });
  });
});

async function deleteAccount(email) {
  try {
    const data = { email };
    const result = await createFetch('/auth/deleteUser', 'DELETE', data);

    if (result.message) {
      alert(`Konto kustutatud: ${email}`);
      loadAccounts(); // Refresh the accounts list after deletion.
    } else {
      alert(result.error || "Konto kustutamine ebaõnnestus.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
  }
}

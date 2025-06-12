async function deleteAccount(email) {
  showPopup(
    "Kustuta konto",
    `Oled kindel, et soovid kustutada konto: ${email}?`,
    [
      {
        text: "Jah",
        action: async () => {
          setTimeout(() => {
            // Simulate a successful deletion:
            alert(`Konto kustutatud: ${email}`);
            loadAccounts(); // Update the accounts list.
          }, 500);
        }
      },
      { text: "Ei", cancel: true }
    ]
  );
}

async function deleteAccount(email) {
  showPopup(
    "Kustuta konto",
    `Oled kindel, et soovid kustutada konto: ${email}?`,
    [
      {
        text: "Jah",
        action: async () => {
          try {
            const response = await fetch('http://localhost:3006/auth/deleteUser', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (result.message) {
              alert(`Konto kustutatud: ${email}`);
              loadAccounts();
            } else {
              alert(result.error || "Konto kustutamine ebaõnnestus.");
            }
          } catch (error) {
            console.error("Fetch error:", error);
            alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
          }
        }
      },
      { text: "Ei", cancel: true }
    ]
  );
}
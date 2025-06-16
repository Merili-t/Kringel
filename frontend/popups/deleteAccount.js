// deleteAccount.js
import createFetch from "../script/utils/createFetch";

export function openDeleteAccountPopup(email, userId) {
  showPopup(
    "Kustuta konto",
    `Oled kindel, et soovid kustutada konto: ${email}?`,
    [
      {
        text: "Jah",
        action: async () => {
          try {
            // Deletion uses the URL parameter: /admin/delete/:id
            const result = await createFetch(`/admin/delete/${userId}`, 'DELETE', null);
            if (result.message) {
              alert(`Konto kustutatud: ${email}`);
              if (window.loadAccounts) window.loadAccounts(); // Refresh the accounts list.
              closePopup();
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

// Expose the function globally.
window.openDeleteAccountPopup = openDeleteAccountPopup;

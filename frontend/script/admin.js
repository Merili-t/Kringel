import createFetch from "./utils/createFetch";

document.addEventListener('DOMContentLoaded', () => {
  loadAccounts();
});

// Load accounts and create table rows with buttons having both email and user id.
async function loadAccounts() {
  const accountsTbody = document.getElementById('accounts-tbody');
  accountsTbody.innerHTML = '';

  try {
    const response = await createFetch("/admin/users", "GET", "");
    // Expect accounts either as an array or wrapped in a property.
    const accounts = Array.isArray(response)
      ? response
      : (response.accounts || response.users || []);
    
    accounts.forEach(account => {
      const userId = account.id;
      const email   = account.email;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${email}</td>
        <td>
          <button class="reset-btn" data-email="${email}" data-user-id="${userId}">Reset Parool</button>
          <button class="delete-btn" data-email="${email}" data-user-id="${userId}">Kustuta</button>
        </td>
      `;
      accountsTbody.appendChild(row);
    });
    
    // Attach event listener for reset password
    document.querySelectorAll('.reset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        const userId = btn.getAttribute('data-user-id');
        if (window.openResetPasswordPopup) {
          window.openResetPasswordPopup(email, userId);
        } else {
          console.error("Reset Password popup function not available.");
        }
      });
    });
    
    // Attach event listener for delete account
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        const userId = btn.getAttribute('data-user-id');
        if (window.openDeleteAccountPopup) {
          window.openDeleteAccountPopup(email, userId);
        } else {
          console.error("Delete Account popup function not available.");
        }
      });
    });
  } catch (error) {
    console.error('Failed to load accounts:', error);
    showPopup(
      "Viga",
      "Kasutajakontode laadimine ebaõnnestus. Palun proovi hiljem uuesti.",
      [{ text: "OK", cancel: true }]
    );
  }
}

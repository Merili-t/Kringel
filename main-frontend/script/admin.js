document.addEventListener('DOMContentLoaded', function () {
  loadAccounts();
});

// Function to load teacher accounts from the backend
async function loadAccounts() {
  const accountsTbody = document.getElementById('accounts-tbody');
  accountsTbody.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3006/auth/getUsers'); // Adjust the endpoint to match your API
    const accounts = await response.json();

    accounts.forEach(account => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${account.email}</td>
        <td>
          <button class="reset-btn" onclick="resetPassword('${account.email}')">Reset Parool</button>
          <button class="delete-btn" onclick="deleteAccount('${account.email}')">Kustuta</button>
        </td>
      `;
      accountsTbody.appendChild(row);
    });
  } catch (error) {
    console.error('Failed to load accounts:', error);
    showPopup(
      "Viga",
      "Kasutajakontode laadimine ebaõnnestus. Palun proovi hiljem uuesti.",
      [
        { text: "OK", cancel: true }
      ]
    );
  }
}

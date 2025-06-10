// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  loadAccounts();
});

// Function to load teacher accounts (replace with API call as needed)
function loadAccounts() {
  const accountsTbody = document.getElementById('accounts-tbody');
  accountsTbody.innerHTML = '';

  // Example teacher accounts; in a production system, fetch this data securely.
  const accounts = [
    { email: 'teacher1@school.edu' },
    { email: 'teacher2@school.edu' },
    { email: 'teacher3@school.edu' }
  ];

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
}

// Function to change a teacher's password (simulate with prompt)
function resetPassword(email) {
  let newPass = prompt(`Sisesta uus parool ${email} jaoks:`);
  if (newPass !== null && newPass.trim() !== "") {
    // Simulate API call to change password here.
    alert(`Parool muudetud ${email} jaoks!`);
    // Optionally update local data if needed.
  } else {
    alert("Uus parool ei olnud sisestatud. Parooli ei muudetud.");
  }
}

// Function to delete a teacher's account
function deleteAccount(email) {
  if (confirm(`Oled kindel, et soovid kustutada kontot ${email}?`)) {
    // Simulate API call to delete the account.
    alert(`Konto kustutatud: ${email}`);
    // After deletion, reload the accounts; in a real app, re-fetch the list from the server.
    loadAccounts();
  }
}

// Optional: Global navigation function
function navigateTo(page) {
  // For this example, simply alert navigation.
  // In a real integration, change window.location.href or use a router.
  alert(`Navigeeri lehele: ${page}`);
}

// Optional: Logout function
function logout() {
  if (confirm('Oled kindel, et soovid välja logida?')) {
    alert('Välja logitud!');
    // Add your logout logic, e.g. window.location.href = 'login.html';
  }
}

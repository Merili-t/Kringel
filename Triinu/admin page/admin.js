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

// Function to reset a teacher's password
function resetPassword(email) {
  if (confirm(`Reset password for ${email}?`)) {
    // Example: trigger an API call to reset password 
    alert(`Parooli lähtestamise protsess algas ${email} jaoks.`);
    // Your backend logic would generate a new password or let the teacher set one.
  }
}

// Function to delete a teacher's account
function deleteAccount(email) {
  if (confirm(`Oled kindel, et soovid kustutada kontot ${email}?`)) {
    // Example: trigger an API call to delete the account.
    alert(`Kontot kustutati: ${email}`);
    // After deletion, reload the accounts
    loadAccounts();
  }
}

// Optional: You can add global navigation functions if needed.
function navigateTo(page) {
  // For this example, simply alert navigation.
  // In your integration, you might set window.location.href or use a router.
  alert(`Navigeeri lehele: ${page}`);
}

// Optional: logout function for the admin panel
function logout() {
  if (confirm('Oled kindel, et soovid välja logida?')) {
    alert('Välja logitud!');
    // Add your logout logic, e.g. window.location = 'login.html';
  }
}

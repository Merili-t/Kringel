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
    alert('Kasutajakontode laadimine ebaõnnestus.');
  }
}

// Function to change a teacher's password in the database
async function resetPassword(email) {
  let newPass = prompt(`Sisesta uus parool ${email} jaoks:`);
  if (newPass !== null && newPass.trim() !== "") {
    try {
      const response = await fetch('http://localhost:3006/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: newPass })
      });

      const result = await response.json();
      if (result.message) {
        alert(`Parool muudetud ${email} jaoks!`);
      } else {
        alert(result.error || "Parooli muutmine ebaõnnestus.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    }
  } else {
    alert("Uus parool ei olnud sisestatud. Parooli ei muudetud.");
  }
}

// Function to delete a teacher's account from the database
async function deleteAccount(email) {
  if (confirm(`Oled kindel, et soovid kustutada konto ${email}?`)) {
    try {
      const response = await fetch('http://localhost:3006/auth/deleteUser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (result.message) {
        alert(`Konto kustutatud: ${email}`);
        loadAccounts(); // Reload accounts after deletion
      } else {
        alert(result.error || "Konto kustutamine ebaõnnestus.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    }
  }
}

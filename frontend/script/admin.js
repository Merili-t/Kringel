import createFetch from "./utils/createFetch";

document.addEventListener('DOMContentLoaded', function () {
  loadAccounts();
});

async function loadAccounts() {
  const accountsTbody = document.getElementById('accounts-tbody');
  accountsTbody.innerHTML = '';

  try {
    // Fetch the accounts using createFetch in the same style as your login
    const accounts = await createFetch("/auth/getUsers", "GET", "");
    
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

// Temporary function to simulate deletion of an account
async function deleteAccount(email) {
  try {
    // Instead of calling the real backend deletion, we simulate a deletion delay
    const result = await simulateDeleteUser(email);
    console.log("Temporary deletion result:", result);
    // Refresh the accounts list after the simulated deletion
    await loadAccounts();
  } catch (error) {
    console.error("Failed to delete account:", error);
    alert("Kontot kustutamine ebaõnnestus. Palun proovi hiljem uuesti.");
  }
}

function simulateDeleteUser(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate deletion by resolving with a dummy response.
      resolve({ message: "User deletion simulated", deletedEmail: email });
    }, 500);
  });
}

function resetPassword(email) {
  // Implement a similar simulation for resetting the password, or call the real function
  alert(`Resetting password for ${email} (simulation)`);
}
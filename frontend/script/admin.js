import createFetch from "./utils/createFetch";

document.addEventListener('DOMContentLoaded', () => {
    loadAccounts();
});

// Load accounts and create table rows with reset and delete buttons.
async function loadAccounts() {
    const accountsTbody = document.getElementById('accounts-tbody');
    accountsTbody.innerHTML = '';
    
    try {
        const response = await createFetch("/admin/users", "GET");
        // Expect accounts either as an array or wrapped in a property.
        const accounts = Array.isArray(response)
            ? response
            : (response.accounts || response.users || []);
        
        accounts.forEach(account => {
            const userId = account.id;
            const email = account.email;
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

        // Attach event listener for reset password buttons.
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

        // Attach event listener for delete account buttons.
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const userId = btn.getAttribute('data-user-id');
                const email = btn.getAttribute('data-email');
                
                // Show confirmation popup before deletion
                showConfirmationPopup(
                    "Konto kustutamine",
                    `Oled kindel, et tahad kustutada konto: ${email}?\n\nSee tegevus on pöördumatu!`,
                    [
                        { text: "Katkesta", cancel: true },
                        { text: "Jah, kustuta", action: () => deleteAccount(userId) }
                    ]
                );
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

// Function to actually delete the account
async function deleteAccount(userId) {
    try {
        // Use native fetch with the correct backend URL (port 3006) and include credentials.
        const response = await fetch(`http://localhost:3006/admin/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            // Optional: Remove or modify the body if your backend doesn't require a payload.
            body: JSON.stringify({ dummy: true })
        });

        // Read response as text in case it's empty.
        const responseText = await response.text();
        let data = {};
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch (jsonErr) {
                console.error("Failed to parse response as JSON:", jsonErr, responseText);
            }
        }

        // Determine success if:
        // 1. The response is ok, AND
        // 2. Either the status is 204 (No Content) OR the message indicates success.
        const success = response.ok && (
            response.status === 204 ||
            (data.message && data.message.toLowerCase().includes("deleted"))
        );

        if (success) {
            showPopup(
                "Edukas",
                "Konto on edukalt kustutatud!",
                [{ text: "OK", cancel: true }]
            );
            loadAccounts(); // Refresh the accounts list.
        } else {
            console.error("Delete response:", data);
            showPopup(
                "Viga",
                "Konto kustutamine ebaõnnestus. Palun proovi hiljem uuesti.",
                [{ text: "OK", cancel: true }]
            );
        }
    } catch (err) {
        console.error("Failed to delete account:", err);
        showPopup(
            "Viga", 
            "Konto kustutamine ebaõnnestus. Palun proovi hiljem uuesti.",
            [{ text: "OK", cancel: true }]
        );
    }
}

// Confirmation popup function (assumes you have a popup system)
function showConfirmationPopup(title, message, buttons) {
    // If you have a custom popup function, use it
    if (window.showPopup) {
        window.showPopup(title, message, buttons);
    } else {
        // Fallback to native confirm dialog
        const confirmed = confirm(`${title}\n\n${message}`);
        if (confirmed) {
            // Find the action button and execute it
            const actionButton = buttons.find(btn => !btn.cancel);
            if (actionButton && actionButton.action) {
                actionButton.action();
            }
        }
    }
}
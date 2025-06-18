import createFetch from "./utils/createFetch";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("createForm");
    
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirm_password.value;
        const userType = form.userType.value; // read from the dropdown using its name "userType"
        
        console.log("Form Data:", { email, password, confirmPassword, userType });
        
        if (!email || !password || !confirmPassword) {
            alert("Kõik väljad peavad olema täidetud.");
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Palun sisesta kehtiv email.");
            return;
        }
        
        if (password !== confirmPassword) {
            alert("Paroolid ei kattu.");
            return;
        }
        
        if (password.length < 8) {
            alert("Parool peab olema vähemalt 8 tähemärki.");
            return;
        }
        
        // Parooli tugevuse kontroll - vähemalt 1 number ja 1 sümbol
        const numberRegex = /\d/; // Vähemalt üks number
        const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // Vähemalt üks sümbol
        
        if (!numberRegex.test(password)) {
            alert("Parool peab sisaldama vähemalt ühte numbrit.");
            return;
        }
        
        if (!symbolRegex.test(password)) {
            alert("Parool peab sisaldama vähemalt ühte sümbolit (!@#$%^&*()_+-=[]{}|;':\"\\,./<>?).");
            return;
        }
        
        try {
            console.log("Sending registration request...");
            // Send the payload with the key "userType"
            const result = await createFetch("/auth/register", "POST", {
                email,
                password,
                userType
            });
            
            console.log("Response received:", result);
            
            if (result.message) {
                alert("Konto loomine õnnestus!");
                
                // Tühjenda vorm ja refreshi lehte pärast edukat registreerimist
                form.reset();
                
                // Lühike delay enne refreshi, et kasutaja jõuaks teatist näha
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } else {
                alert(result.error || "Konto loomine ebaõnnestus.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
        }
    });
});

function toggleVisibility(icon) {
    const input = icon.previousElementSibling;
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈";
    } else {
        input.type = "password";
        icon.textContent = "👁";
    }
}

window.toggleVisibility = toggleVisibility;
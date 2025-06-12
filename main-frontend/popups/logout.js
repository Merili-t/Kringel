document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="logout"]').forEach((button) => {
    button.addEventListener("click", () => {
      showPopup(
        "Logi välja",
        "Kas oled kindel, et soovid välja logida?",
        [
          { 
            text: "Jah", 
            action: async () => {
              try {
                const response = await fetch('http://localhost:3006/auth/logout', {
                  method: "GET", // or GET if your API expects that
                  headers: {
                    "Content-Type": "application/json",
                    // Include authorization headers or credentials if needed
                  }
                  // body: JSON.stringify({ token: yourTokenVariable }), // if required
                });
                const result = await response.json();
                if (result.success) {
                  alert("Oled välja logitud!");
                  window.location.href = "login.html";
                } else {
                  alert(result.error || "Väljalogimine ebaõnnestus.");
                }
              } catch (error) {
                console.error("Logout error:", error);
                alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
              }
            } 
          },
          { 
            text: "Ei", 
            cancel: true 
          }
        ]
      );
    });
  });
});

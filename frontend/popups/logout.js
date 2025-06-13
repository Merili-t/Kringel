import createFetch from "./utils/createFetch";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="logout"]').forEach((button) => {
    button.addEventListener("click", () => {
      showPopup("Logi välja", "Kas oled kindel, et soovid välja logida?", [
        {
          text: "Jah",
          action: async () => {
            try {
              const result = await createFetch("/auth/logout", "GET");
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
        { text: "Ei", cancel: true }
      ]);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="detailSave"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Salvesta", "Kas soovid muudatused salvestada?", [
        {
          text: "Salvesta",
          action: async () => {
            // Prepare data (if needed for logging or future integration)
            const data = {
              test_id: 123,
              some_field: "muudetudV22rtus" 
            };
            console.log("Simulating update with data:", data);
            // Stub: simulate a network delay and a successful update without an actual fetch
            setTimeout(() => {
              alert("Salvestamine õnnestus! (Stub)");
              closePopup();
            }, 500);
          }
        },
        { text: "Tühista", cancel: true }
      ]);
    });
  });
});

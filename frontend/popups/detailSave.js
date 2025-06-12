document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="detailSave"]').forEach(button => {
    button.addEventListener("click", () => {
      showPopup("Salvesta", "Kas soovid muudatused salvestada?", [
        {
          text: "Salvesta",
          action: async () => {
            try {
              const data = {
                test_id: 123,
                some_field: "muudetudV22rtus" 
              };

              const response = await fetch('http://localhost:3006/tests/update', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
              });

              const result = await response.json();
              alert(result.message || "Salvestamine õnnestus!");
            } catch (error) {
              console.error("Error updating test details:", error);
              alert("Salvestamine ebaõnnestus.");
            }
            closePopup();
          }
        },
        { text: "Tühista", cancel: true }
      ]);
    });
  });
});

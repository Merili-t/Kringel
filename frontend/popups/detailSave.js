import createFetch from "./utils/createFetch.js";

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

              const result = await createFetch("/test/upload", "POST", data);
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

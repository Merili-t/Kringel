import createFetch from "../script/utils/createFetch.js";

// Listen for clicks on any element that triggers the delete popup.
document.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest('[data-popup="delete"]');
  if (deleteBtn) {
    e.preventDefault();
    const testId = deleteBtn.dataset.testId;
    console.log("[Client] Delete button clicked for testId:", testId);
    showPopup("Kustuta", "Kas oled kindel, et soovid selle kustutada?", [
      {
        text: "Kustuta",
        action: async () => {
          console.log("[Client] User confirmed deletion for testId:", testId);
          await handleDelete(testId);
        }
      },
      { text: "Tühista", cancel: true }
    ]);
  }
});

async function handleDelete(testId) {
  try {
    console.log("[Client] Initiating DELETE request with createFetch for testId:", testId);
    // Call createFetch with the proper endpoint and DELETE method.
    const result = await createFetch(`/test/delete/${testId}`, "DELETE");
    console.log("[Client] Received response from createFetch:", result);
    
    if (result.error) {
      console.error("[Client] Deletion failed with error:", result.error);
      showPopup("Viga", `Testi kustutamine ebaõnnestus: ${result.error}`, [
        { text: "Sulge", cancel: true }
      ]);
      return false;
    }
    
    console.log("[Client] Test deleted successfully.");
    if (typeof loadTests === "function") {
      console.log("[Client] Reloading tests via loadTests().");
      await loadTests();
    } else if (window.loadTests) {
      console.log("[Client] Reloading tests via window.loadTests().");
      await window.loadTests();
    } else {
      console.warn("[Client] loadTests not available.");
    }
    return true;
  } catch (error) {
    console.error("[Client] Error during deletion:", error);
    showPopup("Viga", "Midagi läks valesti. Proovi hiljem uuesti.", [
      { text: "Sulge", cancel: true }
    ]);
    return false;
  }
}

import createFetch from "../script/utils/createFetch";

document.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest('[data-popup="delete"]');
  if (deleteBtn) {
    e.preventDefault();
    const testId = deleteBtn.dataset.testId;
    showPopup("Kustuta", "Kas oled kindel, et soovid selle kustutada?", [
      {
        text: "Kustuta",
        action: async () => {
          await handleDelete(testId);
        }
      },
      { text: "Tühista", cancel: true }
    ]);
  }
});

async function handleDelete(testId) {
  try {
    const data = {
      type: "kustuta", // Your API might expect this or just the id
      test_id: testId
    };
    const result = await createFetch("/test/delete", "DELETE", data);
    if (result.error) {
      alert("Testi kustutamine ebaõnnestus.");
      return false;
    }
    // Refresh the list after deletion so only that test is removed.
    await loadTests();
    return true;
  } catch (error) {
    console.error("Viga testi kustutamisel:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    return false;
  }
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("end-button").addEventListener("click", () => {
        showPopup("Test esitatud", "Sinu vastused on edukalt esitatud.", [
            { text: "Tagasi avalehele", action: () => window.location.href = "index.html" }
        ]);
    });
});

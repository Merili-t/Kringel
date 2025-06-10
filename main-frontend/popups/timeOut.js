
function triggerTimeUpPopup() {
    showPopup("Aeg sai otsa!", "Sinu vastamiseks määratud aeg on läbi.", [
        { text: "Tagasi avalehele", action: () => window.location.href = "../index.html" }
    ]);
}


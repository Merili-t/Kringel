function showPopup(title, message, buttons) {
  const popup = document.getElementById("custom-popup");
  const overlay = document.getElementById("overlay");

  document.getElementById("popup-title").textContent = title;
  document.getElementById("popup-message").textContent = message;

  const actions = document.getElementById("popup-actions");
  actions.innerHTML = "";

  buttons.forEach(btn => {
    const el = document.createElement("button");
    el.textContent = btn.text;
    el.className = "popup-btn" + (btn.cancel ? " cancel" : "");
    el.onclick = () => { 
      closePopup(); 
      if (typeof btn.action === "function") { 
        btn.action(); 
      } 
    };

    actions.appendChild(el);
  });

  overlay.style.display = "block";
  popup.style.display = "block";
}

function closePopup() {
  document.getElementById("custom-popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function triggerPopup(type) {
  document.querySelector(`[data-popup="${type}"]`)?.click();
}

// timeOut.js (Option 1: Global Scope)
window.initTimeOut = function() {
  // Display the overlay and popup.
  document.getElementById("overlay").style.display = "block";
  document.getElementById("custom-popup").style.display = "block";
  document.getElementById("popup-title").textContent = "Aeg on otsas!";
  document.getElementById("popup-message").textContent = "Sinu vastamiseks määratud aeg on läbi.";
  
  // Set up popup actions.
  const actionsContainer = document.getElementById("popup-actions");
  actionsContainer.innerHTML = "";
  const btn = document.createElement("button");
  btn.textContent = "Tagasi avalehele";
  btn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
  actionsContainer.appendChild(btn);
};

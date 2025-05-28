const mapContainer = document.getElementById("map");

// Täpi loomine
mapContainer.addEventListener("click", function(event) {
  // Kui klõpsati juba olemasolevale täpile – ei tee midagi siin
  if (event.target.classList.contains("dot")) return;

  const rect = mapContainer.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.style.left = x + "px";
  dot.style.top = y + "px";

  // Lisa kuulatavus täpile: klõps eemaldab selle
  dot.addEventListener("click", function(e) {
    e.stopPropagation(); // Et täpp ei käivitaks kaarti uuesti
    dot.remove();
  });

  mapContainer.appendChild(dot);
});

document.addEventListener('DOMContentLoaded', function() {
  const imageInput = document.getElementById('imageInput');
  const mapContainer = document.getElementById('map');
  let currentImage = null;

  // Pildi valiku sündmus
  imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
          loadImage(file);
      }
  });

  // Laadi pilt
  function loadImage(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          displayImage(e.target.result);
      };
      reader.readAsDataURL(file);
  }

  // Kuva pilt
  function displayImage(imageSrc) {
      mapContainer.innerHTML = '';
      
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = 'Kaart';
      
      mapContainer.appendChild(img);
      currentImage = img;
  }

  // Kaardi kliki sündmus
  mapContainer.addEventListener('click', function(e) {
      if (!currentImage) return;
      
      // Kui klõpsati täpile, kustuta see
      if (e.target.classList.contains('dot')) {
          e.target.remove();
          return;
      }

      // Kui klõpsati pildile, lisa täpp
      if (e.target === currentImage) {
          addDot(e);
      }
  });

  // Lisa täpp
  function addDot(event) {
      const rect = mapContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      
      mapContainer.appendChild(dot);
  }
});
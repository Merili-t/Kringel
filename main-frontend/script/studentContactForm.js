document.addEventListener("DOMContentLoaded", function () {
  // Faili üleslaadimise funktsioonid
  const fileInput = document.getElementById("video-upload");
  const uploadBox = document.getElementById("upload-box");

  // Kui kasutaja klikib üleslaadimise kastile, avaneb failivalija
  uploadBox.addEventListener("click", function () {
    fileInput.click();
  });

  // Pärast faili valimist kuvatakse faili nimi ja vajadusel eelvaade
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const fileName = selectedFile.name;
      alert("Valitud fail: " + fileName);

      // Eemalda varem lisatud eelvaade, kui see eksisteerib
      const oldPreview = document.getElementById("video-preview");
      if (oldPreview) {
        oldPreview.remove();
      }

      // Kui fail on video, loo lihtne video eelvaade
      if (selectedFile.type.startsWith("video")) {
        const videoPreview = document.createElement("video");
        videoPreview.setAttribute("controls", "");
        videoPreview.setAttribute("width", "250");
        videoPreview.src = URL.createObjectURL(selectedFile);
        videoPreview.id = "video-preview";
        // Lisa video eelvaade uploadBox-i alla
        uploadBox.appendChild(videoPreview);
      } else {
        // Kui ei ole video, uuenda lihtsalt tekstisisu
        const previewText = document.createElement("p");
        previewText.textContent = "Valitud fail: " + fileName;
        previewText.id = "video-preview";
        uploadBox.appendChild(previewText);
      }
    }
  });

  // Vormis esitatud andmete saatmise käivitamine
  const startButton = document.querySelector(".button");
  if (startButton) {
    startButton.addEventListener("click", async function (e) {
      e.preventDefault();
      await submitContactForm();
    });
  }
});

// Funktsioon, mis asendab täpitähed sobivate tähtedega (võid vajadusel lisada ka tühikute asendamise)
function cleanFileName(teamName) {
  return teamName
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ä/g, "a")
    .replace(/Ä/g, "A")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/õ/g, "6")
    .replace(/Õ/g, "6")
    .replace(/\s+/g, "_"); // if space used
}

async function submitContactForm() {
  // Andmete lugemine
  const email = document.getElementById("email").value.trim();
  const team = document.getElementById("team").value.trim();
  const names = document.getElementById("names").value.trim();
  const school = document.getElementById("school").value.trim();
  let videoFile = document.getElementById("video-upload").files[0];
  const videoLink = document.querySelector(".video-link-input").value.trim();
  
  if (!email) {
    alert("Palun sisesta email aadress.");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Palun sisesta kehtiv email aadress.");
    return;
  }
  if (!team) {
    alert("Palun sisesta meeskonna nimi.");
    return;
  }
  if (!names) {
    alert("Palun sisesta osalejate nimed.");
    return;
  }
  if (!school) {
    alert("Palun sisesta kool.");
    return;
  }
  if (!videoFile && !videoLink) {
    alert("Palun lae üles video fail või sisesta video link.");
    return;
  }

  let requestBody, headers = {};

  if (videoFile) {
    // Faili ümbernimetamine: tiimi nime ilma täpitähtedeta
    let cleanTeamName = cleanFileName(team);
    let fileExtension = "";
    const dotIndex = videoFile.name.lastIndexOf(".");
    if (dotIndex !== -1) {
      fileExtension = videoFile.name.substring(dotIndex);
    }
    const newFileName = cleanTeamName + fileExtension;

    videoFile = new File([videoFile], newFileName, {
      type: videoFile.type,
      lastModified: videoFile.lastModified,
    });

    const formData = new FormData();
    formData.append("email", email);
    formData.append("teamName", team); 
    formData.append("participantNames", names);
    formData.append("school", school);
    formData.append("videoFile", videoFile);
    if (videoLink) {
      formData.append("videoLink", videoLink);
    }
    requestBody = formData;
    
  } else {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify({
      email: email,
      teamName: team,
      participantNames: names,
      school: school,
      videoLink: videoLink,
    });
  }

  try {
    // API päring; muuda URL vajadusel vastavalt oma keskkonnale
    const response = await fetch("http://localhost:3006/test/contact", {
      method: "POST",
      // Kui requestBody on FormData, ära lisa headers objekti üldse!
      ...(requestBody instanceof FormData ? {} : { headers }),
      credentials: "include",
      body: requestBody,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Kontaktandmed edukalt salvestatud!");
      console.log("Kontaktandmed salvestatud:", result);
      window.location.href = "solvingTest.html";
    } else {
      alert("Andmete salvestamine ebaõnnestus: " + (result.error || "Tundmatu viga"));
    }
  } catch (error) {
    console.error("Kontaktandmete saatmise viga:", error);
    alert("Viga andmete saatmisel. Palun proovi uuesti.");
  }
}


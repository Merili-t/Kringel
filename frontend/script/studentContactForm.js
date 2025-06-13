import createFetch from "./utils/createFetch";

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
  const email = document.getElementById("email").value.trim();
  const team = document.getElementById("team").value.trim();
  const names = document.getElementById("names").value.trim();
  const school = document.getElementById("school").value.trim();
  let videoFile = document.getElementById("video-upload").files[0];
  const videoLink = document.querySelector(".video-link-input").value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Palun sisesta kehtiv email aadress.");
    return;
  }
  if (!team || !names || !school) {
    alert("Palun täida kõik kohustuslikud väljad.");
    return;
  }
  if (!videoFile && !videoLink) {
    alert("Palun lae üles video fail või sisesta video link.");
    return;
  }

  try {
    let result;

    if (videoFile) {
      // Kasutame otse fetch'i, kuna createFetch ei toeta FormData
      let cleanTeamName = cleanFileName(team);
      let extension = videoFile.name.substring(videoFile.name.lastIndexOf("."));
      const newFileName = cleanTeamName + extension;

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
      if (videoLink) formData.append("videoLink", videoLink);

      const response = await fetch(import.meta.env.VITE_API_URL + "/test/contact", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      result = await response.json();
    } else {
      // JSON andmed — kasutame createFetch
      const data = {
        email,
        teamName: team,
        participantNames: names,
        school,
        videoLink,
      };

      result = await createFetch("/test/contact", "POST", data);
    }

    if (result.error) {
      alert("Andmete salvestamine ebaõnnestus: " + result.error);
    } else {
      alert("Kontaktandmed edukalt salvestatud!");
      window.location.href = "solvingTest.html";
    }
  } catch (error) {
    console.error("Viga saatmisel:", error);
    alert("Midagi läks valesti. Palun proovi uuesti.");
  }
}

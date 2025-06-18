import createFetch from "./utils/createFetch";

// Retrieve current test data from session storage.
const currentTest = JSON.parse(sessionStorage.getItem("currentTest") || "01978236-b468-7408-af44-e0ebba1370e2	");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("teamUpload");
  if (!form) {
    return;
  }
  form.addEventListener("submit", handleTeam);
});

const uploadBox = document.getElementById("upload-box");
const videoUpload = document.getElementById("video-upload");
const uploadText = document.querySelector(".upload-text");

// Video upload functionality
uploadBox.addEventListener("click", function () {
  videoUpload.click();
});

uploadBox.addEventListener("dragover", function (e) {
  e.preventDefault();
  uploadBox.style.backgroundColor = "#f0f0f0";
});

uploadBox.addEventListener("dragleave", function (e) {
  e.preventDefault();
  uploadBox.style.backgroundColor = "";
});

uploadBox.addEventListener("drop", function (e) {
  e.preventDefault();
  uploadBox.style.backgroundColor = "";
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const dataTransfer = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      dataTransfer.items.add(files[i]);
    }
    videoUpload.files = dataTransfer.files;
    uploadText.textContent = files[0].name;
  }
});

videoUpload.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    uploadText.textContent = this.files[0].name;
  }
});

async function handleTeam(e) {
  e.preventDefault();

  const form = document.getElementById("teamUpload");
  const formData = new FormData(form);

  // Append a fixed value for userType.
  formData.append("userType", "guest");

  // Register the team.
  const registrationResult = await createFetch("/auth/register", "POST", formData);
  if (registrationResult.error) {
    throw new Error(registrationResult.error);
  }

  // Build attemptData using the testId from currentTest.
  const attemptData = {
    testId: currentTest.testId,
    teamId: registrationResult.id,
    start: new Date(),
  };

  // Create an attempt.
  const attemptResponse = await createFetch("/team/attempt/upload", "POST", attemptData);
  const attemptResult = attemptResponse;
  if (!attemptResponse) {
    throw new Error(attemptResult.error || "Attempt upload failed");
  }

  // NEW: Save the returned attempt id into session storage.
  sessionStorage.setItem("attemptId", attemptResult.id);

  // Redirect to the solving test page.
  window.location.href = "solvingTest.html";
}

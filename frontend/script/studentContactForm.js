import createFetch from "./utils/createFetch";

// Retrieve current test data from session storage.
const currentTest = JSON.parse(sessionStorage.getItem("currentTest") || "{}");
console.log("Retrieved currentTest from sessionStorage:", currentTest);

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.querySelector(".button");
  const uploadBox = document.getElementById("upload-box");
  const videoUpload = document.getElementById("video-upload");
  const uploadText = document.querySelector(".upload-text");

  // Video upload functionality
  uploadBox.addEventListener("click", function () {
    console.log("Upload box clicked. Triggering file input...");
    videoUpload.click();
  });

  uploadBox.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadBox.style.backgroundColor = "#f0f0f0";
    console.log("Drag over detected.");
  });

  uploadBox.addEventListener("dragleave", function (e) {
    e.preventDefault();
    uploadBox.style.backgroundColor = "";
    console.log("Drag leave detected.");
  });

  uploadBox.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadBox.style.backgroundColor = "";
    console.log("Drop event detected.");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
      }
      videoUpload.files = dataTransfer.files;
      uploadText.textContent = files[0].name;
      console.log("File dropped:", files[0].name);
    }
  });

  videoUpload.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      uploadText.textContent = this.files[0].name;
      console.log("File selected:", this.files[0].name);
    }
  });

  // Start button functionality – first registers the team, then creates the attempt.
  startButton.addEventListener("click", async function (e) {
    e.preventDefault();

    // Gather form data.
    const email = document.getElementById("email").value.trim();
    const teamName = document.getElementById("team").value.trim(); // actual team name
    const participantNames = document.getElementById("names").value.trim(); // names of team members
    const school = document.getElementById("school").value.trim() || "";
    const videoLink = document.querySelector(".video-link-input").value.trim() || "";
    console.log("Team data gathered:", { email, teamName, participantNames, school, videoLink });

    // Validate required fields.
    if (!email || !teamName || !participantNames) {
      alert("Palun täida email, meeskonna nimi ja meeskonna liikmete nimed!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Palun sisesta korrektne email aadress!");
      return;
    }

    try {
      startButton.textContent = "Salvestame...";
      startButton.disabled = true;

      // --- STEP 1: Register the Team ---
      // Prepare payload. Note: name is for team members (one long string),
      // while team_name is the actual team name.
      const registrationPayload = {
        email: email,
        teamName: teamName,     // actual team name
        names: participantNames,  // team members' names
        school: school,
        link: videoLink,
        userType: "guest"
      };
      console.log("Registering team with payload:", registrationPayload);
      
      // Use a relative endpoint so that createFetch picks up the base URL if configured.
      const registrationResult = await createFetch("/auth/register", "POST", registrationPayload);
      if (registrationResult.error) {
        throw new Error(registrationResult.error);
      }
      console.log("Team successfully registered:", registrationResult);
      
      // Extract team ID from the response.
      const teamId = registrationResult.id || registrationResult.teamId;
      console.log("Obtained teamId:", teamId);

      // Update session storage with the new teamId.
      currentTest.teamId = teamId;
      sessionStorage.setItem("currentTest", JSON.stringify(currentTest));

      // --- STEP 2: Create the Attempt ---
      // Using native fetch with FormData to handle multipart data.
      const formData = new FormData();
      // Retrieve testId from session storage.
      const testId = currentTest.testId || "defaultTestId";
      console.log("Appending required fields to FormData:", { testId, teamId });
      formData.append("testId", testId);
      formData.append("teamId", teamId);
      formData.append("start", "true");

      // Append team data.
      // Note: Here we add the email and the team_name (actual team name).
      formData.append("email", email);
      formData.append("team_name", teamName);
      console.log("Appended email and team_name to FormData.");

      // Append video file if available.
      if (videoUpload.files && videoUpload.files.length > 0) {
        formData.append("video", videoUpload.files[0]);
        console.log("Appended video file:", videoUpload.files[0].name);
      }

      // Optionally append additional fields.
      if (participantNames) {
        formData.append("participantNames", participantNames);
        console.log("Appended participantNames:", participantNames);
      }
      if (school) {
        formData.append("school", school);
        console.log("Appended school:", school);
      }
      if (videoLink) {
        formData.append("videoLink", videoLink);
        console.log("Appended videoLink:", videoLink);
      }

      const attemptData = {
        testId: currentTest.testId,
        teamId: registrationResult.id,
        start: new Date(),
      }

      console.log("Sending FormData to /team/attempt/upload...");
      const attemptResponse = await createFetch("/team/attempt/upload", 'POST', attemptData);

      const attemptResult = attemptResponse;
      if (!attemptResponse) {
        throw new Error(attemptResult.error || "Attempt upload failed");
      }
      console.log("Team and attempt created successfully:", attemptResult);

      // Optionally store additional team data in localStorage.
      if (participantNames || school || videoLink) {
        localStorage.setItem(
          "additionalTeamData",
          JSON.stringify({
            participantNames,
            school,
            videoLink,
            teamId: attemptResult.id  // assuming the backend sends the team/attempt id here
          })
        );
        console.log("Saved additional team data to localStorage.");
      }

      // Redirect to the next page.
      window.location.href = "solvingTest.html";
    } catch (error) {
      alert("Viga andmete salvestamisel: " + error.message);
      console.error("Error:", error);
      startButton.textContent = "Alusta lahendamist";
      startButton.disabled = false;
    }
  });
});

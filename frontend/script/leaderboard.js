import createFetch from "./utils/createFetch";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[DOMContentLoaded] Leaderboard page loaded.");
  const urlParams = new URLSearchParams(window.location.search);
  let attemptId = urlParams.get("id");

  if (!attemptId) {
    console.warn(
      "[DOMContentLoaded] URL Attempt ID is missing. Using default attempt id for debugging."
    );
    // Use a default attempt id for debugging purposes
    attemptId = "defaultAttempt";
  }
  console.log("[DOMContentLoaded] URL Attempt ID:", attemptId);
  loadLeaderboard(attemptId);
});

async function loadLeaderboard(attemptId) {
  try {
    console.log("[loadLeaderboard] Starting with attemptId:", attemptId);

    // Fetch all attempts from the backend using the /team/attempts route.
    console.log("[loadLeaderboard] Fetching all team attempts from /team/attempts");
    const attemptsResponse = await createFetch(`/team/attempts`, "GET", "");
    console.log("[loadLeaderboard] All attempts fetch result:", attemptsResponse);

    // Adjusting since the backend returns an object with an "attempts" property.
    let attemptsArray = [];
    if (attemptsResponse.error) {
      console.error(
        "[loadLeaderboard] Failed loading attempts (error property):",
        attemptsResponse.error
      );
      alert("Testi katsete laadimine ebaõnnestus.");
      return;
    } else if (Array.isArray(attemptsResponse)) {
      // if the response is an array.
      attemptsArray = attemptsResponse;
    } else if (attemptsResponse.attempts && Array.isArray(attemptsResponse.attempts)) {
      attemptsArray = attemptsResponse.attempts;
    } else {
      console.error("[loadLeaderboard] Unexpected attempts response format:", attemptsResponse);
      alert("Testi katsete laadimine ebaõnnestus.");
      return;
    }

    // Define the manual test id to use.
    const manualTestId = "01976907-0aad-775e-acc5-a2b5f1f60426";
    console.log("[loadLeaderboard] Manual Test ID:", manualTestId);

    // Filter the fetched attempts to only include those for the manual test id.
    console.log("[loadLeaderboard] Filtering attempts for testId", manualTestId);
    const filteredAttempts = attemptsArray.filter(
      (attempt) => attempt.testId === manualTestId
    );
    console.log("[loadLeaderboard] Filtered Attempts:", filteredAttempts);
    if (filteredAttempts.length === 0) {
      console.warn("[loadLeaderboard] No attempts found for testId", manualTestId);
      alert("Selle testiga ühtegi katset ei leitud.");
      return;
    }

    // Optional: Try to locate the attempt matching the given attemptId in the filtered list.
    const selectedAttempt = filteredAttempts.find(
      (attempt) => attempt.id === attemptId
    );
    if (!selectedAttempt) {
      console.warn(
        `[loadLeaderboard] Attempt with id '${attemptId}' not found among the filtered attempts.`
      );
    }

    // Fetch test details using the manual test id.
    console.log("[loadLeaderboard] Fetching test details from /test/" + manualTestId);
    const testResult = await createFetch(`/test/${manualTestId}`, "GET", "");
    console.log("[loadLeaderboard] Test fetch result:", testResult);
    if (testResult.error || !testResult.id) {
      console.error("[loadLeaderboard] Failed loading test details:", testResult.error);
      alert("Testi andmete laadimine ebaõnnestus.");
      return;
    }
    renderTestInfo(testResult);

    // Update participant count and render the leaderboard.
    updateParticipantCount(filteredAttempts.length);
    renderLeaderboard(filteredAttempts);
    setupPdfDownload(manualTestId);
  } catch (error) {
    console.error("[loadLeaderboard] Exception caught:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
  }
}

function renderTestInfo(test) {
  console.log("[renderTestInfo] Test data:", test);
  const testNameEl = document.getElementById("test-name");
  const testDescEl = document.getElementById("test-description");
  const questionCountEl = document.getElementById("question-count");
  const testDateEl = document.getElementById("test-date");
  const participantCountEl = document.getElementById("participant-count");

  if (testNameEl) testNameEl.textContent = test.name || "Testi nimi";
  if (testDescEl) testDescEl.textContent = test.description || "Kirjeldus puudub";

  if (questionCountEl) {
    if (Array.isArray(test.questions)) {
      questionCountEl.textContent = `${test.questions.length} küsimust`;
    } else {
      questionCountEl.textContent = `${test.questionsCount || 0} küsimust`;
    }
  }

  if (testDateEl && test.createdAt) {
    const createdAt = new Date(test.createdAt);
    testDateEl.textContent = createdAt.toLocaleDateString("et-EE");
  }

  // We clear participant count; it will be updated later.
  if (participantCountEl) participantCountEl.textContent = "";
}

function updateParticipantCount(count) {
  console.log("[updateParticipantCount] Updating with count:", count);
  const participantCountEl = document.getElementById("participant-count");
  if (participantCountEl) {
    participantCountEl.textContent = `Osalejaid: ${count} tiimi`;
  }
}

function renderLeaderboard(attempts) {
  console.log("[renderLeaderboard] Rendering leaderboard with attempts:", attempts);
  const tbody = document.getElementById("leaderboard-tbody");
  if (!tbody) {
    console.error("[renderLeaderboard] leaderboard-tbody element not found.");
    return;
  }
  tbody.innerHTML = "";

  // Sort attempts by points descending.
  attempts.sort((a, b) => (b.points || 0) - (a.points || 0));

  attempts.forEach((attempt, index) => {
    const row = document.createElement("tr");

    // Rank cell
    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;

    // Team Name cell – check for various potential fields.
    const nameCell = document.createElement("td");
    const teamName =
      attempt.teamName ||
      (attempt.team && attempt.team.name) ||
      attempt.email ||
      "Tiimi nimi puudub";
    nameCell.textContent = teamName;

    // Answered Questions cell
    const answeredCell = document.createElement("td");
    answeredCell.textContent = `${attempt.answeredQuestions || 0}`;

    // Points cell
    const pointsCell = document.createElement("td");
    pointsCell.textContent = `${attempt.points || 0}`;

    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(answeredCell);
    row.appendChild(pointsCell);
    tbody.appendChild(row);
  });
}

function setupPdfDownload(testId) {
  console.log("[setupPdfDownload] Setting up PDF link for testId:", testId);
  const pdfLink = document.getElementById("pdf-download-link");
  if (pdfLink) {
    pdfLink.href = `/pdf/leaderboard/${testId}`;
    pdfLink.setAttribute("download", "");
  }
}
import createFetch from "./utils/createFetch";

// Set current test data into session storage.
sessionStorage.setItem(
  "currentTest",
  JSON.stringify({
    testId: "01978760-961e-709f-8245-7717015e12f7",
    // You can add other properties here if needed, e.g., teamId if already known.
  })
);
console.log("Session storage set for currentTest:", sessionStorage.getItem("currentTest"));

let testId = null;
const elements = {
  loading: document.getElementById("loading"),
  errorMessage: document.getElementById("error-message"),
  mainContent: document.getElementById("main-content"),
  testTitle: document.getElementById("test-title"),
  testDuration: document.getElementById("test-duration"),
  questionCount: document.getElementById("question-count"),
  testDescription: document.getElementById("test-description"),
  testDescriptionSection: document.getElementById("test-description-section"),
  testStartDate: document.getElementById("test-start-date"),
  testEndDate: document.getElementById("test-end-date"),
  testStatus: document.getElementById("test-status"),
  statusIndicator: document.getElementById("status-indicator"),
  continueButton: document.getElementById("continue-button"),
};

document.addEventListener("DOMContentLoaded", function () {
  testId = getTestIdFromUrl();
  // If no testId is provided in the URL, use the fallback test ID.
  if (!testId) {
    testId = "01978760-961e-709f-8245-7717015e12f7";
    console.log("No testId from URL; using fallback:", testId);
  } else {
    console.log("Retrieved testId from URL:", testId);
  }
  loadTestData(testId);
});

function getTestIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("testId");
}

async function loadTestData(testId) {
  try {
    console.log("Loading test data for testId:", testId);
    showLoading();
    const testData = await fetchTestData(testId);
    const questionCount = testData.questions || 0;
    console.log("Fetched test data:", testData);
    populateTestData(testData, questionCount);
    showMainContent();
  } catch (error) {
    console.error("Error loading test data:", error);
    showError("An error occurred while loading test data");
  }
}

async function fetchTestData(testId) {
  const result = await createFetch(`/test/${testId}`, "GET");
  if (!result) {
    throw new Error("Unable to fetch test data");
  }
  return result;
}

function populateTestData(testData, questionCount) {
  elements.testTitle.textContent = testData.name || "Nimetu test";
  const duration = testData.timeLimit || 0;
  elements.testDuration.textContent = formatDuration(duration);
  elements.questionCount.textContent = questionCount || "Teadmata";
  if (testData.description && testData.description.trim()) {
    elements.testDescription.textContent = testData.description;
    elements.testDescriptionSection.style.display = "block";
  } else {
    elements.testDescriptionSection.style.display = "none";
  }
  const startDate = parseLocalDateTime(testData.start);
  const endDate = parseLocalDateTime(testData.end);
  elements.testStartDate.textContent = formatDateRaw(testData.start);
  elements.testEndDate.textContent = formatDateRaw(testData.end);
  updateTestStatus(startDate, endDate);
  updateContinueButton(startDate, endDate);
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} minutit`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0
      ? `${hours} tund${hours !== 1 ? "i" : ""}`
      : `${hours} tund${hours !== 1 ? "i" : ""} ja ${remainingMinutes} minutit`;
  }
}

function formatDateRaw(isoString) {
  const dateObj = new Date(isoString);
  const dateParts = isoString.split("T");
  const [year, month, day] = dateParts[0].split("-");
  const time = dateParts[1].slice(0, 5); // hh:mm

  const kuud = [
    "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni",
    "juuli", "august", "september", "oktoober", "november", "detsember"
  ];

  const kuuNimi = kuud[parseInt(month, 10) - 1];

  return `${parseInt(day, 10)}. ${kuuNimi} ${year}, kell ${time}`;
}

function updateTestStatus(startIso, endIso) {
  const now = new Date();
  const startDate = parseLocalDateTime(startIso);
  const endDate = parseLocalDateTime(endIso);

  let statusText = "";
  let statusClass = "";

  if (now < startDate) {
    statusText = "Test pole veel alanud";
    statusClass = "status-upcoming";
  } else if (now > endDate) {
    statusText = "Test on lõppenud";
    statusClass = "status-expired";
  } else {
    statusText = "Test on hetkel aktiivne";
    statusClass = "status-active";
  }

  elements.statusIndicator.textContent = statusText;
  elements.testStatus.className = `test-status ${statusClass}`;
}

function updateContinueButton(startDate, endDate) {
  const now = new Date();
  if (now < startDate || now > endDate) {
    elements.continueButton.style.opacity = "0.5";
    elements.continueButton.style.pointerEvents = "none";
    elements.continueButton.textContent = "Test ei ole saadaval";
  } else {
    elements.continueButton.style.opacity = "1";
    elements.continueButton.style.pointerEvents = "auto";
    elements.continueButton.textContent = "Edasi";
    const currentHref = elements.continueButton.getAttribute("href");
    if (currentHref && !currentHref.includes("testId=")) {
      const separator = currentHref.includes("?") ? "&" : "?";
      elements.continueButton.setAttribute("href", `${currentHref}${separator}testId=${testId}`);
    }
  }
}

function showLoading() {
  elements.loading.style.display = "block";
  elements.errorMessage.style.display = "none";
  elements.mainContent.style.display = "none";
}

function showError(message) {
  elements.loading.style.display = "none";
  elements.errorMessage.style.display = "block";
  elements.mainContent.style.display = "none";
  const errorP = elements.errorMessage.querySelector("p");
  if (errorP) {
    errorP.textContent = message;
  }
}

function showMainContent() {
  elements.loading.style.display = "none";
  elements.errorMessage.style.display = "none";
  elements.mainContent.style.display = "block";
}

function parseLocalDateTime(dateTimeStr) {
  if (dateTimeStr instanceof Date) {
    return dateTimeStr;
  }

  if (typeof dateTimeStr !== "string") {
    throw new Error("Invalid date string: " + dateTimeStr);
  }

  let datePart, timePart;

  if (dateTimeStr.includes("T")) {
    [datePart, timePart] = dateTimeStr.split("T");
  } else if (dateTimeStr.includes(" ")) {
    [datePart, timePart] = dateTimeStr.split(" ");
  } else {
    throw new Error("Unknown date format: " + dateTimeStr);
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute);
}

window.TestGuide = {
  loadTestData,
  formatDateRaw,
  formatDuration,
};

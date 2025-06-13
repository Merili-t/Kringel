import createFetch from "./utils/createFetch";

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
  if (testId) {
    loadTestData(testId);
  } else {
    showError("Testi ID puudub URL-ist");
  }
});

function getTestIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("testId");
}

async function loadTestData(testId) {
  try {
    showLoading();
    const testData = await fetchTestData(testId);
    const questionCountData = await fetchQuestionCount(testId);
    const questionCount = questionCountData.count || 0;
    populateTestData(testData, questionCount);
    showMainContent();
  } catch (error) {
    console.error("Viga testi andmete laadimisel:", error);
    showError("Testi andmete laadimisel tekkis viga");
  }
}

async function fetchTestData(testId) {
  const result = await createFetch(`/tests/${testId}`, "GET", "");
  if (!result) {
    throw new Error("Testi andmed puuduvad");
  }
  return result;
}

async function fetchQuestionCount(testId) {
  try {
    const result = await createFetch(`/tests/${testId}/questions/count`, "GET", "");
    return result;
  } catch (error) {
    console.warn("Viga küsimuste arvu laadimisel:", error);
    return { count: 0 };
  }
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
  const startDate = new Date(testData.start);
  const endDate = new Date(testData.end);
  elements.testStartDate.textContent = formatDate(startDate);
  elements.testEndDate.textContent = formatDate(endDate);
  updateTestStatus(startDate, endDate);
  updateContinueButton(startDate, endDate);
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} minutit`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} tund${hours !== 1 ? "i" : ""}`;
    } else {
      return `${hours} tund${hours !== 1 ? "i" : ""} ja ${remainingMinutes} minutit`;
    }
  }
}

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("et-EE", options);
}

function updateTestStatus(startDate, endDate) {
  const now = new Date();
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

function getAuthToken() {
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
}

window.TestGuide = {
  loadTestData,
  formatDate,
  formatDuration,
};

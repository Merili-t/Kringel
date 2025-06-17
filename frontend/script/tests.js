import { createFetch } from "./utils/createFetch.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeTests();
});

let tests = [];

async function loadTests() {
  try {
    const testsData = await createFetch('/test/tests', 'GET');
    tests = testsData;
    renderTests();
  } catch (error) {
    console.error("❌ Testide laadimine ebaõnnestus:", error);
    const container = document.getElementById("tests-container");
    if (container) {
      container.innerHTML = `<p style="color:red;">Testide laadimine ebaõnnestus. Palun proovi hiljem uuesti.</p>`;
    }
  }
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString("et-EE");
}

function renderTests() {
  const container = document.getElementById("tests-container");
  if (!container) return;

  container.innerHTML = "";

  tests.forEach(test => {
    const testDiv = document.createElement("div");
    testDiv.innerHTML = `
      <div class="infoContainer">
        <h2>${test.name}</h2>
        <div class="description">${test.description}</div>
        <div class="details">
          <div class="detail-item">
            <span class="icon questions-icon"></span>
            <span>${test.questions ?? "?"} küsimust</span>
          </div>
          <div class="detail-item">
            <span class="icon date-icon"></span>
            <span>${formatDate(test.start)}</span>
          </div>
          <div class="detail-item">
            <span class="icon participants-icon"></span>
            <span>Osalejaid: ${test.participants ?? 0} tiimi</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(testDiv);
  });
}

function initializeTests() {
  loadTests();
}

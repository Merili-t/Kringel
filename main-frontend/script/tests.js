document.addEventListener("DOMContentLoaded", () => {
  initializeTests();
});

// Tests management functionality
let tests = [];

// Load tests from API
async function loadTests() {
  try {
    const response = await fetch("http://localhost:3006/tests");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.status);
    }
    const testsData = await response.json();
    tests = testsData;
    renderTests();
  } catch (error) {
    console.error("Error loading tests:", error);
    // Fallback with mock data
    tests = [
      {
        id: 1,
        name: "Testi nimi",
        description: "Kirjeldus...",
        created: new Date(),
        timelimit: 60,
        start: new Date(),
        end: new Date(),
        questions: 5,
        participants: 6
      }
    ];
    renderTests();
  }
}

// Helper function to format date (using Estonian locale)
function formatDate(date) {
  // Ensure we have a Date instance
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString("et-EE");
}

// Render tests
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
            <span>${test.questions} küsimust</span>
          </div>
          <div class="detail-item">
            <span class="icon date-icon"></span>
            <span>${formatDate(test.start)}</span>
          </div>
          <div class="detail-item">
            <span class="icon participants-icon"></span>
            <span>Osalejaid: ${test.participants} tiimi</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(testDiv);
  });
}

// Team management functions
function toggleAllCheckboxes(masterCheckbox) {
  const checkboxes = document.querySelectorAll(".team-checkbox");
  checkboxes.forEach(checkbox => {
    checkbox.checked = masterCheckbox.checked;
  });
}

function deleteTeam(button) {
  if (confirm("Kas olete kindel, et soovite selle tiimi kustutada?")) {
    const row = button.closest("tr");
    if (row) {
      row.remove();
    }
  }
}

// Initialize tests
function initializeTests() {
  loadTests();
}

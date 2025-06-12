document.addEventListener("DOMContentLoaded", () => {
  initializeTests();
});

// Tests management functionality
let tests = [];

// Load tests using stub data (no real fetch)
async function loadTests() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Stub: Replace with dummy test data
    tests = [
      {
        id: 1,
        name: "Testi nimi",
        description: "Kirjeldus... Lorem ipsum dolor sit amet.",
        created: new Date(),
        timelimit: 60,
        start: new Date(),
        end: new Date(Date.now() + 3600000), // 1 hour later
        questions: 5,
        participants: 6
      },
      {
        id: 2,
        name: "Teine test",
        description: "Teise testi kirjeldus.",
        created: new Date(),
        timelimit: 90,
        start: new Date(),
        end: new Date(Date.now() + 5400000), // 1.5 hours later
        questions: 8,
        participants: 4
      }
      // Add more dummy tests as needed...
    ];
    renderTests();
  } catch (error) {
    console.error("Error loading tests:", error);
    // Fallback: if any unexpected error occurs, you can still assign some mock data.
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

// Tests management functionality
let tests = [];

// Load tests from API
async function loadTests() {
    try {
        const response = await fetch("http://localhost:8080/tests");
        const testsData = await response.json();
        tests = testsData;
        renderTests();
    } catch (error) {
        console.error('Error loading tests:', error);
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

// Render tests
function renderTests() {
    const container = document.getElementById('tests-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    tests.forEach(test => {
        const testDiv = document.createElement('div');
        testDiv.innerHTML = `
            <div class="infoContainer">
                <h2>${test.name}</h2>
                <div class="description">${test.description}</div>
                <div class="details">
                    <div class="detail-item">
                        <span class="icon questions-icon"></span>
                        <span>${test.questions || 5} küsimust</span>
                    </div>
                    <div class="detail-item">
                        <span class="icon date-icon"></span>
                        <span>12/04/2025</span>
                    </div>
                    <div class="detail-item">
                        <span class="icon participants-icon"></span>
                        <span>Osalejaid: ${test.participants || 6} tiimi</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(testDiv);
    });
}

// Team management functions
function toggleAllCheckboxes(masterCheckbox) {
    const checkboxes = document.querySelectorAll('.team-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = masterCheckbox.checked;
    });
}

function deleteTeam(button) {
    if (confirm('Kas olete kindel, et soovite selle tiimi kustutada?')) {
        const row = button.closest('tr');
        row.remove();
    }
}

// Initialize tests
function initializeTests() {
    loadTests();
}
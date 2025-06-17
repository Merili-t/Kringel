import createFetch from "./utils/createFetch";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("et-EE");
}

function toggleAllCheckboxes(source) {
  document.querySelectorAll(".team-checkbox").forEach(cb => cb.checked = source.checked);
}

function navigateToTeamAnswers(teamId) {
  window.location.href = `oneAnswer.html?teamId=${teamId}`;
}

// Optional delete button handler (dummy for now)
function deleteTeam(button) {
  const confirmed = confirm("Kas soovite selle tiimi eemaldada?");
  if (!confirmed) return;

  const row = button.closest("tr");
  if (row) row.remove();
}

async function renderTests() {
  const container = document.getElementById("tests-container");
  if (!container) return;

  container.innerHTML = "";

  const { tests } = await createFetch('/test/tests', 'GET');
  const { teams } = await createFetch('/team/teams', 'GET');
  const { attempts } = await createFetch('/team/attempts', 'GET');
  const { answers } = await createFetch('/team/answers', 'GET');

  const answerCountsByAttempt = {};
  answers.forEach(answer => {
    if (!answerCountsByAttempt[answer.attemptId]) {
      answerCountsByAttempt[answer.attemptId] = 0;
    }
    if (answer.answer !== null) {
      answerCountsByAttempt[answer.attemptId]++;
    }
  });

  for (const test of tests) {
    const testAttempts = attempts.filter(a => a.testId === test.id);
    const testTeams = testAttempts.map(attempt => {
      const team = teams.find(t => t.id === attempt.teamId);
      return {
        ...team,
        attemptId: attempt.id,
        answered_questions: answerCountsByAttempt[attempt.id] || 0
      };
    });

    // Test info eraldi
    const testInfo = document.createElement("div");
    testInfo.className = "infoContainer";
    testInfo.innerHTML = `
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
          <span>Osalejaid: ${testTeams.length} tiimi</span>
        </div>
      </div>
    `;

    // Tiimide tabel eraldi
    const teamTable = document.createElement("div");
    teamTable.className = "team-table-container";
    teamTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onchange="toggleAllCheckboxes(this)"></th>
            <th>Tiim</th>
            <th>Vastatud küsimused</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${testTeams.map(team => `
            <tr>
              <td><input type="checkbox" class="team-checkbox"></td>
              <td style="cursor: pointer;" onclick="navigateToTeamAnswers('${team.id}')">${team.name}</td>
              <td>${team.answered_questions}/${test.questions ?? "?"}</td>
              <td>
                <button style="all: unset; cursor: pointer;" class="delete-btn" onclick="deleteTeam(this)">
                  <img src="../images/del.png" alt="Delete" class="del-icon">
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    container.appendChild(testInfo);
    container.appendChild(teamTable);
  }
}

// Käivita renderdamine kohe
document.addEventListener("DOMContentLoaded", () => {
  renderTests();
});

// Optionally expose globally
window.toggleAllCheckboxes = toggleAllCheckboxes;
window.navigateToTeamAnswers = navigateToTeamAnswers;
window.deleteTeam = deleteTeam;
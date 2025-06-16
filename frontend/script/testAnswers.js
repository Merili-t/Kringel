import createFetch from "./utils/createFetch";

//document.getElementById("page-title").innerText = "Test: " + testName;

async function loadTeamsForTest(testId) {
  // Updated route: there's no direct route for teams by test ID
  // You'll need to get all teams and filter, or add a new route
  // For now, using the teams endpoint and filtering client-side
  const allTeams = await createFetch('/team/teams', 'GET');
  return allTeams.filter(team => team.test_id === testId);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("et-EE");
}

function toggleAllCheckboxes(source) {
  document.querySelectorAll('.team-checkbox').forEach(cb => cb.checked = source.checked);
}

async function renderTests() {
  const container = document.getElementById("tests-container");
  if (!container) return;

  container.innerHTML = "";

  const tests = await createFetch('/test/tests', 'GET');

  for (const test of tests) {
    const testDiv = document.createElement("div");
    const teams = await loadTeamsForTest(test.id);

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
            <span>Osalejaid: ${teams.length} tiimi</span>
          </div>
        </div>

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
            ${teams.map(team => `
              <tr>
                <td><input type="checkbox" class="team-checkbox"></td>
                <td style="cursor: pointer;" onclick="navigate('teamanswer', ${team.id})">${team.name}</td>
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
      </div>
    `;

    container.appendChild(testDiv);
  }
}

renderTests();

function navigate(pageId, teamId = null) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";

  if (pageId === "teamanswer" && teamId) {
    loadTeamAnswer(teamId);
  }
}

async function loadTeamAnswer(teamId) {
  // Fixed route: was '/team/${teamId}/answers', now using available endpoints
  // You'll need to get team data, attempts, and answers separately
  const team = await createFetch(`/team/team/${teamId}`, 'GET');
  const answers = await createFetch('/team/answers', 'GET');
  
  // Filter answers for this specific team
  const teamAnswers = answers.filter(answer => answer.team_id === teamId);

  const page = document.getElementById("teamanswer");
  if (!page) return;

  const tableBody = page.querySelector("tbody");
  const nameHeader = page.querySelector("h2");
  const desc = page.querySelector(".description");
  const videoLinkContainer = page.querySelector(".details .detail-item");

  nameHeader.textContent = team.name;
  // You'll need to adjust this based on your actual team data structure
  desc.textContent = `Tiimi liikmed: ${team.members ? team.members.join(", ") : "N/A"}`;
  videoLinkContainer.innerHTML = `<a href="${team.video_url || '#'}" target="_blank">${team.video_url || 'Video puudub'}</a>`;

  let totalPoints = 0;
  tableBody.innerHTML = "";

  teamAnswers.forEach(row => {
    const question = row.question_text;
    const answer = row.answer || "<em>(puudub)</em>";
    const isManual = row.type === 3; // nt kui 3 = manuaalne
    const points = row.points === null && isManual ? "hindamata" : `${row.points}p`;

    if (typeof row.points === "number") {
      totalPoints += row.points;
    }

    tableBody.innerHTML += `
      <tr>
        <td>${question}</td>
        <td style="cursor: pointer; color: #B81434;"
        onclick="window.location.href='oneAnswer.html?teamId=${teamId}&questionId=${row.question_id}'">
        ${answer}</td>
        <td>${points}</td>
      </tr>
    `;
  });

  tableBody.innerHTML += `
    <tr>
      <td colspan="2"><strong>Punktid kokku</strong></td>
      <td><strong>${totalPoints}p</strong></td>
    </tr>
  `;
}
import createFetch from "./utils/createFetch.js";



function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
    teamId: params.get("teamId"),
    questionId: params.get("questionId")
    };
}

async function loadSingleAnswer(teamId, questionId) {
  const data = await createFetch(`/team/${teamId}/answers`, 'GET');
  const answer = data.find(item => item.question_id == questionId);

  const container = document.querySelector(".answer-container");

  if (!answer) {
    container.innerHTML = "<p>Vastus ei leitud.</p>";
    return;
  }

  document.querySelector("#teamName h1").textContent = answer.team_name || "Tiimi nimi";
  document.querySelector(".question").textContent = `1. ${answer.question_text || "KÜSIMUS"}`;

  const answerText = document.getElementById("answer-text");
  const answerImg = document.getElementById("answer-image");

  if (answer.answer && answer.answer.startsWith("data:image")) {
    answerImg.src = answer.answer;
    answerImg.style.display = "block";
    answerText.textContent = "";
  } else {
    answerImg.style.display = "none";
    answerText.textContent = answer.answer || "(puudub)";
  }

  const metaText = `Punktid: ${answer.points ?? (answer.type === 3 ? "hindamata" : "–")}`;
  document.querySelector(".meta").innerHTML = metaText;
}

const { teamId, questionId } = getParams();
if (teamId && questionId) {
  loadSingleAnswer(teamId, questionId);
} else {
  document.querySelector(".answer-container").innerHTML = "<p>URL-is puudub tiimi või küsimuse ID.</p>";
}
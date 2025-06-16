import createFetch from "./utils/createFetch.js";

function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        teamId: params.get("teamId"),
        questionId: params.get("questionId")
    };
}

async function loadSingleAnswer(teamId, questionId) {
    try {
        // Option 1: If you have a specific answer endpoint
        // const answer = await createFetch(`/team/answer/${answerId}`, 'GET');
        
        // Option 2: Get all answers and filter (current approach with correct route)
        const allAnswers = await createFetch('/team/answers', 'GET');
        const answer = allAnswers.find(item => 
            item.team_id == teamId && item.question_id == questionId
        );

        const container = document.querySelector(".answer-container");

        if (!answer) {
            container.innerHTML = "<p>Vastus ei leitud.</p>";
            return;
        }

        // Get team info separately if team name is not in answers
        let teamName = answer.team_name;  
        if (!teamName) {
            try {
                const team = await createFetch(`/team/${teamId}`, 'GET');
                teamName = team.name;
            } catch (error) {
                teamName = "Tiimi nimi";
            }
        }

        document.querySelector("#teamName h1").textContent = teamName;
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

    } catch (error) {
        console.error("Error loading answer:", error);
        document.querySelector(".answer-container").innerHTML = "<p>Viga vastuse laadimisel.</p>";
    }
}

const { teamId, questionId } = getParams();
if (teamId && questionId) {
    loadSingleAnswer(teamId, questionId);
} else {
    document.querySelector(".answer-container").innerHTML = "<p>URL-is puudub tiimi või küsimuse ID.</p>";
}
import createFetch from "./utils/createFetch.js";

document.addEventListener("DOMContentLoaded", () => {
    function getParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            teamId: params.get("teamId")?.trim(),
            questionId: params.get("questionId")?.trim()
        };
    }

    async function loadSingleAnswer(teamId, questionId) {
        try {
            const allAnswers = await createFetch('/team/answers', 'GET');

            const answer = allAnswers.find(item =>
                String(item.team_id) === teamId && String(item.question_id) === questionId
            );

            const container = document.querySelector(".answer-container");

            if (!answer) {
                container.innerHTML = "<p>Vastus ei leitud.</p>";
                return;
            }

            // ✅ Lisa tiimi nimi (kui puudub)
            let teamName = answer.team_name;
            if (!teamName) {
                try {
                    const teamData = await createFetch(`/team/team/${teamId}`, 'GET');
                    teamName = teamData.name || "Tiimi nimi";
                } catch {
                    teamName = "Tiimi nimi";
                }
            }

            // ✅ Küsimus
            let questionText = answer.question_text;
            if (!questionText) {
                try {
                    const questionData = await createFetch(`/question/${questionId}`, 'GET');
                    questionText = questionData.description || "Küsimus";
                } catch {
                    questionText = "Küsimus";
                }
            }

            document.querySelector("#teamName h1").textContent = teamName;
            document.querySelector(".question").textContent = `1. ${questionText}`;

            const answerText = document.getElementById("answer-text");
            const answerImg = document.getElementById("answer-image");

            if (answer.answer?.startsWith("data:image")) {
                answerImg.src = answer.answer;
                answerImg.style.display = "block";
                answerText.textContent = "";
            } else {
                answerImg.style.display = "none";
                answerText.textContent = answer.answer || "(puudub)";
            }

            const metaText = `Punktid: ${answer.points ?? (answer.type === 3 ? "hindamata" : "–")}`;
            document.querySelector(".meta").textContent = metaText;

        } catch (err) {
            console.error("❌ Viga vastuse laadimisel:", err);
            document.querySelector(".answer-container").innerHTML = "<p>Viga vastuse laadimisel.</p>";
        }
    }

    const { teamId, questionId } = getParams();
    if (teamId && questionId) {
        loadSingleAnswer(teamId, questionId);
    } else {
        document.querySelector(".answer-container").innerHTML = "<p>URL-is puudub tiimi või küsimuse ID.</p>";
    }
});

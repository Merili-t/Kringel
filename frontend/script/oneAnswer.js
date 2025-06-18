import createFetch from "./utils/createFetch.js";

document.addEventListener("DOMContentLoaded", () => {
    function getParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            teamId: params.get("teamId")?.trim(),
            questionId: params.get("questionId")?.trim(),
            attemptId: params.get("attemptId")?.trim()
        };
    }

    async function loadAllTeamAnswers(teamId, attemptIdFromURL) {
        try {
            const { answers } = await createFetch('/team/answers', 'GET');
            const { tests } = await createFetch('/test/tests', 'GET');
            const { attempts } = await createFetch('/team/attempts', 'GET');

            // Find the team's attempt
            let attempt = attempts.find(a => a.teamId === teamId);
            if (!attempt) throw new Error("Attempt not found");

            const attemptId = attemptIdFromURL || attempt.id;

            const test = tests.find(t => t.id === attempt.testId);
            if (!test) throw new Error("Test not found");

            // Get all answers for this team's attempt
            const teamAnswers = answers.filter(answer => answer.attemptId === attemptId);
            console.log("Loaded answers:", answers);
            console.log("Using attemptId:", attemptId);
            console.log("Team answers:", teamAnswers);

            if (teamAnswers.length === 0) {
                document.querySelector(".answer-container").innerHTML = "<p>Sellel tiimil ei ole vastuseid.</p>";
                return;
            }

            // Sort answers by question order if possible
            // If you have question numbers or order, sort by them
            // For now, we'll just use the order they come in
            const sortedAnswers = teamAnswers.sort((a, b) => {
                // If you have question numbers, use them for sorting
                // Otherwise sort by questionId or creation time
                return a.questionId.localeCompare(b.questionId);
            });

            // Display first answer
            await displayAnswer(sortedAnswers[0], teamId, test.name, 1, sortedAnswers.length);
            createNavigationButtons(sortedAnswers, 0, teamId, test.name);
        } catch (err) {
            console.error("❌ Error loading data:", err);
            document.querySelector(".answer-container").innerHTML = "<p>Viga andmete laadimisel.</p>";
        }
    }

    async function loadSingleAnswer(teamId, questionId) {
        try {
            const { answers } = await createFetch('/team/answers', 'GET');

            const answer = answers.find(item =>
                String(item.teamId) === teamId &&
                (String(item.questionId) === questionId || String(item.variantId) === questionId)
            );

            if (!answer) {
                document.querySelector(".answer-container").innerHTML = "<p>Vastus ei leitud.</p>";
                return;
            }

            await displayAnswer(answer, teamId, null, 1, 1);
        } catch (err) {
            console.error("❌ Error loading answer:", err);
            document.querySelector(".answer-container").innerHTML = "<p>Viga vastuse laadimisel.</p>";
        }
    }

    async function displayAnswer(answer, teamId, testName = null, questionNumber = 1, totalQuestions = 1) {
        try {
            let teamName = answer.team_name;
            if (!teamName) {
                try {
                    const teamData = await createFetch(`/team/team/${teamId}`, 'GET');
                    teamName = teamData?.name || "Tiimi nimi";
                } catch {
                    teamName = "Tiimi nimi";
                }
            }

            let questionText = answer.question_text;
            if (!questionText) {
                try {
                    const questionData = await createFetch(`/question/${answer.questionId}`, 'GET');
                    questionText = questionData?.description || "Küsimus";
                } catch {
                    questionText = "Küsimus";
                }
            }

            const teamNameElement = document.querySelector("#teamName h1");
            if (teamNameElement) {
                teamNameElement.textContent = testName ? `${teamName} - ${testName}` : teamName;
            }

            const questionElement = document.querySelector(".question");
            if (questionElement) {
                questionElement.textContent = `${questionNumber}. ${questionText}`;
            }

            const answerText = document.getElementById("answer-text");
            const answerImg = document.getElementById("answer-image");

            // 1. Try direct answer.answer value
            let finalAnswer = answer.answer;

            // 2. If empty, try through variantId
            if (!finalAnswer && answer.variantId) {
                try {
                    const variantData = await createFetch(`/variant/${answer.variantId}`, 'GET');
                    finalAnswer = variantData?.content || variantData?.value || null;
                } catch (err) {
                    console.warn("❗ Could not get variant:", err);
                }
            }

            // 3. Display
            if (answerText && answerImg) {
                if (finalAnswer?.startsWith("data:image")) {
                    answerImg.src = finalAnswer;
                    answerImg.style.display = "block";
                    answerText.textContent = "";
                } else {
                    answerImg.style.display = "none";
                    answerText.textContent = finalAnswer ?? "(puudub)";
                }
            }

            const metaElement = document.querySelector(".meta");
            if (metaElement) {
                metaElement.textContent = `Punktid: ${answer.points ?? "hindamata"} | Küsimus ${questionNumber} / ${totalQuestions}`;
            }

        } catch (err) {
            console.error("❌ Error displaying answer:", err);
        }
    }

    function createNavigationButtons(answers, currentIndex, teamId, testName = null) {
        const container = document.querySelector(".answer-container");
        if (!container) return;

        container.querySelector(".navigation-buttons")?.remove();

        const navDiv = document.createElement("div");
        navDiv.className = "navigation-buttons";
        navDiv.style.cssText = "margin-top: 20px; text-align: center;";

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "← Eelmine küsimus";
        prevBtn.disabled = currentIndex === 0;
        prevBtn.onclick = () => {
            if (currentIndex > 0) {
                displayAnswer(answers[currentIndex - 1], teamId, testName, currentIndex, answers.length);
                createNavigationButtons(answers, currentIndex - 1, teamId, testName);
            }
        };

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Järgmine küsimus →";
        nextBtn.disabled = currentIndex === answers.length - 1;
        nextBtn.onclick = () => {
            if (currentIndex < answers.length - 1) {
                displayAnswer(answers[currentIndex + 1], teamId, testName, currentIndex + 2, answers.length);
                createNavigationButtons(answers, currentIndex + 1, teamId, testName);
            }
        };

        const counter = document.createElement("span");
        counter.textContent = ` Küsimus ${currentIndex + 1} / ${answers.length} `;
        counter.style.margin = "0 15px";
        counter.style.fontWeight = "bold";

        navDiv.appendChild(prevBtn);
        navDiv.appendChild(counter);
        navDiv.appendChild(nextBtn);

        container.appendChild(navDiv);
    }

    const { teamId, questionId, attemptId } = getParams();
    console.log("Params:", { teamId, questionId, attemptId });

    if (!teamId) {
        document.querySelector(".answer-container").innerHTML = "<p>URL-is puudub tiimi ID.</p>";
        return;
    }

    if (questionId) {
        loadSingleAnswer(teamId, questionId);
    } else {
        loadAllTeamAnswers(teamId, attemptId); // attemptId can be undefined – will be found automatically
    }
});
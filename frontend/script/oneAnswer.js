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

    async function loadFirstQuestion(teamId, attemptId) {
        try {
            // Lae kõik vajalikud andmed
            const { answers } = await createFetch('/team/answers', 'GET');
            const { tests } = await createFetch('/test/tests', 'GET');
            const { attempts } = await createFetch('/team/attempts', 'GET');
            
            // Leia õige attempt
            const attempt = attempts.find(a => a.teamId === teamId);
            if (!attempt) {
                throw new Error("Attempt not found");
            }

            // Leia test
            const test = tests.find(t => t.id === attempt.testId);
            if (!test) {
                throw new Error("Test not found");
            }

            // Leia selle attempt'i kõik vastused
            const teamAnswers = answers.filter(answer => answer.attempt_id === attemptId);
            
            if (teamAnswers.length === 0) {
                document.querySelector(".answer-container").innerHTML = "<p>Sellel tiimil ei ole vastuseid.</p>";
                return;
            }

            // Võta esimene vastus
            const firstAnswer = teamAnswers[0];
            
            await displayAnswer(firstAnswer, teamId, test.name);
            
            // Lisa navigeerimise nupud
            createNavigationButtons(teamAnswers, 0, teamId);
            
        } catch (err) {
            console.error("❌ Viga andmete laadimisel:", err);
            document.querySelector(".answer-container").innerHTML = "<p>Viga andmete laadimisel.</p>";
        }
    }

    async function loadSingleAnswer(teamId, questionId) {
        try {
            const { answers } = await createFetch('/team/answers', 'GET');
            
            // Leia vastus question_id või variant_id järgi
            let answer = answers.find(item =>
                String(item.team_id) === teamId &&
                (String(item.question_id) === questionId || String(item.variant_id) === questionId)
            );

            if (!answer) {
                document.querySelector(".answer-container").innerHTML = "<p>Vastus ei leitud.</p>";
                return;
            }

            await displayAnswer(answer, teamId);
            
        } catch (err) {
            console.error("❌ Viga vastuse laadimisel:", err);
            document.querySelector(".answer-container").innerHTML = "<p>Viga vastuse laadimisel.</p>";
        }
    }

    async function displayAnswer(answer, teamId, testName = null) {
        try {
            // Lae tiimi nimi
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
                    const questionData = await createFetch(`/question/${answer.question_id}`, 'GET');
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
                questionElement.textContent = `1. ${questionText}`;
            }

            const answerText = document.getElementById("answer-text");
            const answerImg = document.getElementById("answer-image");

            if (answerText && answerImg) {
                if (answer.answer?.startsWith("data:image")) {
                    answerImg.src = answer.answer;
                    answerImg.style.display = "block";
                    answerText.textContent = "";
                } else {
                    answerImg.style.display = "none";
                    answerText.textContent = answer.answer || "(puudub)";
                }
            }

            const metaElement = document.querySelector(".meta");
            if (metaElement) {
                const metaText = `Punktid: ${answer.points ?? "hindamata"}`;
                metaElement.textContent = metaText;
            }

        } catch (err) {
            console.error("❌ Viga vastuse kuvamisel:", err);
        }
    }

    function createNavigationButtons(answers, currentIndex, teamId) {
        const container = document.querySelector(".answer-container");
        if (!container) return;

        const existingNav = container.querySelector(".navigation-buttons");
        if (existingNav) {
            existingNav.remove();
        }

        const navDiv = document.createElement("div");
        navDiv.className = "navigation-buttons";
        navDiv.style.cssText = "margin-top: 20px; text-align: center;";

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "← Eelmine";
        prevBtn.disabled = currentIndex === 0;
        prevBtn.onclick = () => {
            if (currentIndex > 0) {
                displayAnswer(answers[currentIndex - 1], teamId);
                createNavigationButtons(answers, currentIndex - 1, teamId);
            }
        };

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Järgmine →";
        nextBtn.disabled = currentIndex === answers.length - 1;
        nextBtn.onclick = () => {
            if (currentIndex < answers.length - 1) {
                displayAnswer(answers[currentIndex + 1], teamId);
                createNavigationButtons(answers, currentIndex + 1, teamId);
            }
        };

        const counter = document.createElement("span");
        counter.textContent = ` ${currentIndex + 1} / ${answers.length} `;
        counter.style.margin = "0 15px";

        navDiv.appendChild(prevBtn);
        navDiv.appendChild(counter);
        navDiv.appendChild(nextBtn);
        
        container.appendChild(navDiv);
    }

    const { teamId, questionId, attemptId } = getParams();
    
    if (!teamId) {
        document.querySelector(".answer-container").innerHTML = "<p>URL-is puudub tiimi ID.</p>";
        return;
    }

    if (questionId) {
        loadSingleAnswer(teamId, questionId);
    } else {
        loadFirstQuestion(teamId, attemptId);
    }
});
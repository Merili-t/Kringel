import { createFetch } from "./utils/createFetch.js";

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const attemptId = urlParams.get("id");
    
    if (!attemptId) {
        alert("Katse ID puudub.");
        return;
    }
    
    loadLeaderboard(attemptId);
});

async function loadLeaderboard(attemptId) {
    try {
        // 1. Fetch attempt data to get teamId and testId
        const attemptResult = await createFetch(`/team/attempt/${attemptId}`, "GET", "");
        
        if (attemptResult.error || !attemptResult.teamId || !attemptResult.testId) {
            console.error("Katse andmete laadimine ebaõnnestus:", attemptResult.error);
            alert("Katse andmete laadimine ebaõnnestus.");
            return;
        }
        
        const { testId, teamId } = attemptResult;
        
        // 2. Fetch test details
        const testResult = await createFetch(`/test/${testId}`, "GET", "");
        
        if (testResult.error || !testResult.id) {
            console.error("Testi andmete laadimine ebaõnnestus:", testResult.error);
            alert("Testi andmete laadimine ebaõnnestus.");
            return;
        }
        
        renderTestInfo(testResult);
        
        // 3. Fetch leaderboard (assuming this is the correct endpoint)
        const leaderboardResult = await createFetch(`/leaderboard/${testId}`, "GET", "");
        
        if (leaderboardResult.error || !Array.isArray(leaderboardResult)) {
            console.error("Edetabeli andmete laadimine ebaõnnestus:", leaderboardResult.error);
            alert("Edetabeli andmete laadimine ebaõnnestus.");
            return;
        }
        
        renderLeaderboard(leaderboardResult);
        setupPdfDownload(testId);
        
    } catch (error) {
        console.error("Viga edetabeli laadimisel:", error);
        alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    }
}

function renderTestInfo(test) {
    const testNameEl = document.getElementById("test-name");
    const testDescEl = document.getElementById("test-description");
    const questionCountEl = document.getElementById("question-count");
    const testDateEl = document.getElementById("test-date");
    const participantCountEl = document.getElementById("participant-count");
    
    if (testNameEl) testNameEl.textContent = test.name || "Testi nimi";
    if (testDescEl) testDescEl.textContent = test.description || "Kirjeldus puudub";
    if (questionCountEl) questionCountEl.textContent = `${test.questionsCount || 0} küsimust`;
    
    if (testDateEl && test.createdAt) {
        const createdAt = new Date(test.createdAt);
        testDateEl.textContent = createdAt.toLocaleDateString("et-EE");
    }
    
    if (participantCountEl && test.participantCount) {
        participantCountEl.textContent = `Osalejaid: ${test.participantCount} tiimi`;
    }
}

function renderLeaderboard(teams) {
    const tbody = document.getElementById("leaderboard-tbody");
    
    if (!tbody) {
        console.error("Leaderboard tbody element not found");
        return;
    }
    
    tbody.innerHTML = "";
    
    // Sorteeri punktide järgi kahanevalt
    teams.sort((a, b) => (b.points || 0) - (a.points || 0));
    
    teams.forEach((team, index) => {
        const row = document.createElement("tr");
        
        const rank = document.createElement("td");
        rank.textContent = index + 1;
        
        const name = document.createElement("td");
        name.textContent = team.name || team.email || "Tiimi nimi puudub";
        
        const answered = document.createElement("td");
        answered.textContent = `${team.answeredQuestions || 0}`;
        
        const points = document.createElement("td");
        points.textContent = `${team.points || 0}`;
        
        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(answered);
        row.appendChild(points);
        
        tbody.appendChild(row);
    });
}

function setupPdfDownload(testId) {
    const pdfLink = document.getElementById("pdf-download-link");
    
    if (pdfLink) {
        pdfLink.href = `/pdf/leaderboard/${testId}`;
        pdfLink.setAttribute("download", "");
    }
}
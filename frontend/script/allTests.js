import createFetch from "./utils/createFetch.js";

// LISA SIIA OMA TESTIDE ID-D KÄSITSI!
const MANUAL_TEST_IDS = [
    "019767ed-4f37-7168-99ab-c0a191ca10f2",  // Võetud TestGuide failist
    // Lisa siia veel teste vastavalt vajadusele:
    // "teine-test-id",
    // "kolmas-test-id",
];

const elements = {
  testSection: document.querySelector(".test-section"),
};

document.addEventListener("DOMContentLoaded", function () {
    loadAllTests();
});

async function loadAllTests() {
    try {
        const tests = await fetchAllTests();
        populateAllTests(tests);
    } catch (error) {
        console.error("Error while loading tests:", error);
        showError("Viga testide laadimisel");
    }
}

async function fetchAllTests() {
    const tests = [];
    
    for (const testId of MANUAL_TEST_IDS) {
        try {
            console.log(`Laabin testi: ${testId}`);
            const testData = await createFetch(`/test/${testId}`, "GET");
            console.log("Test data:", testData);
            
            if (testData && !testData.error) {
                console.log(`Laabin küsimuste arvu testile: ${testId}`);
                const questionCountData = await fetchQuestionCount(testId);
                console.log("Question count data:", questionCountData);
                const questionCount = questionCountData.count || 0;
                
                // Valideerime andmed enne lisamist
                const validatedTest = {
                    id: testId,
                    name: (testData.name && testData.name.trim()) ? testData.name.trim() : `Test ${testId}`,
                    description: (testData.description && testData.description.trim()) ? testData.description.trim() : "Kirjeldus puudub",
                    questionsCount: questionCount,
                    ...testData
                };
                
                tests.push(validatedTest);
            } else {
                console.warn(`Test ${testId} andmed ei ole saadaval:`, testData);
                // Lisa placeholder test ka errorite korral
                tests.push({
                    id: testId,
                    name: ` ${testId} (viga)`,
                    description: "Andmete laadimine ebaõnnestus",
                    questionsCount: 0,
                    error: true
                });
            }
        } catch (error) {
            console.warn(`Ei saanud laadida testi ${testId}:`, error);
            // Lisa placeholder test ka errorite korral
            tests.push({
                id: testId,
                name: `Test ${testId} (viga)`,
                description: "Andmete laadimine ebaõnnestus",
                questionsCount: 0,
                error: true
            });
        }
    }
    
    console.log("Kõik testid laaditud:", tests);
    return tests;
}

async function fetchQuestionCount(testId) {
    try {
        console.log(`Laabin küsimuste arvu: ${testId}`);
        const result = await createFetch(`/test/${testId}/questions/count`, "GET");
        console.log("Question count result:", result);
        return result || { count: 0 };
    } catch (error) {
        console.warn("Error fetching question count:", error);
        return { count: 0 };
    }
}

function populateAllTests(tests) {
    if (!elements.testSection) {
        console.error("Test section container not found");
        return;
    }
    
    elements.testSection.innerHTML = "";
    
    if (tests.length === 0) {
        const noTestsMsg = document.createElement("div");
        noTestsMsg.classList.add("poppins-regular");
        noTestsMsg.textContent = "Teste ei leitud.";
        noTestsMsg.style.textAlign = "center";
        noTestsMsg.style.padding = "20px";
        elements.testSection.appendChild(noTestsMsg);
        return;
    }
    
    tests.forEach((test) => {
        const testWrapper = document.createElement("div");
        testWrapper.style.marginBottom = "20px";
        
        // Test header
        const testHeader = document.createElement("div");
        testHeader.classList.add("test-header");
        
        const testName = document.createElement("h3");
        testName.classList.add("poppins-bold");
        // Kontrolli tühja stringi
        const testNameText = (test.name && test.name.trim()) ? test.name.trim() : `Test ${test.id}`;
        testName.textContent = testNameText;
        
        const testDescription = document.createElement("div");
        testDescription.classList.add("test-description", "poppins-regular");
        // Kontrolli tühja stringi
        const descriptionText = (test.description && test.description.trim()) ? test.description.trim() : "Kirjeldus puudub";
        testDescription.textContent = descriptionText;
        
        testHeader.appendChild(testName);
        testHeader.appendChild(testDescription);
        
        // Test container
        const testContainer = document.createElement("div");
        testContainer.classList.add("test-container");
        
        // Küsimused
        const questionsContainer = document.createElement("div");
        questionsContainer.classList.add("text-icon-container");
        
        const testIcon = document.createElement("img");
        testIcon.src = "../images/testIcon.png";
        testIcon.alt = "computer quiz icon";
        testIcon.classList.add("test-icon");
        
        const questionsText = document.createElement("div");
        questionsText.classList.add("questions", "poppins-regular");
        const questionCount = test.questionsCount || 0;
        const questionWord = questionCount === 1 ? "küsimus" : "küsimust";
        questionsText.textContent = `${questionCount} ${questionWord}`;
        
        questionsContainer.appendChild(testIcon);
        questionsContainer.appendChild(questionsText);
        
        // Vastused
        const answersContainer = document.createElement("div");
        answersContainer.style.cursor = "pointer";
        answersContainer.classList.add("text-icon-container", "nav-btn");
        answersContainer.setAttribute("data-target", "testAnswers.html");
        answersContainer.setAttribute("data-test-id", test.id);
        
        const keyIcon = document.createElement("img");
        keyIcon.src = "../images/keyIcon.png";
        keyIcon.alt = "key icon";
        keyIcon.classList.add("test-icon");
        
        const answersText = document.createElement("div");
        answersText.classList.add("answers", "poppins-regular");
        answersText.textContent = "Vastused";
        
        answersContainer.appendChild(keyIcon);
        answersContainer.appendChild(answersText);
        
        // Kustutamine
        const deleteContainer = document.createElement("div");
        deleteContainer.style.cursor = "pointer";
        deleteContainer.classList.add("text-icon-container");
        deleteContainer.setAttribute("data-popup", "delete");
        deleteContainer.setAttribute("data-test-id", test.id);
        
        const trashIcon = document.createElement("img");
        trashIcon.src = "../images/trashIcon.png";
        trashIcon.alt = "trash icon";
        trashIcon.classList.add("test-icon");
        
        const deleteText = document.createElement("div");
        deleteText.classList.add("delete-test", "poppins-regular");
        deleteText.textContent = "Kustuta test";
        
        deleteContainer.appendChild(trashIcon);
        deleteContainer.appendChild(deleteText);
        
        // Lisa kõik elemendid container'isse
        testContainer.appendChild(questionsContainer);
        testContainer.appendChild(answersContainer);
        testContainer.appendChild(deleteContainer);
        
        // Lisa header ja container wrapper'isse
        testWrapper.appendChild(testHeader);
        testWrapper.appendChild(testContainer);
        
        // Lisa wrapper peamisesse container'isse
        elements.testSection.appendChild(testWrapper);
    });
}

async function deleteTest(testId) {
    try {
        const data = {
            id: testId,
            action: 'delete'
        };
        
        const result = await createFetch("/test", "DELETE", data);
        
        if (result.error) {
            alert("Testi kustutamine ebaõnnestus: " + result.error);
            return false;
        }
        
        // Laadi testid uuesti pärast kustutamist
        await loadAllTests();
        return true;
        
    } catch (error) {
        console.error("Error deleting test:", error);
        alert("Midagi läks valesti: " + error.message);
        return false;
    }
}

// Eemaldame mittevajalikud funktsioonid
// window.deleteTest ja window.AllTests jäävad

// Ekspordime funktsioonid globaalselt
window.deleteTest = deleteTest;
window.AllTests = {
    loadAllTests,
    deleteTest,
};
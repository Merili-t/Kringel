import createFetch from "./utils/createFetch";

document.addEventListener("DOMContentLoaded", function () {
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  loadTests();
});

async function loadTests() {
  try {
    // Use the endpoint to fetch tests and pass an empty string for GET requests
    const result = await createFetch("/test/tests", "GET", "");
    console.log("Raw API result:", result);

    if (result.error) {
      console.error("Error fetching tests:", result.error);
      alert("Testide laadimine ebaõnnestus.");
      return;
    }

    // Expect result is either an array or an object with a tests property.
    const tests = Array.isArray(result) ? result : result.tests || [];
    console.log("Parsed tests array:", tests);

    // Sort tests only if 'createdAt' exists on the first test
    if (tests.length > 0 && tests[0].createdAt) {
      tests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // If tests exist but don't have questionsCount, add them.
    if (tests.length > 0 && !tests[0].hasOwnProperty("questionsCount")) {
      await addQuestionCounts(tests);
    }

    renderTests(tests);
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
  }
}

async function addQuestionCounts(tests) {
  try {
    for (let test of tests) {
      // Use an empty string for GET requests
      const questionResult = await createFetch(`/question/count/${test.id}`, "GET", "");
      test.questionsCount = questionResult.error ? 0 : (questionResult.count || 0);
    }
  } catch (error) {
    console.error("Error fetching question counts:", error);
    tests.forEach(test => {
      if (!test.questionsCount) test.questionsCount = 0;
    });
  }
}

function renderTests(tests) {
  const testSectionContainer = document.querySelector(".test-content");
  testSectionContainer.innerHTML = "";
  
  if (!tests || tests.length === 0) {
    const noTestsMsg = document.createElement("div");
    noTestsMsg.classList.add("poppins-regular");
    noTestsMsg.textContent = "Teste ei leitud.";
    noTestsMsg.style.textAlign = "center";
    noTestsMsg.style.padding = "20px";
    testSectionContainer.appendChild(noTestsMsg);
    return;
  }

  tests.forEach(test => {
    const testSection = document.createElement("div");
    testSection.classList.add("test-section");
    testSection.style.marginBottom = "24px";

    const testHeader = document.createElement("div");
    testHeader.classList.add("test-header");

    const testName = document.createElement("h3");
    testName.classList.add("poppins-bold");
    testName.textContent = test.name || "Testi nimi";

    const testDescription = document.createElement("div");
    testDescription.classList.add("test-description", "poppins-regular");
    testDescription.textContent = test.description || "Kirjeldus...";

    testHeader.appendChild(testName);
    testHeader.appendChild(testDescription);

    const testContainer = document.createElement("div");
    testContainer.classList.add("test-container");

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

    testContainer.appendChild(questionsContainer);
    testContainer.appendChild(answersContainer);
    testContainer.appendChild(deleteContainer);

    testSection.appendChild(testHeader);
    testSection.appendChild(testContainer);

    testSectionContainer.appendChild(testSection);
  });
}

async function deleteTest(testId) {
  try {
    const data = { id: testId };
    const result = await createFetch("/test", "DELETE", data);
    if (result.error) {
      alert("Testi kustutamine ebaõnnestus.");
      return false;
    }
    await loadTests();
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    return false;
  }
}

window.deleteTest = deleteTest;

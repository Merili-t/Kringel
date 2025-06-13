// allTests.js
import createFetch from "./utils/createFetch"; // Import createFetch

document.addEventListener("DOMContentLoaded", function () {
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL); // Debug line
  loadTests();
});

async function loadTests() { // Needs to have async to be able to use fetch
  try {
    // createFetch wants (route, method, data) in this order. For GET data is a string or null
    const result = await createFetch('/test', 'GET', null);
    
    if (result.error) {
      console.error("Error fetching tests:", result.error);
      alert("Testide laadimine ebaõnnestus.");
      return;
    }

    // Assume result is an array of tests or result.tests contains the array
    const tests = Array.isArray(result) ? result : result.tests || [];
    
    // If backend doesn't provide questionsCount, fetch it separately for each test
    if (tests.length > 0 && !tests[0].hasOwnProperty('questionsCount')) {
      await addQuestionCounts(tests);
    }
    
    // Clear existing test content and rebuild
    renderTests(tests);
    
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
  }
}

// Function to add question counts to tests if not provided by backend
async function addQuestionCounts(tests) {
  try {
    // Get question counts for all tests
    for (let test of tests) {
      // For GET with parameter, pass the test ID as string
      const questionResult = await createFetch(`/question/count/${test.id}`, 'GET', null);
      test.questionsCount = questionResult.error ? 0 : (questionResult.count || 0);
    }
  } catch (error) {
    console.error("Error fetching question counts:", error);
    // Set default count if fetch fails
    tests.forEach(test => {
      if (!test.questionsCount) {
        test.questionsCount = 0;
      }
    });
  }
}

function renderTests(tests) {
  // Select the test-section container
  const testSectionContainer = document.querySelector(".test-section");
  
  // Clear existing content but keep the structure
  testSectionContainer.innerHTML = "";
  
  // If no tests, show a message
  if (!tests || tests.length === 0) {
    const noTestsMsg = document.createElement("div");
    noTestsMsg.classList.add("poppins-regular");
    noTestsMsg.textContent = "Teste ei leitud.";
    noTestsMsg.style.textAlign = "center";
    noTestsMsg.style.padding = "20px";
    testSectionContainer.appendChild(noTestsMsg);
    return;
  }

  // For each test, create the test structure
  tests.forEach((test) => {
    // Create test wrapper
    const testWrapper = document.createElement("div");
    testWrapper.style.marginBottom = "20px";
    
    // Create test header
    const testHeader = document.createElement("div");
    testHeader.classList.add("test-header");
    
    // Test name - using correct database field 'name'
    const testName = document.createElement("h3");
    testName.classList.add("poppins-bold");
    testName.textContent = test.name || "Testi nimi";
    
    // Test description - using correct database field 'description'
    const testDescription = document.createElement("div");
    testDescription.classList.add("test-description", "poppins-regular");
    testDescription.textContent = test.description || "Kirjeldus...";
    
    // Append to header
    testHeader.appendChild(testName);
    testHeader.appendChild(testDescription);
    
    // Create test container for icons
    const testContainer = document.createElement("div");
    testContainer.classList.add("test-container");
    
    // Questions container
    const questionsContainer = document.createElement("div");
    questionsContainer.classList.add("text-icon-container");
    
    const testIcon = document.createElement("img");
    testIcon.src = "../images/testIcon.png";
    testIcon.alt = "computer quiz icon";
    testIcon.classList.add("test-icon");
    
    const questionsText = document.createElement("div");
    questionsText.classList.add("questions", "poppins-regular");
    // Display actual question count from database
    const questionCount = test.questionsCount || 0;
    const questionWord = questionCount === 1 ? "küsimus" : "küsimust";
    questionsText.textContent = `${questionCount} ${questionWord}`;
    
    questionsContainer.appendChild(testIcon);
    questionsContainer.appendChild(questionsText);
    
    // Answers container
    const answersContainer = document.createElement("div");
    answersContainer.style.cursor = "pointer";
    answersContainer.classList.add("text-icon-container", "nav-btn");
    answersContainer.setAttribute("data-target", "testAnswers.html");
    answersContainer.setAttribute("data-test-id", test.id); // Pass test ID - 'id' field exists in database
    
    const keyIcon = document.createElement("img");
    keyIcon.src = "../images/keyIcon.png";
    keyIcon.alt = "key icon";
    keyIcon.classList.add("test-icon");
    
    const answersText = document.createElement("div");
    answersText.classList.add("answers", "poppins-regular");
    answersText.textContent = "Vastused";
    
    answersContainer.appendChild(keyIcon);
    answersContainer.appendChild(answersText);
    
    // Delete container
    const deleteContainer = document.createElement("div");
    deleteContainer.style.cursor = "pointer";
    deleteContainer.classList.add("text-icon-container");
    deleteContainer.setAttribute("data-popup", "delete");
    deleteContainer.setAttribute("data-test-id", test.id); // Store test ID for deletion - 'id' field exists
    
    const trashIcon = document.createElement("img");
    trashIcon.src = "../images/trashIcon.png";
    trashIcon.alt = "trash icon";
    trashIcon.classList.add("test-icon");
    
    const deleteText = document.createElement("div");
    deleteText.classList.add("delete-test", "poppins-regular");
    deleteText.textContent = "Kustuta test";
    
    deleteContainer.appendChild(trashIcon);
    deleteContainer.appendChild(deleteText);
    
    // Append all containers to test container
    testContainer.appendChild(questionsContainer);
    testContainer.appendChild(answersContainer);
    testContainer.appendChild(deleteContainer);
    
    // Append header and container to wrapper
    testWrapper.appendChild(testHeader);
    testWrapper.appendChild(testContainer);
    
    // Append to main container
    testSectionContainer.appendChild(testWrapper);
  });
}

// Function to delete a test - can be called from delete popup
async function deleteTest(testId) { // Needs to have async to be able to use fetch
  try {
    // For DELETE, data is an object with correct field name 'id'
    const data = { id: testId };
    const result = await createFetch('/test', 'DELETE', data); // Changed from '/tests' to '/test' for consistency
    
    if (result.error) {
      alert("Testi kustutamine ebaõnnestus.");
      return false;
    }
    
    // Reload tests after successful deletion
    await loadTests();
    return true;
    
  } catch (error) {
    console.error("Delete error:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
    return false;
  }
}

// Export function so it can be used by delete popup
window.deleteTest = deleteTest;
// allTests.js

document.addEventListener("DOMContentLoaded", async function () {
  // --- Stub: Replace the network fetch with dummy tests data ---
  const tests = [
    {
      name: 'Testi nimi 1',
      description: 'Kirjeldus testile 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      questionsCount: 5,
      responsesCount: 3
    },
    {
      name: 'Testi nimi 2',
      description: 'Kirjeldus testile 2: Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.',
      questionsCount: 10,
      responsesCount: 7
    },
    {
      name: 'Testi nimi 3',
      description: 'Kirjeldus testile 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      questionsCount: 8,
      responsesCount: 4
    }
  ];

  try {
    // Original fetch call removed. Now using stubbed 'tests' data.
    // const response = await fetch(testsEndpoint, { ... });
    // const tests = await response.json();

    // Select the container where tests will be injected.
    const testSectionContainer = document.querySelector(".test-section");

    // Optional: Clear any existing content in the test section.
    testSectionContainer.innerHTML = "";

    // For each test, dynamically create a test card.
    tests.forEach((test) => {
      // Create a wrapper for a single test.
      const testWrapper = document.createElement("div");
      testWrapper.classList.add("test-container");

      // Create header container for test info 
      const testHeader = document.createElement("div");
      testHeader.classList.add("test-header");

      // Test name
      const testName = document.createElement("h3");
      testName.classList.add("poppins-bold");
      testName.textContent = test.name;

      // Test description
      const description = document.createElement("div");
      description.classList.add("test-description", "poppins-regular");
      description.textContent = test.description;

      // Append name and description in header
      testHeader.appendChild(testName);
      testHeader.appendChild(description);

      // Create container for icons and additional info
      const iconContainer = document.createElement("div");
      iconContainer.classList.add("test-info-container");

      // Create text-icon container for question count
      const questionContainer = document.createElement("div");
      questionContainer.classList.add("text-icon-container");

      // For the test icon image element
      const testIcon = document.createElement("img");
      testIcon.src = "../images/testIcon.png"; // adjust the path as needed
      testIcon.alt = "computer quiz icon";
      testIcon.classList.add("test-icon");

      // Create a div with the questions count text
      const questionCount = document.createElement("div");
      questionCount.classList.add("questions", "poppins-regular");
      questionCount.textContent = `${test.questionsCount} küsimust`;

      // Append the image and text to the question container
      questionContainer.appendChild(testIcon);
      questionContainer.appendChild(questionCount);

      // Create text-icon container for responses count
      const responseContainer = document.createElement("div");
      responseContainer.classList.add("text-icon-container");

      // For the key icon image element
      const keyIcon = document.createElement("img");
      keyIcon.src = "../images/keyIcon.png"; // adjust file path as needed
      keyIcon.alt = "key icon";
      keyIcon.classList.add("test-icon");

      // Create a div for responses text (optionally a button if you need it clickable)
      const responsesDiv = document.createElement("div");
      responsesDiv.classList.add("answers", "poppins-regular", "nav-btn");
      responsesDiv.textContent = `${test.responsesCount} vastust`;
      // Option: set a data-target attribute if needed, e.g.
      // responsesDiv.setAttribute("data-target", test.responseRoute); 

      // Append the image and responses text to the responses container
      responseContainer.appendChild(keyIcon);
      responseContainer.appendChild(responsesDiv);

      // Create text-icon container for delete action (if permitted)
      const deleteContainer = document.createElement("div");
      deleteContainer.classList.add("text-icon-container");

      // Create a button for delete with an icon
      const deleteButton = document.createElement("button");
      deleteButton.style.all = "unset";
      deleteButton.style.cursor = "pointer";
      // Here we assume you'll further implement the delete logic and popups.
      deleteButton.setAttribute("data-popup", "delete");

      const trashIcon = document.createElement("img");
      trashIcon.src = "../images/trashIcon.png"; // adjust file path as needed
      trashIcon.alt = "trash icon";
      trashIcon.classList.add("test-icon");

      // Append trash icon to the button; then add a label if needed.
      deleteButton.appendChild(trashIcon);

      // Optionally, add delete label next to the button
      const deleteLabel = document.createElement("div");
      deleteLabel.classList.add("delete-test", "poppins-regular");
      deleteLabel.textContent = "Kustuta test";

      deleteContainer.appendChild(deleteButton);
      deleteContainer.appendChild(deleteLabel);

      // Append all icon containers into a single container
      iconContainer.appendChild(questionContainer);
      iconContainer.appendChild(responseContainer);
      iconContainer.appendChild(deleteContainer);

      // Finally, build the test wrapper: add header and icons
      testWrapper.appendChild(testHeader);
      testWrapper.appendChild(iconContainer);

      // Append to the main test-section container in the HTML
      testSectionContainer.appendChild(testWrapper);
    });
  } catch (error) {
    console.error("Error fetching tests data:", error);
    alert("Midagi läks valesti. Palun proovi hiljem uuesti.");
  }
});

import createFetch from "./utils/createFetch";

document.addEventListener("DOMContentLoaded", function () {
  populateDurationDropdown();

  const form = document.getElementById("createForm");
  const backButton = document.querySelector(".back-button");

  if (backButton) {
    backButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../html/allTests.html";
    });
  } else {
    console.error("Back button element was not found.");
  } 

  // When the user submits the form, save the test details.
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const duration = document.getElementById("duration").value;
    const description = document.getElementById("description").value.trim();
    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;

    if (!title || !duration || !startDate || !startTime || !endDate || !endTime) {
      alert("Palun täida kõik vajalikud väljad.");
      return;
    }

    const payload = {
      name: title,
      description,
      timeLimit: parseInt(duration),
      start: `${startDate} ${startTime}`,
      end: `${endDate} ${endTime}`,
    };

    try {
      const result = await createFetch('/test/upload', 'POST', payload);

      if (result.message || result.success) {
        alert("Test edukalt loodud!");
        form.reset();
        window.location.href = "../html/testCreation.html";
      } else {
        alert(result.error || "Midagi läks valesti.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Serveriga ühenduse loomine ebaõnnestus. Palun proovi hiljem uuesti.");
    }
  });
});

// Helper function to populate the duration dropdown.
function populateDurationDropdown() {
  const durationSelect = document.getElementById("duration");
  const durations = [5, 10, 15, 20, 30, 45, 60, 90, 120]; // in minutes
  durations.forEach(min => {
    const option = document.createElement("option");
    option.value = min;
    option.textContent = `${min} min`;
    durationSelect.appendChild(option);
  });
}


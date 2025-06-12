document.addEventListener("DOMContentLoaded", function () {
  populateDurationDropdown();

  const form = document.getElementById("detailForm");
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

    // Gather form inputs.
    const title = document.getElementById("title").value.trim();
    const duration = document.getElementById("duration").value;
    const description = document.getElementById("description").value.trim();
    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;

    // Basic validation.
    if (!title) {
      alert("Palun sisesta pealkiri.");
      return;
    }
    if (!duration) {
      alert("Palun vali sooritus aeg.");
      return;
    }
    if (!startDate || !startTime || !endDate || !endTime) {
      alert("Palun sisesta algus- ja lõpukuupäev ning aeg.");
      return;
    }

    // Construct the payload.
    // <<-- Fix: note "timeLimit" key with a capital 'L' as per API docs.
    const payload = {
      name: title,
      description: description,
      timeLimit: parseInt(duration),
      start: `${startDate} ${startTime}`,
      end: `${endDate} ${endTime}`,
    };

    console.log("Saadame API-le:", payload);

    try {
      const response = await fetch("http://localhost:3006/test/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log(response);
      /*
      if (response.ok) {
        alert("Test edukalt loodud!");
        form.reset();
        // Redirect to testCreation.html after successful save.
        window.location.href = "../html/testCreation.html";
      } else {
        alert(result.error || "Midagi läks valesti.");
      }
      */
    } catch (error) {
      console.log(error)
      // console.error("Error saving test details:", error);
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


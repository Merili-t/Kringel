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
  }

  if (!form) {
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const title = document.getElementById("title")?.value.trim();
      const duration = document.getElementById("duration")?.value;
      const description = document.getElementById("description")?.value.trim();
      const startDate = document.getElementById("startDate")?.value;
      const startTime = document.getElementById("startTime")?.value;
      const endDate = document.getElementById("endDate")?.value;
      const endTime = document.getElementById("endTime")?.value;

      if (!title || !duration || !startDate || !startTime || !endDate || !endTime) {
        alert("Palun täida kõik vajalikud väljad.");
        return;
      }

      const payload = {
        name: title,
        description,
        timeLimit: parseInt(duration),
        start: `${startDate}T${startTime}`,
        end: `${endDate}T${endTime}`,
      };

      const result = await createFetch('/test/upload', 'POST', payload);
      console.log("Backend result:", result);  // Debug: Check the structure

      // Assuming your result includes properties for testId and blockId.
      if (result.message || result.success) {
        // Ensure result.blockId exists.
        if (!result.blockId) {
          alert("Test loodud, kuid ploki ID pole saadud. Kontrolli backend vastust.");
          return;
        }
        
        sessionStorage.setItem("testId", result.testId || result.id);
        sessionStorage.setItem("blockId", result.blockId);

        if(sessionStorage.getItem("blockNumber")){
          sessionStorage.removeItem("blockNumber");
        }

        alert("Test edukalt loodud!");
        form.reset();

        // Redirect to next page where you'll create questions.
        window.location.href = "../html/testCreation.html";
      } else {
        alert(result.error || "Midagi läks valesti.");
      }
    } catch (error) {
      alert("Serveriga ühenduse loomine ebaõnnestus. Palun proovi hiljem uuesti.");
    }
  });
});

function populateDurationDropdown() {
  const durationSelect = document.getElementById("duration");
  const durations = [5, 10, 15, 20, 30, 45, 60, 90, 120];
  durations.forEach(min => {
    const option = document.createElement("option");
    option.value = min;
    option.textContent = `${min} min`;
    durationSelect.appendChild(option);
  });
}

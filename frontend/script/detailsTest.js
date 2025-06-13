import createFetch from "./utils/createFetch";

console.log(`[🧠 ${new Date().toISOString()}] Script loaded`);

document.addEventListener("DOMContentLoaded", function () {
  console.log(`[🚀 ${new Date().toISOString()}] DOM fully loaded`);

  populateDurationDropdown();

  const form = document.getElementById("createForm");
  const backButton = document.querySelector(".back-button");

  console.log(`[🎯 ${new Date().toISOString()}] form:`, form);
  console.log(`[🎯 ${new Date().toISOString()}] backButton:`, backButton);

  if (backButton) {
    backButton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(`[🔙 ${new Date().toISOString()}] Back clicked`);
      window.location.href = "../html/allTests.html";
    });
  }

  if (!form) {
    console.error(`[❌ ${new Date().toISOString()}] Form not found`);
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log(`[📨 ${new Date().toISOString()}] Submit triggered`);

    try {
      const title = document.getElementById("title")?.value.trim();
      const duration = document.getElementById("duration")?.value;
      const description = document.getElementById("description")?.value.trim();
      const startDate = document.getElementById("startDate")?.value;
      const startTime = document.getElementById("startTime")?.value;
      const endDate = document.getElementById("endDate")?.value;
      const endTime = document.getElementById("endTime")?.value;

      console.log(`[📝 ${new Date().toISOString()}] Input values:`, {
        title, duration, description, startDate, startTime, endDate, endTime
      });

      if (!title || !duration || !startDate || !startTime || !endDate || !endTime) {
        console.warn(`[⚠️ ${new Date().toISOString()}] Validation failed`);
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

      console.log(`[📦 ${new Date().toISOString()}] Sending payload:`, payload);

      const result = await createFetch('/test/upload', 'POST', payload);

      console.log(`[✅ ${new Date().toISOString()}] Server response:`, result);

      if (result.message || result.success) {
        alert("Test edukalt loodud!");
        form.reset();
        const shouldRedirect = true;
        if (shouldRedirect) {
          console.log(`[➡️ ${new Date().toISOString()}] Redirecting to testCreation.html`);
          //window.location.href = "../html/testCreation.html";
        } else {
          console.log(`[🛑 ${new Date().toISOString()}] Redirect skipped for debugging`);
        }
      } else {
        alert(result.error || "Midagi läks valesti.");
      }
    } catch (error) {
      console.error(`[🔥 ${new Date().toISOString()}] Submission error:`, error);
      alert("Serveriga ühenduse loomine ebaõnnestus. Palun proovi hiljem uuesti.");
    } finally {
      console.log(`[📤 ${new Date().toISOString()}] Submit handler finished`);
    }
  });
});

function populateDurationDropdown() {
  console.log(`[⏳ ${new Date().toISOString()}] Populating duration dropdown`);
  const durationSelect = document.getElementById("duration");
  const durations = [5, 10, 15, 20, 30, 45, 60, 90, 120];
  durations.forEach(min => {
    const option = document.createElement("option");
    option.value = min;
    option.textContent = `${min} min`;
    durationSelect.appendChild(option);
  });
  console.log(`[✅ ${new Date().toISOString()}] Duration options added`);
}

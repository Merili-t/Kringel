import createFetch from "./utils/createFetch";

console.log("🧠 Script loaded");

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM fully loaded and ready!");

  populateDurationDropdown();

  const form = document.getElementById("createForm");
  const backButton = document.querySelector(".back-button");

  console.log("🎯 Lookup: form =", form);
  console.log("🎯 Lookup: backButton =", backButton);

  if (backButton) {
    console.log("🧭 Adding click event to back button");
    backButton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🔙 Back button clicked. Navigating to allTests.html...");
      window.location.href = "../html/allTests.html";
    });
  } else {
    console.error("❌ Back button not found.");
  }

  if (!form) {
    console.error("❌ Form not found. Submit handler not attached.");
    return;
  }

  console.log("📌 Attaching submit handler to form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("📨 Submit event triggered");

    try {
      const title = document.getElementById("title")?.value.trim();
      const duration = document.getElementById("duration")?.value;
      const description = document.getElementById("description")?.value.trim();
      const startDate = document.getElementById("startDate")?.value;
      const startTime = document.getElementById("startTime")?.value;
      const endDate = document.getElementById("endDate")?.value;
      const endTime = document.getElementById("endTime")?.value;

      console.log("📝 Form input values:", {
        title, duration, description, startDate, startTime, endDate, endTime
      });

      if (!title || !duration || !startDate || !startTime || !endDate || !endTime) {
        console.warn("⚠️ Validation failed. Fields missing.");
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

      console.log("📦 Ready to send payload:", payload);

      const result = await createFetch('/test/upload', 'POST', payload);

      console.log("📬 Server response received:", result);

      if (result.message || result.success) {
        console.log("✅ Upload successful — redirecting.");
        alert("Test edukalt loodud!");
        form.reset();
        window.location.href = "../html/testCreation.html";
      } else {
        console.warn("⚠️ Upload failed with server response:", result);
        alert(result.error || "Midagi läks valesti.");
      }

    } catch (error) {
      console.error("💥 Unexpected error during submission:", error);
      alert("Serveriga ühenduse loomine ebaõnnestus. Palun proovi hiljem uuesti.");
    }

    console.log("📤 Form submit handler completed");
  });
});

function populateDurationDropdown() {
  console.log("⏳ Running populateDurationDropdown()");
  const durationSelect = document.getElementById("duration");
  if (!durationSelect) {
    console.error("❌ Cannot populate duration — element not found.");
    return;
  }

  const durations = [5, 10, 15, 20, 30, 45, 60, 90, 120];
  durations.forEach(min => {
    const option = document.createElement("option");
    option.value = min;
    option.textContent = `${min} min`;
    durationSelect.appendChild(option);
  });
  console.log("✅ Duration options populated:", durations);
}

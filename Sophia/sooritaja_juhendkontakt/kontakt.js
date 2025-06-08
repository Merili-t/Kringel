document.addEventListener("DOMContentLoaded", function () {
const fileInput = document.getElementById("video-upload");
const uploadBox = document.getElementById("upload-box");

uploadBox.addEventListener("click", function () {
    fileInput.click();
});

// Kui fail on valitud, tee midagi (nt näita alerti või failinime)
fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    alert("Valitud fail: " + fileName);
    }
});
});

//Puudu andmebaasi salvestamise osa


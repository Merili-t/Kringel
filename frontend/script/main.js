// main.js

// Stub for tests initialization (you can extend this as required)
function initializeTests(){
    console.log("Tests initialized in main.js");
    // For example, you could call renderTests here if it weren't already auto‑triggered in testAnswers.js.
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("Application initializing...");

    // Initialize router via function from testAnswers.js
    initializeRouter();

    // Initialize tests (stub function)
    initializeTests();

    console.log("Application initialized successfully");
});

// Global error handler
window.addEventListener("error", function(event) {
    console.error("Global error:", event.error);
});

// Global unhandled promise rejection handler
window.addEventListener("unhandledrejection", function(event) {
    console.error("Unhandled promise rejection:", event.reason);
});

// Utility functions
function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("et-EE");
}

function formatTime(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("et-EE");
}

// Expose utilities globally
window.appUtils = {
    formatDate,
    formatTime
};

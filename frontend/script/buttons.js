"use strict";
const buttons = document.querySelectorAll(".nav-btn");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const targetPage = button.dataset.target;
        if (targetPage && window.location.pathname !== new URL(targetPage, window.location.origin).pathname) {
            window.location.href = targetPage;
        }
    });
});

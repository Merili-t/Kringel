"use strict";
document.querySelectorAll('.guide-description, .tutorial-description').forEach(description => {
    description.style.display = 'none';
});
document.querySelectorAll('.expand-arrow').forEach(arrow => {
    arrow.style.transform = 'rotate(0deg)';
});
// Expandable sections functionality
document.querySelectorAll('.expand-arrow').forEach(arrow => {
    arrow.addEventListener('click', function () {
        const isExpanded = this.style.transform === 'rotate(180deg)';
        const section = this.closest('.guide-section');
        const description = section === null || section === void 0 ? void 0 : section.querySelector('.guide-description, .tutorial-description');
        this.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        if (description) {
            description.style.display = isExpanded ? 'none' : 'block';
        }
    });
});

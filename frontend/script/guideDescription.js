"use strict";

// Alguses peida kõik kirjeldused
document.querySelectorAll('.guide-description, .tutorial-description').forEach(description => {
    description.style.display = 'none';
});

// Alguses kõik nooled üles
document.querySelectorAll('.expand-arrow').forEach(arrow => {
    arrow.style.transform = 'rotate(0deg)';
});

// Tee terve sektsioon klõpsatavaks
document.querySelectorAll('.guide-section').forEach(section => {
    section.addEventListener('click', function () {
        const arrow = this.querySelector('.expand-arrow');
        const description = this.querySelector('.guide-description, .tutorial-description');
        
        if (arrow && description) {
            const isExpanded = arrow.style.transform === 'rotate(180deg)';
            
            // Pööra nool
            arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
            
            // Näita/peida kirjeldus
            description.style.display = isExpanded ? 'none' : 'block';
        }
    });
    
    // Lisa visuaalne vihje, et kogu kast on klõpsatav
    section.style.cursor = 'pointer';
});
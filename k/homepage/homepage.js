// Homepage JavaScript functionality

// Function to handle the start button click
function startTest() {
    // Add button click animation
    const button = document.querySelector('.start-button');
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Show confirmation dialog
    const userConfirmed = confirm('Kas oled kindel, et soovid testi alustada?');
    
    if (userConfirmed) {
        // Here you would typically redirect to the test page
        // For now, we'll show an alert
        alert('Test alustatakse...');
        // window.location.href = 'test.html'; // Uncomment when test page is ready
    }
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the link text to determine action
            const linkText = this.textContent.trim();

            switch(linkText) {
                case 'Juhend':
                    window.location.href = '../tutorial/juhend.html';
                    break;
                case 'Kontakt':
                    window.location.href = '../contacts/kontakt.html';
                    break;
                default:
                    console.warn('Tundmatu link:', linkText);
            }
        });
    });

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.nav-link, .start-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Check if test is currently available
    checkTestAvailability();
});


// Function to check if the test is currently available
function checkTestAvailability() {
    // For the demo, we'll keep the test available (matching first picture)
    const button = document.querySelector('.start-button');
    button.disabled = false;
    button.textContent = 'Alusta';
}

// Add loading animation for images
function addImageLoadingEffects() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
}

// Initialize image loading effects when DOM is ready
document.addEventListener('DOMContentLoaded', addImageLoadingEffects);

// Add responsive menu functionality for mobile
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-active');
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('start-button')) {
        startTest();
    }
});

// Console welcome message
console.log('Kringel - Õpilasvõistlus gümmnastidele');
console.log('Website loaded successfully!');
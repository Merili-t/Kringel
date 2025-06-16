//Main application functionality

//Logout function
function logout() {
    if (confirm('Kas olete kindel, et soovite välja logida?')) {
        alert('Välja logitud');
        // Here you would typically redirect to login page
        // window.location.href = '/login';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initializing...');
    
    // Initialize router
    initializeRouter();
    
    // Initialize tests
    initializeTests();
    
    console.log('Application initialized successfully');
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// Utility functions
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('et-EE');
}

function formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('et-EE');
}

// Export functions for potential use in other scripts
window.appUtils = {
    formatDate,
    formatTime,
    logout
};
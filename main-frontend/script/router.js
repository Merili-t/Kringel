// Router functionality
let currentPage = 'testanswers';

// Navigation function
function navigate(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        updateBrowserHistory(page);
    }
}

// Update browser history
function updateBrowserHistory(page) {
    history.pushState({page: page}, '', `#${page}`);
}

// Handle back/forward browser buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        navigateWithoutHistory(event.state.page);
    }
});

// Navigate without updating history (for browser back/forward)
function navigateWithoutHistory(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
    }
}

// Initialize router on page load
function initializeRouter() {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navigateWithoutHistory(hash);
    }
}
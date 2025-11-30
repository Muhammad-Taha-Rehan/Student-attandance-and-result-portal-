// Shared profile synchronization script for all teacher pages
// This script should be included in all teacher pages to sync user profile

(function () {
    // Load user profile from localStorage
    function loadUserProfile() {
        const saved = localStorage.getItem('teacherProfile');
        if (saved) {
            return JSON.parse(saved);
        }

        // Default profile
        return {
            firstName: 'M.Abdullah',
            lastName: '',
            email: 'M.Abdullah@gmail.com',
            phone: '+1 (555) 123-4567',
            role: 'Teacher',
            bio: ''
        };
    }

    // Update header display across all pages
    function updateHeaderDisplay() {
        const profile = loadUserProfile();
        const headerEmail = document.querySelector('.user-email');

        if (headerEmail) {
            headerEmail.textContent = profile.email;
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', updateHeaderDisplay);

    // Listen for storage changes (when profile is updated in settings)
    window.addEventListener('storage', (e) => {
        if (e.key === 'teacherProfile' || e.key === null) {
            updateHeaderDisplay();
        }
    });

    // Also listen for custom event for same-page updates
    window.addEventListener('profileUpdated', updateHeaderDisplay);
})();

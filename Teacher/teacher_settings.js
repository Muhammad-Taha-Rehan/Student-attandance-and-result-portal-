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
        bio: 'Passionate educator with 5 years of experience in computer science.',
        password: 'teacher123' // In real app, this would be hashed
    };
}

// Load notification settings
function loadNotificationSettings() {
    const saved = localStorage.getItem('teacherNotifications');
    if (saved) {
        return JSON.parse(saved);
    }

    return {
        emailNotifications: true,
        pushNotifications: true,
        announcements: true
    };
}

// Load preferences
function loadPreferences() {
    const saved = localStorage.getItem('teacherPreferences');
    if (saved) {
        return JSON.parse(saved);
    }

    return {
        language: 'en',
        timezone: 'UTC-5',
        dateFormat: 'MM/DD/YYYY'
    };
}

let userProfile = loadUserProfile();
let notificationSettings = loadNotificationSettings();
let preferences = loadPreferences();

// Save user profile
function saveUserProfile() {
    localStorage.setItem('teacherProfile', JSON.stringify(userProfile));

    // Broadcast storage event to update other pages
    window.dispatchEvent(new Event('storage'));
}

// Save notification settings
function saveNotificationSettings() {
    localStorage.setItem('teacherNotifications', JSON.stringify(notificationSettings));
}

// Save preferences
function savePreferences() {
    localStorage.setItem('teacherPreferences', JSON.stringify(preferences));
}

// Update header display
function updateHeaderDisplay() {
    const headerEmail = document.getElementById('headerEmail');
    if (headerEmail) {
        const displayName = userProfile.firstName + (userProfile.lastName ? ' ' + userProfile.lastName : '');
        headerEmail.textContent = userProfile.email || displayName;
    }
}

// Initialize form values
function initializeForms() {
    // Profile form
    document.getElementById('firstName').value = userProfile.firstName || '';
    document.getElementById('lastName').value = userProfile.lastName || '';
    document.getElementById('email').value = userProfile.email || '';
    document.getElementById('phone').value = userProfile.phone || '';
    document.getElementById('role').value = userProfile.role || 'Teacher';
    document.getElementById('bio').value = userProfile.bio || '';

    // Notification settings
    document.getElementById('emailNotifications').checked = notificationSettings.emailNotifications;
    document.getElementById('pushNotifications').checked = notificationSettings.pushNotifications;
    document.getElementById('announcements').checked = notificationSettings.announcements;

    // Preferences
    document.getElementById('language').value = preferences.language || 'en';
    document.getElementById('timezone').value = preferences.timezone || 'UTC-5';
    document.getElementById('dateFormat').value = preferences.dateFormat || 'MM/DD/YYYY';

    // Update header
    updateHeaderDisplay();
}

// Tab switching
function switchTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to selected tab and button
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const bio = document.getElementById('bio').value.trim();

    // Validation
    if (!firstName) {
        showToast('First name is required', 'error');
        return;
    }

    if (!email || !validateEmail(email)) {
        showToast('Valid email is required', 'error');
        return;
    }

    // Update profile
    userProfile.firstName = firstName;
    userProfile.lastName = lastName;
    userProfile.email = email;
    userProfile.phone = phone;
    userProfile.bio = bio;

    // Save to localStorage
    saveUserProfile();

    // Update header immediately
    updateHeaderDisplay();

    showToast('Profile updated successfully!', 'success');

    // Log activity
    logActivity('Profile Updated', 'Updated profile information');
}

// Handle security form submission
function handleSecuritySubmit(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('All password fields are required', 'error');
        return;
    }

    if (currentPassword !== userProfile.password) {
        showToast('Current password is incorrect', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    // Update password
    userProfile.password = newPassword;
    saveUserProfile();

    // Clear form
    document.getElementById('securityForm').reset();

    showToast('Password changed successfully!', 'success');

    // Log activity
    logActivity('Password Changed', 'Changed account password');
}

// Handle notifications form submission
function handleNotificationsSubmit(e) {
    e.preventDefault();

    // Update settings
    notificationSettings.emailNotifications = document.getElementById('emailNotifications').checked;
    notificationSettings.pushNotifications = document.getElementById('pushNotifications').checked;
    notificationSettings.announcements = document.getElementById('announcements').checked;

    // Save to localStorage
    saveNotificationSettings();

    showToast('Notification preferences saved!', 'success');

    // Log activity
    logActivity('Preferences Updated', 'Updated notification preferences');
}

// Handle preferences form submission
function handlePreferencesSubmit(e) {
    e.preventDefault();

    // Update preferences
    preferences.language = document.getElementById('language').value;
    preferences.timezone = document.getElementById('timezone').value;
    preferences.dateFormat = document.getElementById('dateFormat').value;

    // Save to localStorage
    savePreferences();

    showToast('Preferences saved successfully!', 'success');

    // Log activity
    logActivity('Preferences Updated', 'Updated general preferences');
}

// Enable 2FA (placeholder)
function enable2FA() {
    showToast('2FA setup will be available soon', 'success');

    // Log activity
    logActivity('2FA Enabled', 'Enabled two-factor authentication');
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Log activity
function logActivity(action, description) {
    const activity = {
        action: action,
        description: description,
        timestamp: new Date().toISOString(),
        teacher: userProfile.email
    };

    let activities = JSON.parse(localStorage.getItem('teacherActivities') || '[]');
    activities.unshift(activity);

    // Keep only last 50 activities
    if (activities.length > 50) {
        activities = activities.slice(0, 50);
    }

    localStorage.setItem('teacherActivities', JSON.stringify(activities));
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Toggle notification dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const notificationWrapper = document.querySelector('.notification-wrapper');
    const dropdown = document.getElementById('notificationDropdown');
    if (notificationWrapper && dropdown && !notificationWrapper.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize forms
    initializeForms();

    // Tab buttons
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // Profile form
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);

    // Security form
    document.getElementById('securityForm').addEventListener('submit', handleSecuritySubmit);

    // Notifications form
    document.getElementById('notificationsForm').addEventListener('submit', handleNotificationsSubmit);

    // Preferences form
    document.getElementById('preferencesForm').addEventListener('submit', handlePreferencesSubmit);

    // Enable 2FA button
    document.getElementById('enable2FABtn').addEventListener('click', enable2FA);

    // Notification icon
    document.getElementById('notificationIcon').addEventListener('click', toggleNotifications);

    // Listen for storage changes to update display when changes are made
    window.addEventListener('storage', () => {
        userProfile = loadUserProfile();
        updateHeaderDisplay();
    });
});

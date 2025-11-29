// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Mobile Responsive - Close sidebar on mobile when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !e.target.closest('.toggle-btn')) {
            sidebar.classList.remove('active');
        }
    }
});

// Tab Switching Logic
const tabItems = document.querySelectorAll('.settings-nav-item');
const tabSections = document.querySelectorAll('.settings-section');

tabItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items and sections
        tabItems.forEach(tab => tab.classList.remove('active'));
        tabSections.forEach(section => section.classList.remove('active'));

        // Add active class to clicked item
        item.classList.add('active');

        // Show corresponding section
        const tabId = item.getAttribute('data-tab');
        const targetSection = document.getElementById(tabId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// Form Submission Handlers (Demo only)
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success animation/notification
        const btn = profileForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        btn.style.background = '#2DD36F';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

const passwordForm = document.getElementById('passwordForm');
if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success animation/notification
        const btn = passwordForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> Password Updated!';
        btn.style.background = '#2DD36F';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            passwordForm.reset();
        }, 2000);
    });
}

// Notifications Form Handler
const notificationsForm = document.getElementById('notificationsForm');
if (notificationsForm) {
    notificationsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = notificationsForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> Preferences Saved!';
        btn.style.background = '#2DD36F';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

// Preferences Form Handler
const preferencesForm = document.getElementById('preferencesForm');
if (preferencesForm) {
    preferencesForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = preferencesForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> Preferences Saved!';
        btn.style.background = '#2DD36F';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

// Input Animation Effects
const inputs = document.querySelectorAll('.form-input, .form-textarea');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
        input.parentElement.style.transition = 'transform 0.3s ease';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

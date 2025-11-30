// ========================================
// Settings Manager with Real-Time Updates
// ========================================

class SettingsManager {
    constructor() {
        this.currentAdmin = null;
        this.init();
    }

    init() {
        this.loadAdminData();
        this.setupTabs();
        this.setupForms();
        this.updateHeader();
    }

    updateHeader() {
        const loginName = localStorage.getItem('currentUserName');
        const loginEmail = localStorage.getItem('currentUserEmail');
        const displayName = loginName || loginEmail || 'Admin';

        const userEl = document.querySelector('.user-name');
        if (userEl) {
            userEl.innerHTML = `${displayName}<br><span class="user-role">Admin</span>`;
        }
    }

    loadAdminData() {
        // Get current admin session
        const session = JSON.parse(localStorage.getItem('adminSession') || '{}');

        // Try to find admin in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let admin = users.find(u => u.email === session.email && u.role === 'Admin');

        // If not found, create from session
        if (!admin && session.email) {
            admin = {
                id: 'admin_' + Date.now(),
                email: session.email,
                firstName: session.email.split('@')[0],
                lastName: '',
                phone: '',
                role: 'Admin',
                bio: '',
                password: session.password || 'admin123'
            };
            users.push(admin);
            localStorage.setItem('users', JSON.stringify(users));
        }

        this.currentAdmin = admin;

        // Load profile data
        if (admin) {
            document.getElementById('firstName').value = admin.firstName || '';
            document.getElementById('lastName').value = admin.lastName || '';
            document.getElementById('email').value = admin.email || '';
            document.getElementById('phone').value = admin.phone || '';
            document.getElementById('role').value = admin.role || 'Admin';
            document.getElementById('bio').value = admin.bio || '';
        }

        // Load preferences
        const prefs = this.loadPreferences();
        if (prefs) {
            document.getElementById('language').value = prefs.language || 'en';
            document.getElementById('timezone').value = prefs.timezone || 'UTC-5';
            document.getElementById('dateFormat').value = prefs.dateFormat || 'MM/DD/YYYY';
            document.getElementById('emailNotif').checked = prefs.emailNotif !== false;
            document.getElementById('pushNotif').checked = prefs.pushNotif !== false;
            document.getElementById('announcementsNotif').checked = prefs.announcementsNotif !== false;
        }
    }

    loadPreferences() {
        const key = `adminPrefs_${this.currentAdmin?.id || 'default'}`;
        return JSON.parse(localStorage.getItem(key) || 'null');
    }

    savePreferences(prefs) {
        const key = `adminPrefs_${this.currentAdmin?.id || 'default'}`;
        localStorage.setItem(key, JSON.stringify(prefs));
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.settings-tab');
        const panels = document.querySelectorAll('.settings-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(`${tabName}-panel`).classList.add('active');
            });
        });
    }

    setupForms() {
        // Profile form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Password form
        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Notifications form
        document.getElementById('notificationsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNotificationPreferences();
        });

        // Preferences form
        document.getElementById('preferencesForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGeneralPreferences();
        });

        // 2FA button
        document.getElementById('enable2FA').addEventListener('click', () => {
            this.showToast('Two-factor authentication will be available in the next update', 'info');
            this.logAudit('Attempted to enable 2FA', 'info');
        });

        // Real-time updates on input change
        ['firstName', 'lastName', 'email', 'phone'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.autoSaveProfile();
                });
            }
        });
    }

    saveProfile() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const bio = document.getElementById('bio').value.trim();

        if (!firstName || !email) {
            this.showToast('First name and email are required', 'error');
            return;
        }

        // Update admin data
        this.currentAdmin.firstName = firstName;
        this.currentAdmin.lastName = lastName;
        this.currentAdmin.email = email;
        this.currentAdmin.phone = phone;
        this.currentAdmin.bio = bio;

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.id === this.currentAdmin.id);
        if (index !== -1) {
            users[index] = this.currentAdmin;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update session
        const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
        session.email = email;
        session.name = `${firstName} ${lastName}`;
        localStorage.setItem('adminSession', JSON.stringify(session));

        // Update header in real-time
        this.updateHeader();

        this.showToast('Profile updated successfully!', 'success');
        this.logAudit(`Updated profile information - ${firstName} ${lastName}`, 'success');
    }

    autoSaveProfile() {
        // Auto-save without notification
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();

        if (firstName && email) {
            this.currentAdmin.firstName = firstName;
            this.currentAdmin.lastName = lastName;
            this.currentAdmin.email = email;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const index = users.findIndex(u => u.id === this.currentAdmin.id);
            if (index !== -1) {
                users[index] = this.currentAdmin;
                localStorage.setItem('users', JSON.stringify(users));
            }

            this.updateHeader();
        }
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showToast('All password fields are required', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showToast('New password must be at least 6 characters', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showToast('New passwords do not match', 'error');
            return;
        }

        // In production, verify current password
        // For demo, just update it
        this.currentAdmin.password = newPassword;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.id === this.currentAdmin.id);
        if (index !== -1) {
            users[index] = this.currentAdmin;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        this.showToast('Password changed successfully!', 'success');
        this.logAudit('Changed account password', 'success');
    }

    saveNotificationPreferences() {
        const prefs = this.loadPreferences() || {};
        prefs.emailNotif = document.getElementById('emailNotif').checked;
        prefs.pushNotif = document.getElementById('pushNotif').checked;
        prefs.announcementsNotif = document.getElementById('announcementsNotif').checked;

        this.savePreferences(prefs);

        this.showToast('Notification preferences saved!', 'success');
        this.logAudit('Updated notification preferences', 'success');
    }

    saveGeneralPreferences() {
        const prefs = this.loadPreferences() || {};
        prefs.language = document.getElementById('language').value;
        prefs.timezone = document.getElementById('timezone').value;
        prefs.dateFormat = document.getElementById('dateFormat').value;

        this.savePreferences(prefs);

        this.showToast('General preferences saved!', 'success');
        this.logAudit('Updated general preferences', 'success');
    }

    showToast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    logAudit(action, type = 'info') {
        // Get admin name for audit log
        const loginName = localStorage.getItem('currentUserName');
        const loginEmail = localStorage.getItem('currentUserEmail');
        const userName = loginName || loginEmail || 'Admin';

        const logs = JSON.parse(localStorage.getItem('auditLogs')) || [];

        const newLog = {
            id: Date.now(),
            action: action,
            user: userName,
            role: 'Admin',
            ip: '192.168.1.' + Math.floor(Math.random() * 255),
            timestamp: new Date().toISOString(),
            type: type
        };

        logs.unshift(newLog);

        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.splice(1000);
        }

        localStorage.setItem('auditLogs', JSON.stringify(logs));
    }
}

// Initialize
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});

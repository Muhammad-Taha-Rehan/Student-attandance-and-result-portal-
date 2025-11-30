// ========================================
// Audit Logs Manager
// ========================================

class AuditLogsManager {
    constructor() {
        this.allLogs = [];
        this.filteredLogs = [];
        this.init();
    }

    init() {
        this.updateHeaderName();
        this.loadLogs();
        this.calculateStats();
        this.renderLogs();
        this.setupEventListeners();
        this.setupSidebar();
    }

    updateHeaderName() {
        const loginName = localStorage.getItem('currentUserName');
        const loginEmail = localStorage.getItem('currentUserEmail');
        const displayName = loginName || loginEmail || 'Admin';

        const userEl = document.querySelector('.user-name');
        if (userEl) {
            userEl.innerHTML = `${displayName}<br><span class="user-role">Admin</span>`;
        }
    }

    loadLogs() {
        let logs = JSON.parse(localStorage.getItem('auditLogs')) || [];

        // If no logs exist, generate some sample logs
        if (logs.length === 0) {
            logs = this.generateSampleLogs();
            localStorage.setItem('auditLogs', JSON.stringify(logs));
        }

        // Sort by date (newest first)
        this.allLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        this.filteredLogs = [...this.allLogs];
    }

    generateSampleLogs() {
        // Get current admin name
        const loginName = localStorage.getItem('currentUserName');
        const loginEmail = localStorage.getItem('currentUserEmail');
        const adminName = loginName || loginEmail || 'Admin';

        const actions = [
            { action: 'Uploaded marks for CS301', type: 'success', role: 'Teacher', user: 'Sarah Johnson', ip: '192.168.1.45' },
            { action: 'Marked attendance for CS201', type: 'success', role: 'Teacher', user: 'Michael Chen', ip: '192.168.1.32' },
            { action: 'Created new user account', type: 'success', role: 'Admin', user: adminName, ip: '192.168.1.10' },
            { action: 'Created new assignment', type: 'success', role: 'Teacher', user: 'Emma Davis', ip: '192.168.1.45' },
            { action: 'Security scan initiated', type: 'info', role: 'System', user: 'System', ip: 'localhost' },
            { action: 'Failed to upload marks', type: 'error', role: 'Teacher', user: 'Michael Chen', ip: '192.168.1.32' },
            { action: 'Accessed student records', type: 'info', role: 'Teacher', user: 'Sarah Johnson', ip: '192.168.1.45' },
            { action: 'Generated monthly report', type: 'success', role: 'Admin', user: adminName, ip: '192.168.1.10' },
            { action: 'Updated course information', type: 'success', role: 'Admin', user: adminName, ip: '192.168.1.10' },
            { action: 'Failed login attempt', type: 'warning', role: 'Student', user: 'Unknown', ip: '192.168.1.99' },
            { action: 'Deleted old records', type: 'warning', role: 'Admin', user: adminName, ip: '192.168.1.10' },
            { action: 'Exported attendance data', type: 'success', role: 'Teacher', user: 'Sarah Johnson', ip: '192.168.1.45' },
            { action: 'Modified user permissions', type: 'info', role: 'Admin', user: adminName, ip: '192.168.1.10' },
            { action: 'Database backup completed', type: 'success', role: 'System', user: 'System', ip: 'localhost' },
            { action: 'Logged in successfully', type: 'success', role: 'Admin', user: adminName, ip: '192.168.1.1' }
        ];

        return actions.map((item, index) => {
            const hoursAgo = Math.floor(Math.random() * 24);
            const minutesAgo = Math.floor(Math.random() * 60);
            const timestamp = new Date();
            timestamp.setHours(timestamp.getHours() - hoursAgo);
            timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

            return {
                id: Date.now() + index,
                action: item.action,
                user: item.user,
                role: item.role,
                ip: item.ip,
                timestamp: timestamp.toISOString(),
                type: item.type
            };
        });
    }

    calculateStats() {
        const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
        const recentLogs = this.allLogs.filter(log => new Date(log.timestamp) > last24Hours);

        const stats = {
            total: recentLogs.length,
            success: recentLogs.filter(l => l.type === 'success').length,
            error: recentLogs.filter(l => l.type === 'error').length,
            warning: recentLogs.filter(l => l.type === 'warning').length,
            info: recentLogs.filter(l => l.type === 'info').length
        };

        const successRate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;

        document.getElementById('totalEvents').textContent = stats.total;
        document.getElementById('successfulEvents').textContent = stats.success;
        document.getElementById('successRate').textContent = `${successRate}% success rate`;
        document.getElementById('errorEvents').textContent = stats.error;
        document.getElementById('warningEvents').textContent = stats.warning;
    }

    renderLogs() {
        const container = document.getElementById('auditLogsList');

        if (this.filteredLogs.length === 0) {
            container.className = 'audit-logs-list empty';
            container.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p>No audit logs found</p>
            `;
            return;
        }

        container.className = 'audit-logs-list';
        container.innerHTML = this.filteredLogs.map(log => {
            const timeString = this.formatTimeAgo(log.timestamp);
            const icon = this.getLogIcon(log.type);

            return `
                <div class="audit-log-item">
                    <div class="log-icon ${log.type}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="log-content">
                        <div class="log-action">${log.action}</div>
                        <div class="log-details">
                            <span class="log-user">
                                ${log.user}
                                <span class="role-badge">${log.role}</span>
                            </span>
                            <span class="log-ip">
                                <i class="fas fa-map-marker-alt"></i>
                                IP: ${log.ip}
                            </span>
                        </div>
                    </div>
                    <span class="log-timestamp">${timeString}</span>
                    <span class="log-status-badge ${log.type}">
                        ${this.capitalizeFirst(log.type)}
                    </span>
                </div>
            `;
        }).join('');
    }

    getLogIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || 'fa-circle';
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');

        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('logsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterLogs();
            });
        }

        // Type filter
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.filterLogs();
            });
        }

        // Role filter
        const roleFilter = document.getElementById('roleFilter');
        if (roleFilter) {
            roleFilter.addEventListener('change', () => {
                this.filterLogs();
            });
        }

        // Export logs button
        const exportBtn = document.getElementById('exportLogsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportLogs();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('adminSession');
                window.location.href = '../login/admin-login.html';
            });
        }
    }

    filterLogs() {
        const searchTerm = document.getElementById('logsSearch').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        const roleFilter = document.getElementById('roleFilter').value;

        this.filteredLogs = this.allLogs.filter(log => {
            const matchesSearch = !searchTerm ||
                log.action.toLowerCase().includes(searchTerm) ||
                log.user.toLowerCase().includes(searchTerm);

            const matchesType = typeFilter === 'all' || log.type === typeFilter;
            const matchesRole = roleFilter === 'all' || log.role === roleFilter;

            return matchesSearch && matchesType && matchesRole;
        });

        this.renderLogs();
    }

    exportLogs() {
        let content = 'AUDIT LOGS EXPORT\n';
        content += '==================\n\n';
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Total Events: ${this.filteredLogs.length}\n\n`;
        content += 'LOG DETAILS\n';
        content += '-----------\n\n';

        this.filteredLogs.forEach((log, index) => {
            content += `${index + 1}. ${log.action}\n`;
            content += `   User: ${log.user} (${log.role})\n`;
            content += `   IP Address: ${log.ip}\n`;
            content += `   Timestamp: ${new Date(log.timestamp).toLocaleString()}\n`;
            content += `   Status: ${this.capitalizeFirst(log.type)}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Audit_Logs_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Audit logs exported successfully!', 'success');
    }

    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebarToggle');
        const mobileToggle = document.getElementById('mobileToggle');

        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-active');
            });
        }
    }

    showToast(message, type = 'success') {
        // Simple toast notification (can be enhanced)
        alert(message);
    }
}

// ========================================
// Utility: Log a new audit event
// ========================================

function logAuditEvent(action, type = 'info', user = null, role = null) {
    // Get current admin name from login
    if (!user) {
        const loginName = localStorage.getItem('currentUserName');
        const loginEmail = localStorage.getItem('currentUserEmail');
        user = loginName || loginEmail || 'Admin';
        role = 'Admin';
    }

    const logs = JSON.parse(localStorage.getItem('auditLogs')) || [];

    const newLog = {
        id: Date.now(),
        action: action,
        user: user,
        role: role,
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

// Initialize
let auditLogsManager;
document.addEventListener('DOMContentLoaded', () => {
    auditLogsManager = new AuditLogsManager();

    // Update last scan time
    const lastScanEl = document.getElementById('lastScanTime');
    if (lastScanEl) {
        lastScanEl.textContent = 'Today at ' +
            new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
});

// Export for use in other scripts
window.logAuditEvent = logAuditEvent;

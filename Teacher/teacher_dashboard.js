document.addEventListener('DOMContentLoaded', function() {
    // Initialize Components
    initChart();
    initNotifications();
    loadUserData();
});

// Initialize Attendance Chart
function initChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Chart Data
    const data = {
        labels: ['CS101', 'CS201', 'CS301', 'CS401'],
        datasets: [{
            label: 'Attendance %',
            data: [92, 85, 78, 88],
            backgroundColor: '#4A7DFF',
            borderRadius: 6,
            barThickness: 40
        }]
    };

    // Chart Configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        family: "'Inter', sans-serif"
                    },
                    bodyFont: {
                        size: 13,
                        family: "'Inter', sans-serif"
                    },
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        color: '#64748b',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        color: '#64748b'
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
}

// Notification Dropdown Logic
function initNotifications() {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const markReadBtn = document.querySelector('.mark-read-btn');
    const badge = document.querySelector('.badge');

    // Toggle Dropdown
    notificationIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationDropdown.contains(e.target) && !notificationIcon.contains(e.target)) {
            notificationDropdown.classList.remove('active');
        }
    });

    // Mark all as read
    markReadBtn.addEventListener('click', () => {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        
        // Remove badge
        if (badge) {
            badge.style.display = 'none';
        }
    });
}

// Load User Data (Simulated)
function loadUserData() {
    // In a real app, this would come from localStorage or an API
    // For now, we keep the static HTML values but this function is ready for expansion
    
    // Example:
    // const user = JSON.parse(localStorage.getItem('currentUser'));
    // if (user) {
    //     document.querySelector('.user-email').textContent = user.email;
    //     document.querySelector('.user-role').textContent = user.role;
    // }
}

// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Chart.js - Attendance Distribution Donut Chart
const ctx = document.getElementById('attendanceChart').getContext('2d');

const attendanceData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [{
        data: [142, 8, 13],
        backgroundColor: ['#2DD36F', '#FF8A47', '#EB445A'],
        borderWidth: 0,
        cutout: '70%'
    }]
};

const attendanceChart = new Chart(ctx, {
    type: 'doughnut',
    data: attendanceData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1A202C',
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    weight: '600'
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: ${value} days`;
                    }
                }
            }
        }
    }
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.stat-card, .card, .course-item, .action-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Progress Bar Animations
const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
};

// Trigger progress bar animation when visible
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const courseSection = document.querySelector('.course-attendance-list');
if (courseSection) {
    progressObserver.observe(courseSection);
}

// Ripple Effect for Cards
function createRipple(event) {
    const card = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    card.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('click', createRipple);
});

// Mobile Responsive - Close sidebar on mobile when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !e.target.closest('.toggle-btn')) {
            sidebar.classList.remove('active');
        }
    }
});

// Stats Counter Animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate stats on load
window.addEventListener('load', () => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((stat, index) => {
        const finalValue = parseInt(stat.textContent);
        stat.textContent = '0';
        setTimeout(() => {
            animateValue(stat, 0, finalValue, 1500);
        }, index * 200);
    });
});

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
document.querySelectorAll('.summary-card, .card, .semester-summary-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Stats Counter Animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Handle float values for CGPA
        if (end % 1 !== 0) {
            const value = (progress * (end - start) + start).toFixed(2);
            element.textContent = value;
        } else {
            const value = Math.floor(progress * (end - start) + start);
            // Handle percentage symbol if present in original text
            element.textContent = element.dataset.isPercent ? value + '%' : value;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate summary values on load
window.addEventListener('load', () => {
    const summaryValues = document.querySelectorAll('.summary-value');
    summaryValues.forEach((stat, index) => {
        const text = stat.textContent;
        const isPercent = text.includes('%');
        const isFraction = text.includes('/');

        if (isFraction) return; // Skip rank animation for now

        const endValue = parseFloat(text);
        stat.dataset.isPercent = isPercent;
        stat.textContent = isPercent ? '0%' : '0';

        setTimeout(() => {
            animateValue(stat, 0, endValue, 1500);
        }, index * 200);
    });

    initCharts();
});

// Initialize Charts
function initCharts() {
    // Course Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: ['Calculus', 'Physics', 'Algorithms', 'Writing', 'Data Structures'],
            datasets: [{
                label: 'Score',
                data: [88, 76, 94, 87, 91],
                backgroundColor: [
                    '#2DD36F',
                    '#2DD36F',
                    '#2DD36F',
                    '#2DD36F',
                    '#2DD36F'
                ],
                borderRadius: 8,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#1A202C',
                    bodyColor: '#718096',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return 'Score: ' + context.raw;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#F7FAFC'
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            }
        }
    });

    // Skills Analysis Chart
    const skillsCtx = document.getElementById('skillsChart').getContext('2d');
    new Chart(skillsCtx, {
        type: 'radar',
        data: {
            labels: ['Theory', 'Practical', 'Projects', 'Exams', 'Assignments'],
            datasets: [{
                label: 'Performance',
                data: [90, 85, 95, 88, 92],
                backgroundColor: 'rgba(74, 125, 255, 0.2)',
                borderColor: '#4A7DFF',
                pointBackgroundColor: '#4A7DFF',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4A7DFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: '#E2E8F0'
                    },
                    grid: {
                        color: '#E2E8F0'
                    },
                    pointLabels: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        color: '#718096'
                    },
                    ticks: {
                        display: false,
                        backdropColor: 'transparent'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Download Transcript
const downloadBtn = document.getElementById('downloadTranscript');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        downloadBtn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        // Generate transcript data
        const transcriptData = [
            ['Course', 'Credits', 'Grade', 'GPA'],
            ['CS101 - Data Structures', '4', 'A+', '10.0'],
            ['MAT201 - Calculus II', '4', 'A', '9.0'],
            ['PHY301 - Quantum Physics', '3', 'B', '7.0'],
            ['CS202 - Algorithms', '4', 'A+', '10.0'],
            ['ENG101 - Technical Writing', '2', 'A', '9.0'],
            [],
            ['Total Credits', '17'],
            ['CGPA', '9.12']
        ];

        // Download CSV
        const csvContent = transcriptData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Academic_Transcript.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
}

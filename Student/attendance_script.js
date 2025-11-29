// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
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
document.querySelectorAll('.summary-card, .course-card, .policy-card').forEach(card => {
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
}, { threshold: 0.3 });

const courseCards = document.querySelectorAll('.course-card');
courseCards.forEach(card => {
    progressObserver.observe(card);
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

// Animate summary values on load
window.addEventListener('load', () => {
    const summaryValues = document.querySelectorAll('.summary-value');
    summaryValues.forEach((stat, index) => {
        const finalValue = parseInt(stat.textContent);
        stat.textContent = '0';
        setTimeout(() => {
            animateValue(stat, 0, finalValue, 1500);
        }, index * 200);
    });
});

// Download Report Button
const downloadBtn = document.querySelector('.download-report-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        downloadBtn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        // Generate attendance report data
        const reportData = generateAttendanceReport();

        // Create and download CSV file
        downloadCSV(reportData, 'Attendance_Report.csv');
    });
}

// Function to generate attendance report data
function generateAttendanceReport() {
    const data = [];

    // Add header
    data.push(['Course', 'Sessions Held', 'Sessions Attended', 'Attendance %', 'Status']);

    // Add course data
    data.push(['CS101 - Data Structures', '30', '28', '93%', 'Good']);
    data.push(['MAT201 - Calculus II', '28', '25', '89%', 'Good']);
    data.push(['PHY301 - Quantum Physics', '32', '24', '75%', 'Average']);

    // Add summary
    data.push([]);
    data.push(['Overall Summary']);
    data.push(['Total Classes', '90']);
    data.push(['Classes Attended', '77']);
    data.push(['Classes Missed', '13']);
    data.push(['Overall Attendance', '85.6%']);

    return data;
}

// Function to download CSV
function downloadCSV(data, filename) {
    // Convert array to CSV string
    const csvContent = data.map(row => row.join(',')).join('\n');

    // Create blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

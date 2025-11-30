document.addEventListener('DOMContentLoaded', function () {
    // Initialize Date
    updateDate();

    // Initialize Notifications
    initNotifications();

    // Mock Data for Students
    const studentsData = {
        'CS101': [
            { id: 1, name: 'Alex Thompson', reg: 'CS21001', lastStatus: 'Present' },
            { id: 2, name: 'Maria Garcia', reg: 'CS21002', lastStatus: 'Present' },
            { id: 3, name: 'James Wilson', reg: 'CS21003', lastStatus: 'Absent' },
            { id: 4, name: 'Sophia Lee', reg: 'CS21004', lastStatus: 'Present' },
            { id: 5, name: 'Daniel Brown', reg: 'CS21005', lastStatus: 'Present' },
            { id: 6, name: 'Emma Davis', reg: 'CS21006', lastStatus: 'Late' },
            { id: 7, name: 'Michael Chen', reg: 'CS21007', lastStatus: 'Present' },
            { id: 8, name: 'Olivia Martinez', reg: 'CS21008', lastStatus: 'Present' }
        ],
        'CS201': [
            { id: 1, name: 'William Taylor', reg: 'CS21009', lastStatus: 'Present' },
            { id: 2, name: 'Ava Anderson', reg: 'CS21010', lastStatus: 'Absent' },
            { id: 3, name: 'Ethan Thomas', reg: 'CS21011', lastStatus: 'Present' }
        ],
        'CS301': [
            { id: 1, name: 'Isabella Jackson', reg: 'CS21012', lastStatus: 'Present' },
            { id: 2, name: 'Mason White', reg: 'CS21013', lastStatus: 'Late' }
        ]
    };

    // DOM Elements
    const courseSelect = document.getElementById('courseSelect');
    const studentList = document.getElementById('studentList');
    const totalStudentsEl = document.getElementById('totalStudents');
    const presentCountEl = document.getElementById('presentCount');
    const absentCountEl = document.getElementById('absentCount');
    const lateCountEl = document.getElementById('lateCount');
    const markAllPresentBtn = document.getElementById('markAllPresent');
    const markAllAbsentBtn = document.getElementById('markAllAbsent');
    const saveBtn = document.getElementById('saveAttendance');

    // Current State
    let currentStudents = [];
    let attendanceState = {}; // { studentId: 'present' | 'absent' | 'late' }

    // Initialize View
    loadCourseData(courseSelect.value);

    // Event Listeners
    courseSelect.addEventListener('change', (e) => {
        loadCourseData(e.target.value);
    });

    markAllPresentBtn.addEventListener('click', () => {
        markAll('present');
    });

    markAllAbsentBtn.addEventListener('click', () => {
        markAll('absent');
    });

    saveBtn.addEventListener('click', () => {
        saveAttendance();
    });

    // Functions
    function updateDate() {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', dateOptions);
    }

    function loadCourseData(courseCode) {
        currentStudents = studentsData[courseCode] || [];
        attendanceState = {};

        // Initialize all as null (not marked) or default to present? 
        // Let's default to 'present' for easier workflow, or null if we want explicit marking.
        // Based on UI "Mark" button, it implies a toggle or unset state.
        // Let's initialize as 'present' visually but maybe handle logic differently.
        // Actually, the UI shows "Mark" buttons which usually toggle.
        // Let's implement a 3-state toggle: Present -> Absent -> Late -> Present

        currentStudents.forEach(student => {
            attendanceState[student.id] = 'present'; // Default to present
        });

        renderStudents();
        updateStats();
    }

    function renderStudents() {
        studentList.innerHTML = '';

        currentStudents.forEach((student, index) => {
            const status = attendanceState[student.id];
            const row = document.createElement('div');
            row.className = 'student-row';

            row.innerHTML = `
                <div class="student-info">
                    <span class="student-id">${index + 1}</span>
                    <div class="student-details">
                        <span class="student-name">${student.name}</span>
                        <span class="student-reg">${student.reg}</span>
                    </div>
                </div>
                <div class="attendance-controls">
                    <span class="last-status">Last: ${student.lastStatus}</span>
                    <div class="status-toggle">
                        <button class="toggle-btn ${status === 'present' ? 'active-present' : ''}" 
                                onclick="setStatus(${student.id}, 'present')">P</button>
                        <button class="toggle-btn ${status === 'absent' ? 'active-absent' : ''}" 
                                onclick="setStatus(${student.id}, 'absent')">A</button>
                        <button class="toggle-btn ${status === 'late' ? 'active-late' : ''}" 
                                onclick="setStatus(${student.id}, 'late')">L</button>
                    </div>
                </div>
            `;

            studentList.appendChild(row);
        });
    }

    // Expose setStatus to global scope for onclick
    window.setStatus = function (id, status) {
        attendanceState[id] = status;
        renderStudents(); // Re-render to update active classes
        updateStats();
    };

    function markAll(status) {
        currentStudents.forEach(student => {
            attendanceState[student.id] = status;
        });
        renderStudents();
        updateStats();
    }

    function updateStats() {
        const total = currentStudents.length;
        let present = 0;
        let absent = 0;
        let late = 0;

        Object.values(attendanceState).forEach(status => {
            if (status === 'present') present++;
            if (status === 'absent') absent++;
            if (status === 'late') late++;
        });

        totalStudentsEl.textContent = total;
        presentCountEl.textContent = present;
        absentCountEl.textContent = absent;
        lateCountEl.textContent = late;
    }

    function saveAttendance() {
        // Here you would typically send data to a server
        // For now, we'll show a success toast/alert

        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Attendance Saved Successfully';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Notification Logic (Reused from dashboard)
    function initNotifications() {
        const notificationIcon = document.getElementById('notificationIcon');
        const notificationDropdown = document.getElementById('notificationDropdown');

        if (notificationIcon && notificationDropdown) {
            notificationIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationDropdown.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!notificationDropdown.contains(e.target) && !notificationIcon.contains(e.target)) {
                    notificationDropdown.classList.remove('active');
                }
            });
        }
    }
});

// Add keyframes for toast animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Load student data from localStorage (synchronized with upload marks page)
function loadStudentsData() {
    const saved = localStorage.getItem('teacherMarks');
    if (saved) {
        return JSON.parse(saved);
    }

    // Default data if nothing saved
    return {
        'CS101': [
            { rollNo: 'CS21001', name: 'Alex Thompson', midterm: 85, assignment: 90, quiz: 88, project: 92, final: 0, attendance: 92 },
            { rollNo: 'CS21002', name: 'Maria Garcia', midterm: 92, assignment: 88, quiz: 95, project: 90, final: 0, attendance: 95 },
            { rollNo: 'CS21003', name: 'James Wilson', midterm: 78, assignment: 82, quiz: 75, project: 80, final: 0, attendance: 78 },
            { rollNo: 'CS21004', name: 'Sophia Lee', midterm: 95, assignment: 93, quiz: 92, project: 96, final: 0, attendance: 98 },
            { rollNo: 'CS21005', name: 'Daniel Brown', midterm: 88, assignment: 85, quiz: 90, project: 87, final: 0, attendance: 88 },
            { rollNo: 'CS21006', name: 'Emma Davis', midterm: 91, assignment: 89, quiz: 87, project: 88, final: 0, attendance: 85 },
            { rollNo: 'CS21007', name: 'Michael Chen', midterm: 82, assignment: 86, quiz: 84, project: 85, final: 0, attendance: 82 },
            { rollNo: 'CS21008', name: 'Olivia Martinez', midterm: 94, assignment: 91, quiz: 93, project: 95, final: 0, attendance: 96 }
        ],
        'CS201': [
            { rollNo: 'CS21001', name: 'Alex Thompson', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0, attendance: 0 },
            { rollNo: 'CS21002', name: 'Maria Garcia', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0, attendance: 0 }
        ],
        'CS301': [
            { rollNo: 'CS21001', name: 'Alex Thompson', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0, attendance: 0 }
        ]
    };
}

let studentsData = loadStudentsData();
let filteredStudents = [];
let currentCourse = '';

// Calculate total marks
function calculateTotal(student) {
    return student.midterm + student.assignment + student.quiz + student.project + student.final;
}

// Calculate grade based on average
function calculateGrade(total) {
    const avg = total / 5;
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
}

// Get grade class for styling
function getGradeClass(grade) {
    if (!grade || grade === '-') return '';
    return `grade-${grade.toLowerCase()}`;
}

// Get attendance badge class
function getAttendanceBadgeClass(attendance) {
    if (attendance >= 90) return 'attendance-excellent';
    if (attendance >= 80) return 'attendance-good';
    if (attendance >= 70) return 'attendance-average';
    return 'attendance-poor';
}

// Update statistics
function updateStats() {
    const allStudents = currentCourse ? studentsData[currentCourse] : Object.values(studentsData).flat();
    const totalStudents = allStudents.length;

    if (totalStudents === 0) {
        document.getElementById('totalStudents').textContent = '0';
        document.getElementById('avgAttendance').textContent = '0%';
        document.getElementById('avgScore').textContent = '0%';
        document.getElementById('passRate').textContent = '0%';
        return;
    }

    // Calculate average attendance
    const totalAttendance = allStudents.reduce((sum, s) => sum + (s.attendance || 0), 0);
    const avgAttendance = (totalAttendance / totalStudents).toFixed(0);

    // Calculate average score
    let totalScore = 0;
    let validScores = 0;
    allStudents.forEach(student => {
        const total = calculateTotal(student);
        if (total > 0) {
            totalScore += (total / 5);
            validScores++;
        }
    });
    const avgScore = validScores > 0 ? (totalScore / validScores).toFixed(0) : 0;

    // Calculate pass rate
    let passedStudents = 0;
    allStudents.forEach(student => {
        const total = calculateTotal(student);
        if (total > 0) {
            const avg = total / 5;
            if (avg >= 60) passedStudents++;
        }
    });
    const passRate = validScores > 0 ? ((passedStudents / validScores) * 100).toFixed(0) : 0;

    // Update DOM
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('avgAttendance').textContent = `${avgAttendance}%`;
    document.getElementById('avgScore').textContent = `${avgScore}%`;
    document.getElementById('passRate').textContent = `${passRate}%`;

    // Add color classes
    document.getElementById('avgAttendance').className = 'stat-value-large stat-percentage ' + (avgAttendance >= 80 ? 'stat-green' : 'stat-orange');
    document.getElementById('avgScore').className = 'stat-value-large stat-percentage ' + (avgScore >= 70 ? 'stat-purple' : 'stat-orange');
    document.getElementById('passRate').className = 'stat-value-large stat-percentage stat-orange';
}

// Render records table
function renderRecordsTable(students = null) {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';

    const dataToRender = students || (currentCourse ? studentsData[currentCourse] : Object.values(studentsData).flat());
    filteredStudents = dataToRender;

    if (dataToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No student records found</td></tr>';
        return;
    }

    dataToRender.forEach((student, index) => {
        const total = calculateTotal(student);
        const grade = total > 0 ? calculateGrade(total) : '-';
        const gradeClass = getGradeClass(grade);
        const attendanceClass = getAttendanceBadgeClass(student.attendance || 0);
        const courseCode = currentCourse || 'CS101';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${student.rollNo}</strong></td>
            <td>${student.name}</td>
            <td><span class="attendance-badge ${attendanceClass}">${student.attendance || 0}%</span></td>
            <td>${student.midterm || '-'}</td>
            <td>${student.assignment || '-'}</td>
            <td>${student.quiz || '-'}</td>
            <td>${student.project || '-'}</td>
            <td><strong>${total > 0 ? total : '-'}</strong></td>
            <td><span class="grade-badge ${gradeClass}">${grade}</span></td>
            <td>
                <button class="action-btn" onclick="viewStudentDetail('${student.rollNo}', '${courseCode}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateStats();
}

// View student detail in modal
function viewStudentDetail(rollNo, course) {
    const student = studentsData[course].find(s => s.rollNo === rollNo);
    if (!student) return;

    const total = calculateTotal(student);
    const grade = total > 0 ? calculateGrade(total) : '-';

    // Populate modal
    document.getElementById('modalStudentName').textContent = student.name;
    document.getElementById('modalRollNo').textContent = student.rollNo;
    document.getElementById('modalCourse').textContent = course;
    document.getElementById('modalAttendance').textContent = `${student.attendance || 0}%`;
    document.getElementById('modalGrade').textContent = grade;

    // Set assessment scores and progress bars
    const assessments = [
        { id: 'Midterm', value: student.midterm || 0 },
        { id: 'Assignment', value: student.assignment || 0 },
        { id: 'Quiz', value: student.quiz || 0 },
        { id: 'Project', value: student.project || 0 },
        { id: 'Final', value: student.final || 0 }
    ];

    assessments.forEach(assessment => {
        document.getElementById(`modal${assessment.id}`).textContent = `${assessment.value}/100`;
        const bar = document.getElementById(`modal${assessment.id}Bar`);
        bar.style.width = `${assessment.value}%`;

        // Color coding
        if (assessment.value >= 90) bar.style.background = 'var(--green)';
        else if (assessment.value >= 80) bar.style.background = 'var(--primary-blue)';
        else if (assessment.value >= 70) bar.style.background = 'var(--orange)';
        else bar.style.background = 'var(--red)';
    });

    // Show modal
    document.getElementById('studentModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('studentModal').classList.remove('show');
}

// Search functionality
function handleSearch(query) {
    query = query.toLowerCase().trim();

    if (!query) {
        renderRecordsTable();
        return;
    }

    const dataToSearch = currentCourse ? studentsData[currentCourse] : Object.values(studentsData).flat();
    const filtered = dataToSearch.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query)
    );

    renderRecordsTable(filtered);
}

// Course filter
function handleCourseFilter(course) {
    currentCourse = course;
    renderRecordsTable();
}

// Export report to CSV
function exportReport() {
    const dataToExport = currentCourse ? studentsData[currentCourse] : Object.values(studentsData).flat();

    if (dataToExport.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    // Create CSV content
    let csv = 'Roll No,Name,Attendance,Midterm,Assignment,Quiz,Project,Final,Total,Grade\n';

    dataToExport.forEach(student => {
        const total = calculateTotal(student);
        const grade = total > 0 ? calculateGrade(total) : '-';

        csv += `${student.rollNo},${student.name},${student.attendance || 0}%,${student.midterm || 0},${student.assignment || 0},${student.quiz || 0},${student.project || 0},${student.final || 0},${total},${grade}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_records_${currentCourse || 'all_courses'}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showToast('Report exported successfully!', 'success');
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
    // Initial render
    renderRecordsTable();

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Course filter
    document.getElementById('courseFilter').addEventListener('change', (e) => {
        handleCourseFilter(e.target.value);
    });

    // Export report button
    document.getElementById('exportReportBtn').addEventListener('click', exportReport);

    // Modal close button
    document.getElementById('closeModal').addEventListener('click', closeModal);

    // Close modal when clicking outside
    document.getElementById('studentModal').addEventListener('click', (e) => {
        if (e.target.id === 'studentModal') {
            closeModal();
        }
    });

    // Notification icon
    document.getElementById('notificationIcon').addEventListener('click', toggleNotifications);

    // Reload data when page gets focus (in case data was updated in upload marks page)
    window.addEventListener('focus', () => {
        studentsData = loadStudentsData();
        renderRecordsTable();
    });
});

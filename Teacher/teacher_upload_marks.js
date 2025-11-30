// Sample student data for CS101
const studentsData = {
    'CS101': [
        { rollNo: 'CS21001', name: 'Alex Thompson', midterm: 85, assignment: 90, quiz: 88, project: 0, final: 0 },
        { rollNo: 'CS21002', name: 'Maria Garcia', midterm: 92, assignment: 88, quiz: 95, project: 0, final: 0 },
        { rollNo: 'CS21003', name: 'James Wilson', midterm: 78, assignment: 82, quiz: 75, project: 0, final: 0 },
        { rollNo: 'CS21004', name: 'Sophia Lee', midterm: 95, assignment: 93, quiz: 92, project: 0, final: 0 },
        { rollNo: 'CS21005', name: 'Daniel Brown', midterm: 88, assignment: 85, quiz: 90, project: 0, final: 0 },
        { rollNo: 'CS21006', name: 'Emma Davis', midterm: 91, assignment: 89, quiz: 87, project: 0, final: 0 },
        { rollNo: 'CS21007', name: 'Michael Chen', midterm: 82, assignment: 86, quiz: 84, project: 0, final: 0 },
        { rollNo: 'CS21008', name: 'Olivia Martinez', midterm: 94, assignment: 91, quiz: 93, project: 0, final: 0 }
    ],
    'CS201': [
        { rollNo: 'CS21001', name: 'Alex Thompson', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0 },
        { rollNo: 'CS21002', name: 'Maria Garcia', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0 },
        { rollNo: 'CS21003', name: 'James Wilson', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0 },
        { rollNo: 'CS21004', name: 'Sophia Lee', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0 }
    ],
    'CS301': [
        { rollNo: 'CS21001', name: 'Alex Thompson', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0 },
        { rollNo: 'CS21002', name: 'Maria Garcia', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0 },
        { rollNo: 'CS21003', name: 'James Wilson', midterm: 0, assignment: 0, quiz: 0, project: 0, final: 0 }
    ]
};

// Initialize page
let currentCourse = '';
let currentAssessment = '';

// Load saved marks from localStorage
function loadMarksFromStorage() {
    const saved = localStorage.getItem('teacherMarks');
    if (saved) {
        const savedMarks = JSON.parse(saved);
        // Merge saved marks with default student data
        for (let course in savedMarks) {
            if (studentsData[course]) {
                studentsData[course] = savedMarks[course];
            }
        }
    }
}

// Save marks to localStorage
function saveMarksToStorage() {
    localStorage.setItem('teacherMarks', JSON.stringify(studentsData));
}

// Calculate grade based on total marks
function calculateGrade(total) {
    if (total >= 90) return 'A';
    if (total >= 80) return 'B';
    if (total >= 70) return 'C';
    if (total >= 60) return 'D';
    return 'F';
}

// Get grade class for styling
function getGradeClass(grade) {
    if (!grade || grade === '-') return '';
    return `grade-${grade.toLowerCase()}`;
}

// Calculate total marks
function calculateTotal(student) {
    return student.midterm + student.assignment + student.quiz + student.project + student.final;
}

// Update stats display
function updateStats() {
    if (!currentCourse) return;

    const students = studentsData[currentCourse];
    const totalStudents = students.length;

    // Count marks entered
    let marksEntered = 0;
    let totalMarks = 0;
    students.forEach(student => {
        Object.keys(student).forEach(key => {
            if (key !== 'rollNo' && key !== 'name') {
                totalMarks++;
                if (student[key] > 0) marksEntered++;
            }
        });
    });

    // Calculate class average
    let totalSum = 0;
    let count = 0;
    students.forEach(student => {
        const total = calculateTotal(student);
        if (total > 0) {
            totalSum += total;
            count++;
        }
    });
    const classAverage = count > 0 ? (totalSum / count / 5).toFixed(1) : 0;

    // Update DOM
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('marksEntered').textContent = marksEntered;
    document.getElementById('totalMarks').textContent = totalMarks;
    document.getElementById('classAverage').textContent = `${classAverage}%`;
}

// Render marks table
function renderMarksTable() {
    const tbody = document.getElementById('marksTableBody');
    tbody.innerHTML = '';

    if (!currentCourse) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Please select a course to view students</td></tr>';
        return;
    }

    const students = studentsData[currentCourse];
    students.forEach((student, index) => {
        const total = calculateTotal(student);
        const grade = total > 0 ? calculateGrade(total / 5) : '-';
        const gradeClass = getGradeClass(grade);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${student.rollNo}</strong></td>
            <td>${student.name}</td>
            <td><input type="number" min="0" max="100" value="${student.midterm || ''}" 
                placeholder="-" data-student="${index}" data-field="midterm" class="mark-input"></td>
            <td><input type="number" min="0" max="100" value="${student.assignment || ''}" 
                placeholder="-" data-student="${index}" data-field="assignment" class="mark-input"></td>
            <td><input type="number" min="0" max="100" value="${student.quiz || ''}" 
                placeholder="-" data-student="${index}" data-field="quiz" class="mark-input"></td>
            <td><input type="number" min="0" max="100" value="${student.project || ''}" 
                placeholder="-" data-student="${index}" data-field="project" class="mark-input"></td>
            <td><input type="number" min="0" max="100" value="${student.final || ''}" 
                placeholder="-" data-student="${index}" data-field="final" class="mark-input"></td>
            <td><strong>${total > 0 ? total : '-'}</strong></td>
            <td><span class="grade-badge ${gradeClass}">${grade}</span></td>
            <td>
                <button class="action-btn" onclick="clearRow(${index})" title="Clear marks">
                    <i class="fas fa-eraser"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to input fields
    document.querySelectorAll('.mark-input').forEach(input => {
        input.addEventListener('input', handleMarkInput);
    });

    updateStats();
}

// Handle mark input changes
function handleMarkInput(e) {
    const studentIndex = parseInt(e.target.dataset.student);
    const field = e.target.dataset.field;
    let value = parseInt(e.target.value) || 0;

    // Validate value
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    e.target.value = value || '';

    // Update student data
    studentsData[currentCourse][studentIndex][field] = value;

    // Save to localStorage
    saveMarksToStorage();

    // Re-render to update totals and grades
    renderMarksTable();
}

// Clear row marks
function clearRow(index) {
    if (confirm('Are you sure you want to clear all marks for this student?')) {
        const student = studentsData[currentCourse][index];
        student.midterm = 0;
        student.assignment = 0;
        student.quiz = 0;
        student.project = 0;
        student.final = 0;
        saveMarksToStorage();
        renderMarksTable();
        showToast('Marks cleared successfully', 'success');
    }
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

// Save and publish marks
function saveAndPublish() {
    if (!currentCourse) {
        showToast('Please select a course first', 'error');
        return;
    }

    // Save to localStorage
    saveMarksToStorage();

    // Log activity
    const activity = {
        action: 'Marks Published',
        course: currentCourse,
        timestamp: new Date().toISOString(),
        teacher: 'M.Abdullah@gmail.com'
    };

    let activities = JSON.parse(localStorage.getItem('teacherActivities') || '[]');
    activities.unshift(activity);
    localStorage.setItem('teacherActivities', JSON.stringify(activities));

    showToast('Marks saved and published successfully!', 'success');
}

// Handle bulk upload
function handleBulkUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!currentCourse) {
        showToast('Please select a course first', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const content = e.target.result;
            const lines = content.split('\n');

            // Skip header row
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(',');
                if (parts.length < 6) continue;

                const rollNo = parts[0].trim();
                const studentIndex = studentsData[currentCourse].findIndex(s => s.rollNo === rollNo);

                if (studentIndex !== -1) {
                    studentsData[currentCourse][studentIndex].midterm = parseInt(parts[2]) || 0;
                    studentsData[currentCourse][studentIndex].assignment = parseInt(parts[3]) || 0;
                    studentsData[currentCourse][studentIndex].quiz = parseInt(parts[4]) || 0;
                    studentsData[currentCourse][studentIndex].project = parseInt(parts[5]) || 0;
                    studentsData[currentCourse][studentIndex].final = parseInt(parts[6]) || 0;
                }
            }

            saveMarksToStorage();
            renderMarksTable();
            showToast('Marks uploaded successfully from file!', 'success');
        } catch (error) {
            showToast('Error reading file. Please check format.', 'error');
        }
    };
    reader.readAsText(file);
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
    // Load saved marks
    loadMarksFromStorage();

    // Course selection
    document.getElementById('courseSelect').addEventListener('change', (e) => {
        currentCourse = e.target.value;
        renderMarksTable();
    });

    // Assessment type selection
    document.getElementById('assessmentType').addEventListener('change', (e) => {
        currentAssessment = e.target.value;
    });

    // Save & Publish button
    document.getElementById('savePublishBtn').addEventListener('click', saveAndPublish);

    // Upload spreadsheet button
    document.getElementById('uploadSpreadsheetBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    // File input change
    document.getElementById('fileInput').addEventListener('change', handleBulkUpload);

    // Notification icon
    document.getElementById('notificationIcon').addEventListener('click', toggleNotifications);

    // Initial render
    renderMarksTable();
});

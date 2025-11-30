document.addEventListener('DOMContentLoaded', function () {
    // Global chart instances to prevent duplicates
    let monthlyTrendsChart = null;
    let departmentChart = null;

    // Mock Data
    const departmentData = [
        { name: 'Computer Science', fullName: 'Computer Science', students: 450, avgGrade: 85, performance: 85 },
        { name: 'Mathematics', fullName: 'Mathematics', students: 320, avgGrade: 82, performance: 82 },
        { name: 'Physics', fullName: 'Physics', students: 280, avgGrade: 79, performance: 79 },
        { name: 'Chemistry', fullName: 'Chemistry', students: 197, avgGrade: 88, performance: 88 },
        { name: 'English', fullName: 'English', students: 210, avgGrade: 90, performance: 90 }
    ];

    // Update User Info from login
    const loginName = localStorage.getItem('currentUserName');
    const loginEmail = localStorage.getItem('currentUserEmail');
    const displayName = loginName || loginEmail || 'Admin';

    const userEl = document.querySelector('.user-name');
    if (userEl) userEl.innerHTML = `${displayName}<br><span class="user-role">Admin</span>`;

    // Initialize Charts
    initMonthlyTrendsChart();
    initDepartmentChart();
    populateDepartmentTable();

    // Monthly Trends Chart
    function initMonthlyTrendsChart() {
        const canvas = document.getElementById('monthlyTrendsChart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (monthlyTrendsChart !== null) {
            monthlyTrendsChart.destroy();
            monthlyTrendsChart = null;
        }

        // Get context and clear canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        monthlyTrendsChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Attendance %',
                        data: [85, 87, 86, 88, 87, 89],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Pass Rate %',
                        data: [88, 89, 87, 90, 89, 91],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#3b82f6',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            },
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Department Performance Chart
    function initDepartmentChart() {
        const canvas = document.getElementById('departmentChart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (departmentChart !== null) {
            departmentChart.destroy();
            departmentChart = null;
        }

        // Get context and clear canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        departmentChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: departmentData.map(d => d.name),
                datasets: [{
                    label: 'Performance Score',
                    data: departmentData.map(d => d.performance),
                    backgroundColor: '#3b82f6',
                    borderRadius: 8,
                    borderWidth: 0
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
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        callbacks: {
                            label: function (context) {
                                return 'Performance: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            },
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#64748b'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Populate Department Table
    function populateDepartmentTable() {
        const tbody = document.getElementById('deptTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        departmentData.forEach(dept => {
            const row = document.createElement('tr');

            // Performance color based on grade
            let perfColor = '#10b981'; // green
            if (dept.performance < 80) perfColor = '#3b82f6'; // blue
            if (dept.performance >= 88) perfColor = '#10b981'; // green

            row.innerHTML = `
                <td><strong>${dept.fullName}</strong></td>
                <td>${dept.students}</td>
                <td><span class="grade-badge">${dept.avgGrade}%</span></td>
                <td>
                    <div class="performance-bar-container">
                        <div class="performance-bar" style="width: ${dept.performance}%; background-color: ${perfColor};"></div>
                    </div>
                </td>
                <td>
                    <button class="icon-btn" onclick="downloadDeptReport('${dept.name}')">
                        <i class="fas fa-download"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
});

// Download Report Functions
function downloadReport(type) {
    let data, filename, sheetName;

    switch (type) {
        case 'attendance':
            data = generateAttendanceData();
            filename = 'Attendance_Report.xlsx';
            sheetName = 'Attendance';
            break;
        case 'academic':
            data = generateAcademicData();
            filename = 'Academic_Performance_Report.xlsx';
            sheetName = 'Academic Performance';
            break;
        case 'course':
            data = generateCourseData();
            filename = 'Course_Statistics_Report.xlsx';
            sheetName = 'Course Statistics';
            break;
        case 'monthly':
            data = generateMonthlyData();
            filename = 'Monthly_Summary_Report.xlsx';
            sheetName = 'Monthly Summary';
            break;
    }

    exportToExcel(data, filename, sheetName);
}

function generateAttendanceData() {
    return [
        ['Course Code', 'Course Name', 'Total Students', 'Present', 'Absent', 'Attendance %'],
        ['CS101', 'Introduction to Programming', 45, 42, 3, '93.3%'],
        ['MATH201', 'Calculus II', 32, 28, 4, '87.5%'],
        ['PHYS101', 'General Physics', 28, 25, 3, '89.3%'],
        ['CHEM101', 'Organic Chemistry', 40, 35, 5, '87.5%'],
        ['CS201', 'Data Structures', 38, 36, 2, '94.7%'],
        ['MATH101', 'Linear Algebra', 35, 30, 5, '85.7%'],
        ['', '', '', '', 'Overall:', '89.7%']
    ];
}

function generateAcademicData() {
    return [
        ['Student ID', 'Student Name', 'Department', 'GPA', 'Credits', 'Status'],
        ['S001', 'Alex Thompson', 'Computer Science', '3.8', '120', 'Excellent'],
        ['S002', 'Maria Garcia', 'Mathematics', '3.6', '115', 'Good'],
        ['S003', 'James Wilson', 'Physics', '3.2', '110', 'Satisfactory'],
        ['S004', 'Sophia Lee', 'Computer Science', '3.9', '125', 'Excellent'],
        ['S005', 'Daniel Brown', 'Chemistry', '3.5', '118', 'Good'],
        ['S006', 'Emily Davis', 'Mathematics', '3.7', '122', 'Good'],
        ['S007', 'Michael Chen', 'Physics', '3.4', '112', 'Good'],
        ['S008', 'Sarah Johnson', 'Chemistry', '3.8', '120', 'Excellent'],
        ['', '', 'Average GPA:', '3.61', '', '']
    ];
}

function generateCourseData() {
    return [
        ['Course Code', 'Course Name', 'Department', 'Enrolled', 'Completed', 'Completion Rate'],
        ['CS101', 'Introduction to Programming', 'Computer Science', 45, 42, '93.3%'],
        ['MATH201', 'Calculus II', 'Mathematics', 32, 30, '93.8%'],
        ['PHYS101', 'General Physics', 'Physics', 28, 26, '92.9%'],
        ['CHEM101', 'Organic Chemistry', 'Chemistry', 40, 38, '95.0%'],
        ['CS201', 'Data Structures', 'Computer Science', 38, 35, '92.1%'],
        ['MATH101', 'Linear Algebra', 'Mathematics', 35, 33, '94.3%'],
        ['PHYS201', 'Quantum Mechanics', 'Physics', 25, 23, '92.0%'],
        ['CHEM201', 'Biochemistry', 'Chemistry', 30, 28, '93.3%'],
        ['', '', '', '', 'Overall:', '93.3%']
    ];
}

function generateMonthlyData() {
    return [
        ['Month', 'Total Students', 'Attendance %', 'Pass Rate %', 'Active Courses', 'New Enrollments'],
        ['January', '1,202', '85%', '88%', '42', '35'],
        ['February', '1,215', '87%', '89%', '42', '28'],
        ['March', '1,228', '86%', '87%', '43', '32'],
        ['April', '1,235', '88%', '90%', '43', '25'],
        ['May', '1,242', '87%', '89%', '42', '18'],
        ['June', '1,247', '89%', '91%', '42', '22'],
        ['', 'Average:', '87%', '89%', '42', '160 Total']
    ];
}

function downloadDeptReport(deptName) {
    const data = [
        ['Department Report: ' + deptName],
        [''],
        ['Metric', 'Value'],
        ['Total Students', '450'],
        ['Average Grade', '85%'],
        ['Pass Rate', '92%'],
        ['Active Courses', '12'],
        ['Faculty Members', '8'],
        [''],
        ['Top Performing Courses'],
        ['Course Code', 'Course Name', 'Avg. Grade'],
        ['CS101', 'Introduction to Programming', '88%'],
        ['CS201', 'Data Structures', '90%'],
        ['CS301', 'Algorithms', '87%']
    ];

    exportToExcel(data, `${deptName}_Department_Report.xlsx`, deptName);
}

function exportDepartmentStats() {
    const data = [
        ['Department', 'Students', 'Avg. Grade', 'Performance Score'],
        ['Computer Science', '450', '85%', '85'],
        ['Mathematics', '320', '82%', '82'],
        ['Physics', '280', '79%', '79'],
        ['Chemistry', '197', '88%', '88'],
        ['English', '210', '90%', '90']
    ];

    exportToExcel(data, 'Department_Statistics.xlsx', 'Department Stats');
}

function downloadChartData(type) {
    let data, filename;

    if (type === 'monthly') {
        data = [
            ['Month', 'Attendance %', 'Pass Rate %'],
            ['January', '85', '88'],
            ['February', '87', '89'],
            ['March', '86', '87'],
            ['April', '88', '90'],
            ['May', '87', '89'],
            ['June', '89', '91']
        ];
        filename = 'Monthly_Trends_Data.xlsx';
    } else {
        data = [
            ['Department', 'Performance Score'],
            ['CS', '85'],
            ['Math', '82'],
            ['Physics', '79'],
            ['Chemistry', '88'],
            ['English', '90']
        ];
        filename = 'Department_Performance_Data.xlsx';
    }

    exportToExcel(data, filename, 'Chart Data');
}

// Excel Export Function using SheetJS
function exportToExcel(data, filename, sheetName) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data array to worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, filename);

    // Show success message
    alert(`Report "${filename}" downloaded successfully!`);
}

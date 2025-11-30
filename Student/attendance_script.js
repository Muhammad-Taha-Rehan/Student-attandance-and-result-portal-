<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Attendance - SARP</title>
    <link rel="stylesheet" href="student_style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body>
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <div class="logo-icon">S</div>
                <span class="logo-text">SARP</span>
            </div>
            <button class="toggle-btn" id="toggleSidebar">
                <i class="fas fa-chevron-left"></i>
            </button>
        </div>

        <nav class="sidebar-nav">
            <a href="Student_dashboard.html" class="nav-item">
                <i class="fas fa-th-large"></i>
                <span>Dashboard</span>
            </a>
            <a href="attendance.html" class="nav-item active">
                <i class="fas fa-calendar-check"></i>
                <span>My Attendance</span>
            </a>
            <a href="results.html" class="nav-item">
                <i class="fas fa-file-alt"></i>
                <span>My Results</span>
            </a>
            <a href="settings.html" class="nav-item">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="../Login/Student_login.html" class="nav-item logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header -->
        <header class="header">
            <div class="search-bar">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search...">
            </div>

            <div class="header-actions">
                <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                    <span class="badge">3</span>
                </div>
                <div class="user-profile">
                    <div class="user-info">
                        <span class="user-email">kghfk@.com</span>
                        <span class="user-role">Student</span>
                    </div>
                    <div class="avatar">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            </div>
        </header>

        <!-- Attendance Content -->
        <div class="dashboard-container">
            <!-- Page Header -->
            <div class="page-header">
                <div class="page-title-section">
                    <h1 class="page-title">My Attendance</h1>
                    <p class="page-subtitle">Track your attendance across all courses</p>
                </div>
                <button class="download-report-btn">
                    <i class="fas fa-download"></i>
                    Download Report
                </button>
            </div>

            <!-- Attendance Summary Cards -->
            <div class="attendance-summary">
                <div class="summary-card blue-border">
                    <div class="summary-header">
                        <span class="summary-label">Total Classes</span>
                        <div class="summary-icon blue">
                            <i class="fas fa-calendar"></i>
                        </div>
                    </div>
                    <div class="summary-value">90</div>
                    <div class="summary-footer">Across all courses</div>
                </div>

                <div class="summary-card green-border">
                    <div class="summary-header">
                        <span class="summary-label">Classes Attended</span>
                        <div class="summary-icon green">
                            <i class="fas fa-chart-line"></i>
                        </div>
                    </div>
                    <div class="summary-value">77</div>
                    <div class="summary-footer">Overall attendance: 85.6%</div>
                </div>

                <div class="summary-card yellow-border">
                    <div class="summary-header">
                        <span class="summary-label">Classes Missed</span>
                        <div class="summary-icon yellow">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <div class="summary-value">13</div>
                    <div class="summary-footer">Needs improvement</div>
                </div>
            </div>

            <!-- Course Attendance Details -->
            <div class="courses-attendance">
                <!-- CS101 -->
                <div class="course-card">
                    <div class="course-header">
                        <div class="course-info-header">
                            <h3 class="course-title">CS101 - Data Structures</h3>
                            <p class="course-stats">28 / 30 classes attended</p>
                        </div>
                        <div class="course-attendance-badge">
                            <span class="attendance-icon"><i class="fas fa-arrow-up"></i></span>
                            <span class="attendance-percentage">93%</span>
                            <span class="attendance-status good">Good</span>
                        </div>
                    </div>
                    <div class="progress-bar-full">
                        <div class="progress-fill green" style="width: 93%"></div>
                    </div>

                    <div class="recent-sessions">
                        <h4 class="sessions-title">Recent Sessions</h4>
                        <div class="session-list">
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Binary Trees</span>
                                    <span class="session-date">Nov 20, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Linked Lists</span>
                                    <span class="session-date">Nov 18, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Arrays & Stacks</span>
                                    <span class="session-date">Nov 15, 2024</span>
                                </div>
                                <span class="session-status absent">Absent</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Hash Tables</span>
                                    <span class="session-date">Nov 13, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Introduction</span>
                                    <span class="session-date">Nov 11, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                        </div>
                        <a href="#" class="view-all-link">View all sessions →</a>
                    </div>
                </div>

                <!-- MAT201 -->
                <div class="course-card">
                    <div class="course-header">
                        <div class="course-info-header">
                            <h3 class="course-title">MAT201 - Calculus II</h3>
                            <p class="course-stats">25 / 28 classes attended</p>
                        </div>
                        <div class="course-attendance-badge">
                            <span class="attendance-icon"><i class="fas fa-arrow-up"></i></span>
                            <span class="attendance-percentage">89%</span>
                            <span class="attendance-status good">Good</span>
                        </div>
                    </div>
                    <div class="progress-bar-full">
                        <div class="progress-fill green" style="width: 89%"></div>
                    </div>

                    <div class="recent-sessions">
                        <h4 class="sessions-title">Recent Sessions</h4>
                        <div class="session-list">
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Integration Techniques</span>
                                    <span class="session-date">Nov 21, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Limits & Continuity</span>
                                    <span class="session-date">Nov 19, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Derivatives</span>
                                    <span class="session-date">Nov 16, 2024</span>
                                </div>
                                <span class="session-status late">Late</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Series & Sequences</span>
                                    <span class="session-date">Nov 14, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Functions Review</span>
                                    <span class="session-date">Nov 12, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                        </div>
                        <a href="#" class="view-all-link">View all sessions →</a>
                    </div>
                </div>

                <!-- PHY301 -->
                <div class="course-card">
                    <div class="course-header">
                        <div class="course-info-header">
                            <h3 class="course-title">PHY301 - Quantum Physics</h3>
                            <p class="course-stats">24 / 32 classes attended</p>
                        </div>
                        <div class="course-attendance-badge">
                            <span class="attendance-icon"><i class="fas fa-chart-line"></i></span>
                            <span class="attendance-percentage">75%</span>
                            <span class="attendance-status average">Average</span>
                        </div>
                    </div>
                    <div class="progress-bar-full">
                        <div class="progress-fill blue" style="width: 75%"></div>
                    </div>

                    <div class="recent-sessions">
                        <h4 class="sessions-title">Recent Sessions</h4>
                        <div class="session-list">
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Wave Functions</span>
                                    <span class="session-date">Nov 22, 2024</span>
                                </div>
                                <span class="session-status absent">Absent</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Schrödinger Equation</span>
                                    <span class="session-date">Nov 20, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Quantum States</span>
                                    <span class="session-date">Nov 17, 2024</span>
                                </div>
                                <span class="session-status absent">Absent</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Atomic Structure</span>
                                    <span class="session-date">Nov 15, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <span class="session-topic">Introduction to Quantum</span>
                                    <span class="session-date">Nov 13, 2024</span>
                                </div>
                                <span class="session-status present">Present</span>
                            </div>
                        </div>
                        <a href="#" class="view-all-link">View all sessions →</a>
                    </div>
                </div>
            </div>

            <!-- Attendance Policy -->
            <div class="policy-card">
                <div class="policy-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="policy-content">
                    <h3 class="policy-title">Attendance Policy</h3>
                    <p class="policy-text">Students must maintain a minimum of <strong>75% attendance</strong> in each
                        course to be eligible for examinations.</p>
                    <p class="policy-warning">Current courses below threshold: <strong>1</strong></p>
                </div>
            </div>
        </div>

        <!-- Help Button -->
        <button class="help-btn">
            <i class="fas fa-question"></i>
        </button>
    </main>

    <script src="attendance_script.js"></script>
</body>

</html>

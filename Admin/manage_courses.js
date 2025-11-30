document.addEventListener('DOMContentLoaded', function () {
    // --- Configuration & State ---
    const courses = [
        {
            code: 'CS101',
            title: 'Introduction to Programming',
            dept: 'CS',
            instructor: 'Dr. Smith',
            students: 45,
            status: 'active'
        },
        {
            code: 'MATH201',
            title: 'Calculus II',
            dept: 'MATH',
            instructor: 'Prof. Johnson',
            students: 32,
            status: 'active'
        },
        {
            code: 'PHYS101',
            title: 'General Physics',
            dept: 'PHYS',
            instructor: 'Dr. Brown',
            students: 28,
            status: 'active'
        },
        {
            code: 'CHEM101',
            title: 'Organic Chemistry',
            dept: 'CHEM',
            instructor: 'Dr. Davis',
            students: 40,
            status: 'inactive'
        }
    ];

    // --- DOM Elements ---
    const coursesGrid = document.getElementById('coursesGrid');
    const searchInput = document.getElementById('searchInput'); // Main header search
    const filterInput = document.getElementById('filterInput'); // Filter section search
    const departmentFilter = document.getElementById('departmentFilter');

    // Modal Elements
    const modal = document.getElementById('addCourseModal');
    const openModalBtn = document.getElementById('openAddCourseModal');
    const closeModalBtn = document.getElementById('closeAddCourseModal');
    const cancelBtn = document.getElementById('cancelAddCourse');
    const saveBtn = document.getElementById('saveCourseBtn');

    // Edit Modal Elements
    const editModal = document.getElementById('editCourseModal');
    const closeEditModalBtn = document.getElementById('closeEditCourseModal');
    const cancelEditBtn = document.getElementById('cancelEditCourse');
    const updateBtn = document.getElementById('updateCourseBtn');
    let currentEditCourse = null;

    // Stats Elements
    const totalCoursesEl = document.getElementById('totalCourses');
    const activeCoursesEl = document.getElementById('activeCourses');
    const enrolledStudentsEl = document.getElementById('enrolledStudents');
    const avgClassSizeEl = document.getElementById('avgClassSize');

    // User Info from login
    const loginName = localStorage.getItem('currentUserName');
    const loginEmail = localStorage.getItem('currentUserEmail');
    const displayName = loginName || loginEmail || 'Admin';

    const userEl = document.querySelector('.user-name');
    if (userEl) userEl.innerHTML = `${displayName}<br><span class="user-role">Admin</span>`;

    // --- Initialization ---
    renderCourses(courses);
    updateStats();
    setupEventListeners();

    // --- Functions ---

    function renderCourses(data) {
        coursesGrid.innerHTML = '';
        data.forEach(course => {
            const card = createCourseCard(course);
            coursesGrid.appendChild(card);
        });
    }

    function createCourseCard(course) {
        const div = document.createElement('div');
        div.className = 'course-card';

        // Determine status color/class
        const statusClass = course.status === 'active' ? 'active' : 'inactive';

        // Map dept to icon/color if needed (using generic for now)
        const iconClass = getDeptIcon(course.dept);
        const iconBg = getDeptColor(course.dept);

        div.innerHTML = `
            <div class="course-header">
                <div class="course-icon" style="background-color: ${iconBg}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="course-code-badge">
                    <span class="course-code">${course.code}</span>
                    <span class="course-status ${statusClass}">${course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span>
                </div>
                <div class="course-actions">
                    <button class="icon-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <h3 class="course-title">${course.title}</h3>
            <div class="course-info">
                <div class="course-info-item">
                    <i class="fas fa-building"></i>
                    <span>${getDeptName(course.dept)}</span>
                </div>
                <div class="course-info-item">
                    <i class="fas fa-user-tie"></i>
                    <span>${course.instructor}</span>
                </div>
                <div class="course-info-item">
                    <i class="fas fa-users"></i>
                    <span>${course.students} Students</span>
                </div>
            </div>
        `;

        // Add edit functionality
        const editBtn = div.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            currentEditCourse = course;
            populateEditForm(course);
            editModal.classList.add('active');
        });

        // Add delete functionality
        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete ${course.code}?`)) {
                const index = courses.indexOf(course);
                if (index > -1) {
                    courses.splice(index, 1);
                    renderCourses(courses);
                    updateStats();
                }
            }
        });

        return div;
    }

    function updateStats() {
        const total = courses.length;
        const active = courses.filter(c => c.status === 'active').length;
        const students = courses.reduce((acc, curr) => acc + curr.students, 0);
        const avg = total > 0 ? Math.round(students / total) : 0;

        totalCoursesEl.textContent = total;
        activeCoursesEl.textContent = active;
        enrolledStudentsEl.textContent = students;
        avgClassSizeEl.textContent = avg;
    }

    function setupEventListeners() {
        // Add Modal toggles
        openModalBtn.addEventListener('click', () => modal.classList.add('active'));
        closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
        cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

        // Edit Modal toggles
        closeEditModalBtn.addEventListener('click', () => editModal.classList.remove('active'));
        cancelEditBtn.addEventListener('click', () => editModal.classList.remove('active'));

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
            if (e.target === editModal) editModal.classList.remove('active');
        });

        // Save new course
        saveBtn.addEventListener('click', () => {
            const newCourse = {
                code: document.getElementById('courseCode').value,
                title: document.getElementById('courseTitle').value,
                dept: document.getElementById('courseDept').value,
                instructor: document.getElementById('courseInstructor').value,
                status: document.getElementById('courseStatus').value,
                students: 0 // Default for new course
            };

            if (newCourse.code && newCourse.title && newCourse.instructor) {
                courses.unshift(newCourse); // Add to beginning
                renderCourses(courses);
                updateStats();
                modal.classList.remove('active');
                clearForm();
            } else {
                alert('Please fill in all required fields');
            }
        });

        // Update existing course
        updateBtn.addEventListener('click', () => {
            if (currentEditCourse) {
                currentEditCourse.code = document.getElementById('editCourseCode').value;
                currentEditCourse.title = document.getElementById('editCourseTitle').value;
                currentEditCourse.dept = document.getElementById('editCourseDept').value;
                currentEditCourse.instructor = document.getElementById('editCourseInstructor').value;
                currentEditCourse.status = document.getElementById('editCourseStatus').value;

                renderCourses(courses);
                updateStats();
                editModal.classList.remove('active');
                currentEditCourse = null;
            }
        });

        // Search and Filter
        const handleFilter = () => {
            const searchText = (filterInput.value || searchInput.value).toLowerCase();
            const deptValue = departmentFilter.value;

            const filtered = courses.filter(course => {
                const matchesSearch = course.title.toLowerCase().includes(searchText) ||
                    course.code.toLowerCase().includes(searchText) ||
                    course.instructor.toLowerCase().includes(searchText);
                const matchesDept = deptValue === 'all' || course.dept === deptValue;

                return matchesSearch && matchesDept;
            });

            renderCourses(filtered);
        };

        searchInput.addEventListener('input', handleFilter);
        filterInput.addEventListener('input', handleFilter);
        departmentFilter.addEventListener('change', handleFilter);
    }

    function populateEditForm(course) {
        document.getElementById('editCourseCode').value = course.code;
        document.getElementById('editCourseTitle').value = course.title;
        document.getElementById('editCourseDept').value = course.dept;
        document.getElementById('editCourseInstructor').value = course.instructor;
        document.getElementById('editCourseStatus').value = course.status;
    }

    // --- Helpers ---
    function clearForm() {
        document.getElementById('courseCode').value = '';
        document.getElementById('courseTitle').value = '';
        document.getElementById('courseInstructor').value = '';
        document.getElementById('courseDept').value = 'CS';
        document.getElementById('courseStatus').value = 'active';
    }

    function getDeptName(code) {
        const depts = {
            'CS': 'Computer Science',
            'MATH': 'Mathematics',
            'PHYS': 'Physics',
            'CHEM': 'Chemistry'
        };
        return depts[code] || code;
    }

    function getDeptIcon(code) {
        // Just some variety
        return 'fas fa-book';
    }

    function getDeptColor(code) {
        const colors = {
            'CS': '#3b82f6',   // Blue
            'MATH': '#10b981', // Green
            'PHYS': '#f59e0b', // Orange
            'CHEM': '#ef4444'  // Red
        };
        return colors[code] || '#64748b';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const searchInput = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');
    const tableBody = document.getElementById('usersTableBody');
    const tableRows = tableBody.getElementsByTagName('tr');
    const addUserBtn = document.querySelector('.btn-add-user');

    // Update User Info from login
    const loginName = localStorage.getItem('currentUserName');
    const loginEmail = localStorage.getItem('currentUserEmail');
    const displayName = loginName || loginEmail || 'Admin';

    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.innerHTML = `${displayName}<br><span class="user-role">Admin</span>`;
    }

    // Modal Elements
    const modal = document.getElementById('addUserModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addUserForm = document.getElementById('addUserForm');

    // Edit Modal Elements
    const editModal = document.getElementById('editUserModal');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditModalBtn = document.getElementById('cancelEditModalBtn');
    const editUserForm = document.getElementById('editUserForm');
    let currentEditRow = null;

    // Add User Button Click - Open Modal
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function () {
            modal.classList.add('active');
        });
    }

    // Close Modal Functions
    function closeModal() {
        modal.classList.remove('active');
        addUserForm.reset();
    }

    function closeEditModal() {
        editModal.classList.remove('active');
        editUserForm.reset();
        currentEditRow = null;
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
    if (cancelEditModalBtn) cancelEditModalBtn.addEventListener('click', closeEditModal);

    // Close on outside click
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Handle Form Submission
    if (addUserForm) {
        addUserForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            const department = document.getElementById('department').value;

            // Create new table row
            const newRow = document.createElement('tr');

            // Determine badge classes
            const roleClass = role.toLowerCase();
            const roleBadgeClass = roleClass === 'admin' ? 'admin' : (roleClass === 'student' ? 'student' : 'teacher');

            newRow.innerHTML = `
                <td>${fullName}</td>
                <td>${email}</td>
                <td><span class="role-badge ${roleBadgeClass}">${role}</span></td>
                <td>${department}</td>
                <td><span class="status-badge active">Active</span></td>
                <td class="action-icons">
                    <button class="icon-btn edit-btn" data-user="${fullName}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-btn" data-user="${fullName}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            // Add to table
            tableBody.insertBefore(newRow, tableBody.firstChild);

            // Re-attach event listeners for new buttons
            setupActionButtons();

            // Close modal
            closeModal();

            // Show success message (optional)
            alert(`User ${fullName} added successfully!`);
        });
    }

    // Handle Edit Form Submission
    if (editUserForm) {
        editUserForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!currentEditRow) return;

            // Get form values
            const fullName = document.getElementById('editFullName').value;
            const email = document.getElementById('editEmail').value;
            const role = document.getElementById('editRole').value;
            const department = document.getElementById('editDepartment').value;

            // Determine badge classes
            const roleClass = role.toLowerCase();
            const roleBadgeClass = roleClass === 'admin' ? 'admin' : (roleClass === 'student' ? 'student' : 'teacher');

            // Update the row
            currentEditRow.cells[0].textContent = fullName;
            currentEditRow.cells[1].textContent = email;
            currentEditRow.cells[2].innerHTML = `<span class="role-badge ${roleBadgeClass}">${role}</span>`;
            currentEditRow.cells[3].textContent = department;

            // Update data attributes
            const editBtn = currentEditRow.querySelector('.edit-btn');
            const deleteBtn = currentEditRow.querySelector('.delete-btn');
            if (editBtn) editBtn.setAttribute('data-user', fullName);
            if (deleteBtn) deleteBtn.setAttribute('data-user', fullName);

            // Close modal
            closeEditModal();

            // Show success message (optional)
            alert(`User ${fullName} updated successfully!`);
        });
    }

    // Edit and Delete Buttons
    setupActionButtons();

    // Search Functionality
    if (searchInput) {
        searchInput.addEventListener('keyup', filterUsers);
    }

    // Role Filter Functionality
    if (roleFilter) {
        roleFilter.addEventListener('change', filterUsers);
    }

    function filterUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRole = roleFilter.value.toLowerCase();

        Array.from(tableRows).forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            const role = row.cells[2].textContent.trim().toLowerCase();

            const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
            const matchesRole = selectedRole === '' || role === selectedRole;

            if (matchesSearch && matchesRole) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function setupActionButtons() {
        // Edit Buttons
        const editBtns = document.querySelectorAll('.edit-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const row = this.closest('tr');
                currentEditRow = row;

                // Populate edit form
                const fullName = row.cells[0].textContent;
                const email = row.cells[1].textContent;
                const role = row.cells[2].textContent.trim();
                const department = row.cells[3].textContent;

                document.getElementById('editFullName').value = fullName;
                document.getElementById('editEmail').value = email;
                document.getElementById('editRole').value = role;
                document.getElementById('editDepartment').value = department;

                // Open edit modal
                editModal.classList.add('active');
            });
        });

        // Delete Buttons
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const userName = this.getAttribute('data-user');
                if (confirm(`Are you sure you want to delete user ${userName}?`)) {
                    const row = this.closest('tr');
                    row.remove();
                    alert(`User ${userName} deleted successfully!`);
                }
            });
        });
    }

    // Sidebar Active State (optional, if we want to ensure it stays highlighted)
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        if (item.getAttribute('href') && currentPath.includes(item.getAttribute('href'))) {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        }
    });
});

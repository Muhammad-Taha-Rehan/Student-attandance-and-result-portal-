const app = document.getElementById('app');

// Data for the portal
const portalData = {
    header: {
        title: 'Student Attendance & Result Portal',
        subtitle: 'Select your role to continue'
    },
    roles: [
        {
            id: 'admin',
            title: 'Admin',
            icon: 'fa-user-shield',
            description: 'Manage users, courses, and system settings',
            buttonText: 'Continue as Admin',
            link: 'Login/admin_login.html'
        },
        {
            id: 'teacher',
            title: 'Teacher',
            icon: 'fa-chalkboard-user',
            description: 'Mark attendance and upload student results',
            buttonText: 'Continue as Teacher',
            link: 'Login/teacher_login.html'
        },
        {
            id: 'student',
            title: 'Student',
            icon: 'fa-user-graduate',
            description: 'View attendance and academic results',
            buttonText: 'Continue as Student',
            link: 'Login/student_login.html'
        }
    ]
};

// Function to create the header
function createHeader(data) {
    const header = document.createElement('header');
    header.className = 'header';

    header.innerHTML = `
        <h1 class="main-title">${data.title}</h1>
        <p class="sub-title">${data.subtitle}</p>
    `;

    return header;
}

// Function to create a single card
function createCard(role) {
    const card = document.createElement('div');
    card.className = 'role-card';
    card.setAttribute('data-role', role.id);

    // Make the whole card clickable or just the button
    // Using window.location.href for the button

    card.innerHTML = `
        <div class="icon-wrapper">
            <i class="fa-solid ${role.icon}"></i>
        </div>
        <h2 class="card-title">${role.title}</h2>
        <p class="card-desc">${role.description}</p>
        <a href="${role.link}" class="card-btn" style="text-decoration: none; display: inline-block;">${role.buttonText}</a>
    `;

    return card;
}

// Function to create the cards container
function createCardsContainer(roles) {
    const container = document.createElement('div');
    container.className = 'cards-container';

    roles.forEach(role => {
        const card = createCard(role);
        container.appendChild(card);
    });

    return container;
}

// Main render function (Role Selection)
function render() {
    app.innerHTML = '';
    app.appendChild(createHeader(portalData.header));
    app.appendChild(createCardsContainer(portalData.roles));
}

// Initialize
document.addEventListener('DOMContentLoaded', render);

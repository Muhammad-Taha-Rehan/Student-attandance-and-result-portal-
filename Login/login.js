function handleFormSubmit(event, role) {
    event.preventDefault();
    const btn = event.target.querySelector('.btn-login');
    const originalText = btn.innerText;

    btn.innerText = 'Signing In...';
    btn.style.opacity = '0.8';

    setTimeout(() => {
        alert(`Successfully logged in as ${role}!`);
        btn.innerText = originalText;
        btn.style.opacity = '1';
        window.location.href = `../${role}/${role}_dashboard.html`;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('input[type="password"]');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle the eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});


const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const forgotPasswordLink = document.getElementById('forgotPassword');
const recoveryForm = document.getElementById('recoveryForm');

// Test credentials for direct login (temporary solution)
const TEST_CREDENTIALS = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'seller@example.com', password: 'seller123', role: 'seller' },
    { email: 'agent@example.com', password: 'agent123', role: 'agent' }
];

// Initialize Bootstrap modal
let passwordRecoveryModal;
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the password recovery modal
    passwordRecoveryModal = new bootstrap.Modal(document.getElementById('passwordRecoveryModal'));
    
    // Check if there are any error messages to display (from server-side validation)
    displayServerErrors();
});

// Handle toggle animation
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Handle forgot password link
forgotPasswordLink.addEventListener('click', (e) => {
    // Prevent default here to allow the modal to handle the event
    // The actual form submission will go to the server
    e.preventDefault();
    passwordRecoveryModal.show();
});

// Client-side form validation for signup
signupForm.addEventListener('submit', function(event) {
    // Get form values
    const firstName = this.querySelector('[name="firstName"]').value.trim();
    const lastName = this.querySelector('[name="lastName"]').value.trim();
    const email = this.querySelector('[name="email"]').value.trim();
    const phone = this.querySelector('[name="phone"]').value.trim();
    const password = this.querySelector('[name="password"]').value;
    const confirmPassword = this.querySelector('[name="confirmPassword"]').value;
    const role = this.querySelector('[name="role"]').value;
    const termsCheck = document.getElementById('termsCheck').checked;

    // Form validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !role) {
        showMessage('error', 'Please fill in all fields', 'signupMessage');
        event.preventDefault();
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match', 'signupMessage');
        event.preventDefault();
        return;
    }
    
    // Check if terms are accepted
    if (!termsCheck) {
        showMessage('error', 'You must agree to the Terms and Conditions', 'signupMessage');
        event.preventDefault();
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showMessage('error', 'Please enter a valid email address', 'signupMessage');
        event.preventDefault();
        return;
    }
    
    // Basic password strength validation
    if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters long', 'signupMessage');
        event.preventDefault();
        return;
    }

    // If everything is valid, the form will be submitted to the server
});

// Client-side form validation for login
loginForm.addEventListener('submit', function(event) {
    // Always prevent default since we're handling the login manually for testing
    event.preventDefault();
    
    const email = this.querySelector('[name="email"]').value.trim();
    const password = this.querySelector('[name="password"]').value;
    const role = this.querySelector('[name="role"]').value;

    // Form validation
    if (!email || !password || !role) {
        showMessage('error', 'Please fill in all fields', 'loginMessage');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showMessage('error', 'Please enter a valid email address', 'loginMessage');
        return;
    }

    // TEMPORARY: Check against test credentials for direct login
    const user = TEST_CREDENTIALS.find(user => 
        user.email === email && 
        user.password === password && 
        user.role === role
    );

    if (user) {
        // Simulate successful login
        showMessage('success', 'Login successful! Redirecting...', 'loginMessage');
        
        // Store user data in session storage
        sessionStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            role: user.role,
            name: user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' User' // e.g., "Admin User"
        }));
        
        // Redirect after a brief delay to show the success message
        setTimeout(() => {
            window.location.href = `../System/index.html`;
        }, 1000);
    } else {
        showMessage('error', 'Invalid email, password, or role', 'loginMessage');
    }
});

// Client-side form validation for password recovery
recoveryForm.addEventListener('submit', function(event) {
    const recoveryEmail = this.querySelector('[name="email"]').value.trim();
    
    if (!recoveryEmail || !isValidEmail(recoveryEmail)) {
        showMessage('error', 'Please enter a valid email address', 'recoveryMessage');
        event.preventDefault();
        return;
    }

    // If everything is valid, the form will be submitted to the server
});

// Helper function to display messages
function showMessage(type, message, elementId) {
    if (elementId) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `alert ${type === 'error' ? 'alert-danger' : 'alert-success'}`;
            messageElement.classList.remove('d-none');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                messageElement.classList.add('d-none');
            }, 5000);
            return;
        }
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to display server-side validation errors if present
function displayServerErrors() {
    // This assumes the server adds parameters to the URL or sets data attributes
    // to communicate validation errors
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('error')) {
        const error = urlParams.get('error');
        showMessage('error', error, 'loginMessage');
    }
    
    if (urlParams.has('signupError')) {
        const error = urlParams.get('signupError');
        showMessage('error', error, 'signupMessage');
        container.classList.add("active"); // Show signup form
    }
    
    if (urlParams.has('success')) {
        const success = urlParams.get('success');
        showMessage('success', success, 'loginMessage');
    }
}

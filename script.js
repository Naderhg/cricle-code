const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signupBtn');
const signinBtn = document.getElementById('signinBtn');

// Handle toggle animation
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Dummy user data for demonstration
const users = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { email: 'seller@example.com', password: 'seller123', role: 'seller', name: 'Seller User' },
    { email: 'agent@example.com', password: 'agent123', role: 'agent', name: 'Agent User' }
];

// Handle sign-up
signupBtn.addEventListener('click', () => {
    const firstName = document.querySelector('.sign-up input[placeholder="First Name"]').value;
    const lastName = document.querySelector('.sign-up input[placeholder="Last Name"]').value;
    const email = document.querySelector('.sign-up input[type="email"]').value;
    const phone = document.querySelector('.sign-up input[type="tel"]').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('roleSelect').value;
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    // Add new user to array (in a real app, this would be sent to a server)
    users.push({
        email,
        password,
        role,
        name: `${firstName} ${lastName}`
    });
    
    alert('Account created successfully! Please sign in.');
    container.classList.remove("active");
});

// Handle sign-in
signinBtn.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRoleSelect').value;
    
    if (!email || !password || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (!user) {
        alert('Invalid credentials or role');
        return;
    }
    
    // Store user info in session storage
    sessionStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        name: user.name,
        role: user.role
    }));
    
    // Redirect to appropriate dashboard based on role
    window.location.href = `${user.role}-dashboard.html`;
});

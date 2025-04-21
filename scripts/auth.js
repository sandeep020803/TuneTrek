document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  if (localStorage.getItem('currentUser') && window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
  }

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const email = document.getElementById('login-email').value;
          const password = document.getElementById('login-password').value;
          
          // Get users from local storage
          const users = JSON.parse(localStorage.getItem('users')) || [];
          
          // Find user
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
              // Store current user in local storage
              localStorage.setItem('currentUser', JSON.stringify(user));
              window.location.href = 'index.html';
          } else {
              document.getElementById('login-error').textContent = 'Invalid email or password';
          }
      });
  }
  
  // Signup Form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const username = document.getElementById('signup-username').value;
          const email = document.getElementById('signup-email').value;
          const password = document.getElementById('signup-password').value;
          const confirmPassword = document.getElementById('confirm-password').value;
          
          // Validate passwords match
          if (password !== confirmPassword) {
              document.getElementById('signup-error').textContent = 'Passwords do not match';
              return;
          }
          
          // Get users from local storage
          const users = JSON.parse(localStorage.getItem('users')) || [];
          
          // Check if email already exists
          if (users.some(u => u.email === email)) {
              document.getElementById('signup-error').textContent = 'Email already registered';
              return;
          }
          
          // Create new user
          const newUser = {
              username,
              email,
              password,
              profilePic: 'assets/images/profile.jpg' // Default profile picture
          };
          
          // Save user
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          // Log in the new user
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          window.location.href = 'index.html';
      });
  }
});
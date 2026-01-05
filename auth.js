// Authentication Logic
const AUTH_STORAGE_KEY = 'archihome_auth';
const USERS_STORAGE_KEY = 'archihome_users';

// Initialize default admin user if not exists
function initDefaultUsers() {
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin = {
      id: Date.now(),
      fullname: 'Admin',
      email: 'admin@archihome.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    users.push(defaultAdmin);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

function getUsers() {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    return auth ? JSON.parse(auth) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'auth/login.html';
}

// Check if user is logged in
function checkAuth() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    if (window.location.pathname.includes('/admin/')) {
      window.location.href = '../auth/login.html';
    }
    return false;
  }
  return true;
}

// Login handler
document.addEventListener('DOMContentLoaded', function() {
  initDefaultUsers();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember')?.checked;

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        
        // Show success message
        alert('Login berhasil!');
        window.location.href = '../admin/index.html';
      } else {
        alert('Email atau password salah!');
      }
    });
  }

  // Register handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const agreeTerms = document.getElementById('agreeTerms').checked;

      if (password !== confirmPassword) {
        alert('Password dan konfirmasi password tidak sama!');
        return;
      }

      if (!agreeTerms) {
        alert('Anda harus menyetujui syarat & ketentuan!');
        return;
      }

      const users = getUsers();
      
      // Check if email already exists
      if (users.find(u => u.email === email)) {
        alert('Email sudah terdaftar!');
        return;
      }

      const newUser = {
        id: Date.now(),
        fullname: fullname,
        email: email,
        password: password, // In production, this should be hashed
        role: 'user',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      alert('Registrasi berhasil! Silakan login.');
      window.location.href = 'login.html';
    });
  }

  // Logout button handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Apakah Anda yakin ingin logout?')) {
        logout();
      }
    });
  }

  // Check authentication for admin pages
  if (window.location.pathname.includes('/admin/')) {
    if (!checkAuth()) {
      return;
    }
    
    // Update user info in admin pages
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userNameElements = document.querySelectorAll('#userName, #sidebarUserName');
      userNameElements.forEach(el => {
        if (el) el.textContent = currentUser.fullname || currentUser.email;
      });
    }
  }
});

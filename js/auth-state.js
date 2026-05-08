/* ==========================================
   js/auth-state.js
   Purpose: Global authentication state management, Dark Mode toggle, 
            and global UI interactions (Mobile Menu, User Dropdown).
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DARK MODE LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 2. AUTHENTICATION LOGIC ---
    const guestLinks = document.querySelectorAll('.guest-only');
    const authLinks = document.querySelectorAll('.auth-required');
    const userAvatar = document.getElementById('userAvatar');
    const avatarDropdown = document.getElementById('avatarDropdown');
    
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    const isLoggedIn = user && user.isLoggedIn;

    if (isLoggedIn) {
        guestLinks.forEach(link => link.classList.add('hidden'));
        authLinks.forEach(link => link.classList.remove('hidden'));
        
        if (avatarDropdown) {
            avatarDropdown.innerHTML = `
                <div class="dropdown-text">Welcome back,<br><strong style="color: var(--text-main); font-size: 1.2rem; display: inline-block; margin-top: 5px;">${user.username}</strong></div>
                <a href="favorites.html" class="dropdown-btn btn-primary" style="margin-bottom: 10px; color: var(--text-on-primary);">❤️ My Favorites</a>
                <button id="logoutBtn" class="dropdown-btn" style="background: var(--error); color: var(--text-on-primary);">Logout</button>
            `;

            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html'; 
            });
        }
    } else {
        guestLinks.forEach(link => link.classList.remove('hidden'));
        authLinks.forEach(link => link.classList.add('hidden'));

        if (avatarDropdown) {
            avatarDropdown.innerHTML = `
                <div class="dropdown-text">Please log in to manage vehicles.</div>
                <a href="log-in.html" class="dropdown-btn btn-primary">Log In</a>
            `;
        }
    }

    // Handle Dropdown visibility
    if (userAvatar && avatarDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation(); 
            avatarDropdown.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!userAvatar.contains(e.target) && !avatarDropdown.contains(e.target)) {
                avatarDropdown.classList.remove('active');
            }
        });
    }

    // --- 3. MOBILE MENU LOGIC ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
});
/* ==========================================
   js/validation.js
   Purpose: Client-side form validation (Regex) and dynamic 
            password strength meter integration.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    // --- 1. STRICT REGEX RULES ---
    const regexRules = {
        fullName: { pattern: /^[a-zA-Z\s]+$/, message: "Only alphabetical letters and spaces." },
        address: { pattern: /^[a-zA-Z0-9\s]+$/, message: "Only alphanumeric characters and spaces." },
        phone: { pattern: /^1[3-9]\d{9}$/, message: "Valid 11-digit China phone number required." },
        email: { pattern: /^[^@]+@[^@]+\.(com|cn)$/, message: "Must contain exactly one '@' and end with '.com' or '.cn'." },
        username: { pattern: /^[a-zA-Z0-9]{6,}$/, message: "At least 6 alphanumeric characters." },
        password: { pattern: /^[a-zA-Z0-9]{6,}$/, message: "At least 6 alphanumeric characters." }
    };

    // --- 2. VALIDATION CONTROLLERS ---
    function validateField(inputElement) {
        const fieldName = inputElement.name;
        const value = inputElement.value.trim();
        const rule = regexRules[fieldName];
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (!rule || !errorElement) return true;

        if (value === "") {
            showError(inputElement, errorElement, "This field cannot be empty.");
            return false;
        }
        if (!rule.pattern.test(value)) {
            showError(inputElement, errorElement, rule.message);
            return false;
        }
        showSuccess(inputElement, errorElement);
        return true;
    }

    function showError(input, errorSpan, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        errorSpan.textContent = message;
    }

    function showSuccess(input, errorSpan) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        errorSpan.textContent = "";
    }

    // Attach dynamic listeners (Validate on blur/input)
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) validateField(input);
        });
        input.addEventListener('blur', () => validateField(input));
    });

    // --- 3. PASSWORD STRENGTH METER ---
    const passInput = document.getElementById('password');
    const bar = document.getElementById('strengthBar');
    const text = document.getElementById('strengthText');

    if (passInput && bar && text) {
        passInput.addEventListener('input', (e) => {
            const val = e.target.value;
            let score = 0;

            if (val.length >= 6) score += 25;
            if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
            if (/[0-9]/.test(val)) score += 25;
            if (/[^A-Za-z0-9]/.test(val)) score += 25;

            bar.style.width = score + '%';
            
            // Visual feedback based on score
            if (score <= 25) {
                bar.style.backgroundColor = 'var(--error)';
                text.textContent = "Strength: Weak";
            } else if (score <= 75) {
                bar.style.backgroundColor = '#f59e0b'; // Amber warning
                text.textContent = "Strength: Medium";
            } else {
                bar.style.backgroundColor = 'var(--success)';
                text.textContent = "Strength: Strong";
            }
        });
    }

    // --- 4. FORM SUBMISSION ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        
        inputs.forEach(input => { 
            if (!validateField(input)) isFormValid = false; 
        });

        if (isFormValid) {
            alert("Success! Account created successfully.");
            window.location.href = 'log-in.html';
        }
    });
});
/* ==========================================
   js/add-car.js
   Purpose: Secure route guarding, drag-and-drop image upload handling,
            and mock form submission.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. STRICT ROUTE GUARD ---
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || !user.isLoggedIn) {
        alert("Access Denied: Authentication required. Redirecting to login page.");
        window.location.href = 'log-in.html';
        return; // Halt further execution
    }

    // --- 2. DRAG & DROP IMAGE UPLOAD ---
    const uploadZone = document.getElementById('uploadZone');
    if (!uploadZone) return;

    const fileInput = document.getElementById('carImage');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const form = document.getElementById('addCarForm');

    // Proxy click to hidden file input
    uploadZone.addEventListener('click', (e) => { 
        if (e.target !== removeImageBtn) fileInput.click(); 
    });

    // Prevent default browser drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        uploadZone.addEventListener(evt, e => { 
            e.preventDefault(); 
            e.stopPropagation(); 
        });
    });

    // Add visual feedback on drag
    ['dragenter', 'dragover'].forEach(evt => {
        uploadZone.addEventListener(evt, () => uploadZone.classList.add('dragover'));
    });

    ['dragleave', 'drop'].forEach(evt => {
        uploadZone.addEventListener(evt, () => uploadZone.classList.remove('dragover'));
    });

    // Process file drop
    uploadZone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    });

    // Process file selection
    fileInput.addEventListener('change', function() { 
        handleFiles(this.files); 
    });

    // File processing and preview rendering
    function handleFiles(files) {
        if (files.length === 0) return;
        const file = files[0];
        
        if (!file.type.startsWith('image/')) { 
            alert('Invalid format. Please upload a valid image file.'); 
            return; 
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result; 
            imagePreview.style.display = 'block';
            uploadPrompt.style.display = 'none'; 
            removeImageBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Remove Image functionality
    removeImageBtn.addEventListener('click', () => {
        fileInput.value = ''; 
        imagePreview.src = ''; 
        imagePreview.style.display = 'none';
        uploadPrompt.style.display = 'block'; 
        removeImageBtn.style.display = 'none';
    });

    // --- 3. FORM SUBMISSION ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (fileInput.files.length === 0) { 
            alert('Action required: Please upload an image before submitting.'); 
            return; 
        }
        
        alert('Success! Advertisement has been posted to the platform.');
        window.location.href = 'search.html';
    });
});
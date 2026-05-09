/* ==========================================
   js/search.js - 数据库对接优化版
   ========================================== */
// 在 DOMContentLoaded 的最顶部：
fetch('api/get_cars.php')
    .then(res => res.json())
    .then(response => {
        if (response.status === 'success') {
            window.carsData = response.data; // 将数据库真实数据赋给全局变量
            simulateFetchAndRender(window.carsData); // 调用原有的渲染函数
        }
    });
    
document.addEventListener('DOMContentLoaded', () => {
    const carGrid = document.getElementById('carGrid');
    const noResults = document.getElementById('noResults');
    const searchForm = document.getElementById('searchForm');
    const resetBtn = document.getElementById('resetBtn');
    const sortSelect = document.getElementById('sortSelect'); 
    
    // 全局变量用于存储从数据库获取的原始数据
    let dbCars = [];

    function renderSkeletons() {
        carGrid.innerHTML = '';
        for(let i = 0; i < 6; i++) {
            carGrid.innerHTML += `
                <div class="car-card" style="padding: 16px;">
                    <div class="skeleton skeleton-img"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-price"></div>
                </div>
            `;
        }
    }

    function renderCars(carsToRender) {
        carGrid.innerHTML = ''; 
        if (!carsToRender || carsToRender.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : null;
        const favKey = user ? `favorites_${user.username}` : null;
        const userFavorites = favKey ? (JSON.parse(localStorage.getItem(favKey)) || []) : [];

        carsToRender.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            const isFav = userFavorites.includes(car.id);

            card.innerHTML = `
                <div class="favorite-btn ${isFav ? 'active' : ''}" data-id="${car.id}">
                    ${isFav ? '❤️' : '🤍'}
                </div>
                <img src="${car.image}" alt="${car.model}" class="car-card-img" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="car-card-content">
                    <h4 class="car-card-title">${car.model}</h4>
                    <div class="car-card-price">¥${parseFloat(car.price).toLocaleString('en-US')}</div>
                    <div class="car-card-specs">
                        <span>🗓️ ${car.year}</span><span>📍 ${car.location}</span>
                    </div>
                </div>
            `;

            // 收藏逻辑
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!user || !user.isLoggedIn) {
                    alert('Please log in first.');
                    window.location.href = 'log-in.html';
                    return;
                }
                let currentFavs = JSON.parse(localStorage.getItem(favKey)) || [];
                const index = currentFavs.indexOf(car.id);
                if (index > -1) {
                    currentFavs.splice(index, 1);
                    favBtn.textContent = '🤍';
                    favBtn.classList.remove('active');
                } else {
                    currentFavs.push(car.id);
                    favBtn.textContent = '❤️';
                    favBtn.classList.add('active');
                }
                localStorage.setItem(favKey, JSON.stringify(currentFavs));
            });

            // 3D 效果
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -10; 
                const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });

            card.addEventListener('click', () => {
                window.location.href = `car-details.html?id=${car.id}`;
            });
            carGrid.appendChild(card);
        });
    }

    // 从数据库获取真实数据
    function fetchAndRender() {
        renderSkeletons();
        fetch('api/get_cars.php')
            .then(res => res.json())
            .then(response => {
                if (response.status === 'success') {
                    dbCars = response.data;
                    setTimeout(() => renderCars(dbCars), 800);
                }
            })
            .catch(err => console.error("Fetch Error:", err));
    }

    function handleSearchAndSort() {
        const sModel = document.getElementById('searchModel').value.toLowerCase().trim();
        const sLocation = document.getElementById('searchLocation').value;
        const minP = parseInt(document.getElementById('minPrice').value) || 0;
        const maxP = parseInt(document.getElementById('maxPrice').value) || Infinity;
        
        let filtered = dbCars.filter(car => 
            car.model.toLowerCase().includes(sModel) &&
            (sLocation === "" || car.location === sLocation) &&
            (car.price >= minP && car.price <= maxP)
        );

        if (sortSelect.value === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        if (sortSelect.value === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        if (sortSelect.value === 'year-desc') filtered.sort((a, b) => b.year - a.year);

        renderCars(filtered);
    }

    if (searchForm) searchForm.addEventListener('submit', (e) => { e.preventDefault(); handleSearchAndSort(); });
    if (sortSelect) sortSelect.addEventListener('change', handleSearchAndSort);
    if (resetBtn) resetBtn.addEventListener('click', () => { 
        searchForm.reset(); 
        sortSelect.value = 'default'; 
        renderCars(dbCars); 
    });

    fetchAndRender();
});
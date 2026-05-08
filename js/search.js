/* ==========================================
   js/search.js
   Purpose: Skeleton loading, 3D hover effects, filtering, sorting, and Wishlist logic.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const carsData = window.mockCars || [];
    const carGrid = document.getElementById('carGrid');
    const noResults = document.getElementById('noResults');
    const searchForm = document.getElementById('searchForm');
    const resetBtn = document.getElementById('resetBtn');
    const sortSelect = document.getElementById('sortSelect'); 
    
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
        if (carsToRender.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        // 获取当前用户，以便读取他的专属收藏夹
        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : null;
        const favKey = user ? `favorites_${user.username}` : null;
        const userFavorites = favKey ? (JSON.parse(localStorage.getItem(favKey)) || []) : [];

        carsToRender.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            
            // 判断是否已收藏
            const isFav = userFavorites.includes(car.id);

            card.innerHTML = `
                <div class="favorite-btn ${isFav ? 'active' : ''}" data-id="${car.id}" title="Add to Wishlist">
                    ${isFav ? '❤️' : '🤍'}
                </div>
                <img src="${car.image}" alt="${car.model}" class="car-card-img">
                <div class="car-card-content">
                    <h4 class="car-card-title">${car.model}</h4>
                    <div class="car-card-price">¥${car.price.toLocaleString('en-US')}</div>
                    <div class="car-card-specs">
                        <span>🗓️ ${car.year}</span><span>📍 ${car.location}</span>
                    </div>
                </div>
            `;

            // 收藏按钮逻辑
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止卡片跳转
                
                if (!user || !user.isLoggedIn) {
                    alert('Access Denied: Please log in to save vehicles to your wishlist.');
                    window.location.href = 'log-in.html';
                    return;
                }

                let currentFavs = JSON.parse(localStorage.getItem(favKey)) || [];
                const index = currentFavs.indexOf(car.id);

                if (index > -1) {
                    currentFavs.splice(index, 1);
                    favBtn.classList.remove('active');
                    favBtn.textContent = '🤍';
                } else {
                    currentFavs.push(car.id);
                    favBtn.classList.add('active');
                    favBtn.textContent = '❤️';
                }
                localStorage.setItem(favKey, JSON.stringify(currentFavs));
            });

            // 3D 物理悬浮效果
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10; 
                const rotateY = ((x - centerX) / centerX) * 10;
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

    function simulateFetchAndRender(data) {
        renderSkeletons();
        setTimeout(() => { renderCars(data); }, 800);
    }

    function handleSearchAndSort() {
        const sModel = document.getElementById('searchModel').value.toLowerCase().trim();
        const sLocation = document.getElementById('searchLocation').value;
        const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
        
        let filtered = carsData.filter(car => 
            car.model.toLowerCase().includes(sModel) &&
            (sLocation === "" || car.location === sLocation) &&
            (car.price >= minPrice && car.price <= maxPrice)
        );

        if (sortSelect) {
            const sortVal = sortSelect.value;
            if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
            if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
            if (sortVal === 'year-desc') filtered.sort((a, b) => b.year - a.year);
        }

        simulateFetchAndRender(filtered);
    }

    if (searchForm) searchForm.addEventListener('submit', (e) => { e.preventDefault(); handleSearchAndSort(); });
    if (sortSelect) sortSelect.addEventListener('change', handleSearchAndSort);
    if (resetBtn) resetBtn.addEventListener('click', () => { searchForm.reset(); if(sortSelect) sortSelect.value = 'default'; simulateFetchAndRender(carsData); });

    simulateFetchAndRender(carsData);
});
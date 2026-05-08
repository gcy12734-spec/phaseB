/* ==========================================
   js/favorites.js
   Purpose: Load and display user-specific favorited cars.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Route Guard (必须登录才能看收藏夹)
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || !user.isLoggedIn) {
        alert("Access Denied: Please log in to view your wishlist.");
        window.location.href = 'log-in.html';
        return;
    }

    const carsData = window.mockCars || [];
    const carGrid = document.getElementById('carGrid');
    const noResults = document.getElementById('noResults');
    const favCount = document.getElementById('favCount');
    
    // 获取当前用户的专属收藏键名
    const favKey = `favorites_${user.username}`;

    function renderFavorites() {
        const userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];
        carGrid.innerHTML = ''; 
        
        // 更新顶部计数器
        if (favCount) {
            favCount.textContent = `${userFavorites.length} items`;
        }

        if (userFavorites.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';

        // 过滤出在收藏夹里的汽车数据
        const favoriteCars = carsData.filter(car => userFavorites.includes(car.id));

        favoriteCars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';

            card.innerHTML = `
                <div class="favorite-btn active" data-id="${car.id}" title="Remove from Wishlist">
                    ❤️
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

            // 取消收藏逻辑 (实时移除)
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                let currentFavs = JSON.parse(localStorage.getItem(favKey)) || [];
                const index = currentFavs.indexOf(car.id);
                if (index > -1) {
                    currentFavs.splice(index, 1);
                    localStorage.setItem(favKey, JSON.stringify(currentFavs));
                    // 重新渲染页面
                    renderFavorites();
                }
            });

            card.addEventListener('click', () => {
                window.location.href = `car-details.html?id=${car.id}`;
            });
            
            carGrid.appendChild(card);
        });
    }

    // 初始化渲染
    renderFavorites();
});
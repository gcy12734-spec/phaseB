/* ==========================================
   js/favorites.js - Database Integrated Version
   Purpose: Fetch real cars from DB and filter by user's favorites.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 路由守卫 (必须登录)
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || !user.isLoggedIn) {
        alert("Access Denied: Please log in to view your wishlist.");
        window.location.href = 'log-in.html';
        return;
    }

    const carGrid = document.getElementById('carGrid');
    const noResults = document.getElementById('noResults');
    const favCount = document.getElementById('favCount');
    const favKey = `favorites_${user.username}`;

    function renderFavorites(carsData) {
        const userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];
        carGrid.innerHTML = ''; 
        
        if (favCount) {
            favCount.textContent = `${userFavorites.length} items`;
        }

        if (userFavorites.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';

        // 过滤出在收藏夹里的汽车数据 (注意 ID 类型的匹配)
        const favoriteCars = carsData.filter(car => userFavorites.includes(parseInt(car.id)) || userFavorites.includes(String(car.id)));

        favoriteCars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';

            card.innerHTML = `
                <div class="favorite-btn active" data-id="${car.id}" title="Remove from Wishlist">
                    ❤️
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

            // 取消收藏逻辑 (实时移除)
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                let currentFavs = JSON.parse(localStorage.getItem(favKey)) || [];
                // 兼容数字和字符串类型的 ID
                const indexStr = currentFavs.indexOf(String(car.id));
                const indexNum = currentFavs.indexOf(parseInt(car.id));
                const index = indexStr > -1 ? indexStr : indexNum;
                
                if (index > -1) {
                    currentFavs.splice(index, 1);
                    localStorage.setItem(favKey, JSON.stringify(currentFavs));
                    renderFavorites(carsData); // 重新渲染页面
                }
            });

            card.addEventListener('click', () => {
                window.location.href = `car-details.html?id=${car.id}`;
            });
            
            carGrid.appendChild(card);
        });
    }

    // 2. 从数据库拉取真实数据，然后渲染收藏夹
    fetch('api/get_cars.php')
        .then(res => res.json())
        .then(response => {
            if (response.status === 'success') {
                renderFavorites(response.data);
            } else {
                carGrid.innerHTML = '<p style="color:red;">Failed to load data from database.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching favorites:', error);
        });
});
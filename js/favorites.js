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
        let userFavorites = JSON.parse(localStorage.getItem(favKey)) || [];
        carGrid.innerHTML = ''; 
        
        // 1. 先过滤出在数据库里真实存在的收藏车辆
        const favoriteCars = carsData.filter(car => 
            userFavorites.includes(parseInt(car.id)) || userFavorites.includes(String(car.id))
        );

        // 2. 【核心修复】数据清理：如果本地存的 ID 数量比真实找到的车多，说明有车在数据库被删了
        if (favoriteCars.length < userFavorites.length) {
            // 更新本地存储，剔除掉那些在数据库中已经不存在的“幽灵 ID”
            userFavorites = favoriteCars.map(car => String(car.id));
            localStorage.setItem(favKey, JSON.stringify(userFavorites));
        }

        // 3. 使用真实的 favoriteCars 数量更新 UI 计数，而不是本地假数据的数量
        if (favCount) {
            favCount.textContent = `${favoriteCars.length} items`;
        }

        // 4. 根据真实车辆数量判断是否显示“空状态”
        if (favoriteCars.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';

        // 5. 渲染卡片
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
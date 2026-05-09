/* ==========================================
   js/car-details.js
   Purpose: Parse URL parameters, fetch corresponding data, 
            handle Wishlist toggling, and "Buy Now" checkout.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('detailsContainer');
    if (!detailsContainer) return;

    // --- 1. Fetch Data ---
    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('id'));
    
    // Get Current User for Wishlist logic
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    const favKey = user ? `favorites_${user.username}` : null;

    // 向后端请求所有车辆数据，并找到对应的 carId
    fetch('api/get_cars.php')
        .then(res => res.json())
        .then(response => {
            if (response.status === 'success') {
                const carsData = response.data;
                const car = carsData.find(c => parseInt(c.id) === carId); // 确保类型匹配
                
                // --- 2. Render View ---
                if (car) {
                    detailsContainer.style.display = 'grid';
                    document.getElementById('detailImage').src = car.image; // PHP 返回了包含 uploads/ 的路径
                    document.getElementById('detailTitle').textContent = car.model;
                    document.getElementById('detailPrice').textContent = `¥${car.price.toLocaleString('en-US')}`;
                    document.getElementById('detailYear').textContent = car.year;
                    document.getElementById('detailColor').textContent = car.color;
                    document.getElementById('detailLocation').textContent = car.location;

                    // --- 3. Initialize Wishlist Button ---
                    const detailFavBtn = document.getElementById('detailFavBtn');
                    let userFavorites = favKey ? (JSON.parse(localStorage.getItem(favKey)) || []) : [];

                    if (detailFavBtn) {
                        const isFav = userFavorites.includes(car.id);
                        if (isFav) {
                            detailFavBtn.classList.add('active');
                            detailFavBtn.textContent = '❤️';
                        }

                        detailFavBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (!user || !user.isLoggedIn) {
                                alert('Access Denied: Please log in to save vehicles to your wishlist.');
                                window.location.href = 'log-in.html';
                                return;
                            }

                            let currentFavs = JSON.parse(localStorage.getItem(favKey)) || [];
                            const index = currentFavs.indexOf(car.id);

                            if (index > -1) {
                                currentFavs.splice(index, 1);
                                detailFavBtn.classList.remove('active');
                                detailFavBtn.textContent = '🤍';
                            } else {
                                currentFavs.push(car.id);
                                detailFavBtn.classList.add('active');
                                detailFavBtn.textContent = '❤️';
                            }
                            localStorage.setItem(favKey, JSON.stringify(currentFavs));
                        });
                    }
                } else {
                    document.getElementById('errorContainer').style.display = 'block';
                }
            } else {
                console.error("Failed to load car details");
            }
        });
    
    // --- 2. Render View ---
    if (car) {
        detailsContainer.style.display = 'grid';
        document.getElementById('detailImage').src = car.image;
        document.getElementById('detailTitle').textContent = car.model;
        document.getElementById('detailPrice').textContent = `¥${car.price.toLocaleString('en-US')}`;
        document.getElementById('detailYear').textContent = car.year;
        document.getElementById('detailColor').textContent = car.color;
        document.getElementById('detailLocation').textContent = car.location;

        // --- 3. Initialize Wishlist Button ---
        const detailFavBtn = document.getElementById('detailFavBtn');
        let userFavorites = favKey ? (JSON.parse(localStorage.getItem(favKey)) || []) : [];

        if (detailFavBtn) {
            // Check if already in favorites
            const isFav = userFavorites.includes(car.id);
            if (isFav) {
                detailFavBtn.classList.add('active');
                detailFavBtn.textContent = '❤️';
            }

            // Click listener for favorite button
            detailFavBtn.addEventListener('click', (e) => {
                e.stopPropagation();

                // Authentication Check
                if (!user || !user.isLoggedIn) {
                    alert('Access Denied: Please log in to save vehicles to your wishlist.');
                    window.location.href = 'log-in.html';
                    return;
                }

                // Toggle logic
                let currentFavs = JSON.parse(localStorage.getItem(favKey)) || [];
                const index = currentFavs.indexOf(car.id);

                if (index > -1) {
                    // Remove from wishlist
                    currentFavs.splice(index, 1);
                    detailFavBtn.classList.remove('active');
                    detailFavBtn.textContent = '🤍';
                } else {
                    // Add to wishlist
                    currentFavs.push(car.id);
                    detailFavBtn.classList.add('active');
                    detailFavBtn.textContent = '❤️';
                }
                
                // Save to LocalStorage
                localStorage.setItem(favKey, JSON.stringify(currentFavs));
            });
        }

    } else {
        document.getElementById('errorContainer').style.display = 'block';
    }

    // --- 4. Purchase Logic ---
    const buyBtn = document.getElementById('buyBtn');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            if (user && user.isLoggedIn) {
                alert(`Success! Checkout process initiated for ${car.model}.`);
            } else {
                alert('Access Denied: Please log in to your account to make a purchase.');
                window.location.href = 'log-in.html';
            }
        });
    }
});
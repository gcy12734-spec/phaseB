/* ==========================================
   js/car-details.js
   Purpose: Parse URL parameters, fetch corresponding data, 
            handle Wishlist toggling, and "Buy Now" checkout.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('detailsContainer');
    if (!detailsContainer) return;

    // --- 1. Get Params & User ---
    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('id'));
    
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    const favKey = user ? `favorites_${user.username}` : null;

    // --- 2. Fetch Data from DB ---
    fetch('api/get_cars.php')
        .then(res => res.json())
        .then(response => {
            if (response.status === 'success') {
                const carsData = response.data;
                const car = carsData.find(c => parseInt(c.id) === carId);
                
                // --- 3. Render View & Attach Listeners ---
                if (car) {
                    detailsContainer.style.display = 'grid';
                    document.getElementById('detailImage').src = car.image;
                    document.getElementById('detailTitle').textContent = car.model;
                    document.getElementById('detailPrice').textContent = `¥${parseFloat(car.price).toLocaleString('en-US')}`;
                    document.getElementById('detailYear').textContent = car.year;
                    document.getElementById('detailColor').textContent = car.color;
                    document.getElementById('detailLocation').textContent = car.location;

                    // Wishlist Button Logic
                    const detailFavBtn = document.getElementById('detailFavBtn');
                    let userFavorites = favKey ? (JSON.parse(localStorage.getItem(favKey)) || []) : [];

                    if (detailFavBtn) {
                        if (userFavorites.includes(car.id) || userFavorites.includes(String(car.id))) {
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
                            const indexStr = currentFavs.indexOf(String(car.id));
                            const indexNum = currentFavs.indexOf(parseInt(car.id));
                            const index = indexStr > -1 ? indexStr : indexNum;

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

                    // Purchase Logic
                    const buyBtn = document.getElementById('buyBtn');
                    if (buyBtn) {
                        buyBtn.addEventListener('click', () => {
                            if (user && user.isLoggedIn) {
                                const confirmPurchase = confirm(`Are you sure you want to purchase the ${car.model} for ¥${parseFloat(car.price).toLocaleString('en-US')}?\n\nClick OK to proceed to checkout.`);
                                
                                if (confirmPurchase) {
                                    buyBtn.textContent = "Processing Order...";
                                    buyBtn.style.backgroundColor = "#64748b";
                                    buyBtn.disabled = true;

                                    setTimeout(() => {
                                        alert(`🎉 Success! Your order for ${car.model} has been placed.\nOur sales representative will contact you shortly.`);
                                        window.location.href = 'index.html';
                                    }, 1500);
                                }
                            } else {
                                alert('Access Denied: Please log in to your account to make a purchase.');
                                window.location.href = 'log-in.html';
                            }
                        });
                    }
                } else {
                    document.getElementById('errorContainer').style.display = 'block';
                }
            } else {
                console.error("Failed to load car details");
            }
        })
        .catch(error => {
            console.error('Error fetching car details:', error);
            document.getElementById('errorContainer').style.display = 'block';
        });
});
// Products Data (simulating MongoDB data)
const products = [
    {
        id: 1,
        name: "Midnight Elegance",
        category: "oriental",
        price: 129.99,
        image: "🌙",
        description: "A captivating oriental fragrance with notes of amber, vanilla, and exotic spices. Perfect for evening wear and special occasions."
    },
    {
        id: 2,
        name: "Rose Garden",
        category: "floral",
        price: 99.99,
        image: "🌹",
        description: "A romantic floral bouquet featuring Bulgarian rose, peony, and white jasmine. Embodies feminine grace and timeless beauty."
    },
    {
        id: 3,
        name: "Ocean Breeze",
        category: "fresh",
        price: 89.99,
        image: "🌊",
        description: "A refreshing aquatic fragrance with marine notes, citrus, and sea salt. Captures the essence of coastal mornings."
    },
    {
        id: 4,
        name: "Sandalwood Dreams",
        category: "woody",
        price: 149.99,
        image: "🌲",
        description: "Rich sandalwood blended with cedar and vetiver. A sophisticated woody fragrance for the modern connoisseur."
    },
    {
        id: 5,
        name: "Golden Sunset",
        category: "oriental",
        price: 159.99,
        image: "🌅",
        description: "Warm oriental blend with saffron, oud, and honey. A luxurious fragrance that commands attention."
    },
    {
        id: 6,
        name: "Spring Awakening",
        category: "floral",
        price: 79.99,
        image: "🌸",
        description: "Light floral composition with cherry blossom, lily of the valley, and green leaves. Fresh and youthful."
    }
];

// Cart functionality
let cart = [];

// Simulated user database
let users = [];
let currentUser = null;

// DOM elements
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const productsGrid = document.getElementById('productsGrid');
const searchToggle = document.getElementById('searchToggle');
const searchSection = document.getElementById('search-section');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loginToggle = document.getElementById('loginToggle');
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
const productModal = document.getElementById('productModal');
const closeProductModal = document.getElementById('closeProductModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    updateCartUI();
});

// Setup event listeners
function setupEventListeners() {
    // Cart functionality
    cartToggle.addEventListener('click', () => toggleCart());
    closeCart.addEventListener('click', () => toggleCart());
    
    // Search functionality
    searchToggle.addEventListener('click', () => toggleSearch());
    searchBtn.addEventListener('click', () => performSearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Auth functionality
    loginToggle.addEventListener('click', () => toggleAuth());
    closeAuth.addEventListener('click', () => toggleAuth());
    
    // Product modal
    closeProductModal.addEventListener('click', () => closeProductDetail());

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts(e.target.dataset.category);
        });
    });

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab + 'Form').classList.add('active');
        });
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('checkoutBtn').addEventListener('click', async function() {
        // Calculate total amount from cart (in INR)
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order on backend
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: total })
        });
        const order = await response.json();

        // Load Razorpay script if not loaded
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            document.body.appendChild(script);
            script.onload = () => openRazorpay(order);
        } else {
            openRazorpay(order);
        }

        function openRazorpay(order) {
            const options = {
                key: "rzp_test_xxxxxxxxxxxx", // Your Razorpay test Key ID
                amount: order.amount,
                currency: order.currency,
                name: "Essenzia", // Changed here
                description: "Perfume Purchase",
                order_id: order.id,
                handler: function (response){
                    alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                },
                prefill: {
                    email: currentUser ? currentUser.email : "",
                },
                theme: {
                    color: "#F37254"
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === authModal) toggleAuth();
        if (e.target === productModal) closeProductDetail();
    });
}

// Load products into grid
function loadProducts(productsToShow = products) {
    productsGrid.innerHTML = '';
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    // Add click event to show product details
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart')) {
            showProductDetail(product);
        }
    });
    
    return card;
}

// Show product detail modal
function showProductDetail(product) {
    const content = document.getElementById('productDetailContent');
    content.innerHTML = `
        <div class="product-detail-image">${product.image}</div>
        <div class="product-detail-info">
            <div class="category">${product.category}</div>
            <h2>${product.name}</h2>
            <div class="price">${product.price}</div>
            <div class="product-description">
                ${product.description}
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id}); closeProductDetail();">
                Add to Cart - ${product.price}
            </button>
        </div>
    `;
    productModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close product detail modal
function closeProductDetail() {
    productModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart items
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">Your cart is empty</div>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="margin: 0 0.5rem;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="qty-btn" onclick="removeFromCart(${item.id})" style="margin-left: 1rem; background: #ff4757; color: white;">×</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Toggle search section
function toggleSearch() {
    const isVisible = searchSection.style.display !== 'none';
    searchSection.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        searchInput.focus();
    }
}

// Perform search
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (query === '') {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    loadProducts(filteredProducts);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div style="text-align: center; padding: 3rem; color: #999; grid-column: 1/-1;">No products found matching your search.</div>';
    }
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        loadProducts();
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        loadProducts(filteredProducts);
    }
}

// Toggle auth modal
function toggleAuth() {
    authModal.classList.toggle('show');
    if (authModal.classList.contains('show')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelectorAll('input[type="email"]')[0].value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    if (users.find(u => u.email === email)) {
        showNotification('User already exists! Please login.', 'error');
        return;
    }

    users.push({ name, email, password });
    currentUser = { name, email };
    showNotification('Account created successfully!');
    toggleAuth();
    updateUserUI();
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showNotification('User not found! Please signup first.', 'error');
        return;
    }

    currentUser = { name: user.name, email: user.email };
    showNotification('Login successful!');
    toggleAuth();
    updateUserUI();
}

// Add logout feature
function logoutUser() {
    currentUser = null;
    showNotification('Logged out successfully!');
    updateUserUI();
}

// Update user UI (add logout button if logged in)
function updateUserUI() {
    if (currentUser) {
        const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '';
        loginToggle.innerHTML = `
            <span style="font-weight:bold;font-size:1.2rem;">${initial}</span>
            <button id="logoutBtn" style="margin-left:8px;padding:2px 8px;font-size:0.9rem;border:none;background:var(--primary-gold);color:white;border-radius:4px;cursor:pointer;">Logout</button>
        `;
        loginToggle.title = `Logged in as ${currentUser.name}`;
        // Add event listener for logout
        document.getElementById('logoutBtn').addEventListener('click', logoutUser);
    } else {
        loginToggle.innerHTML = '<i class="fas fa-user"></i>';
        loginToggle.title = 'Login';
    }
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to checkout', 'error');
        toggleCart();
        setTimeout(() => toggleAuth(), 500);
        return;
    }
    
    // Simulate payment processing
    const checkoutBtn = document.getElementById('checkoutBtn');
    const originalText = checkoutBtn.textContent;
    checkoutBtn.innerHTML = '<span class="loading"></span> Processing...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Order placed successfully! Thank you for your purchase.');
        cart = [];
        updateCartUI();
        toggleCart();
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }, 2000);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : '#2ed573'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile sidebar functionality
const mobileToggle = document.getElementById('mobileToggle');
const mobileSidebar = document.getElementById('mobileSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const mobileSearchToggle = document.getElementById('mobileSearchToggle');
const mobileLoginToggle = document.getElementById('mobileLoginToggle');
const mobileCartToggle = document.getElementById('mobileCartToggle');
const mobileCartCount = document.getElementById('mobileCartCount');

// Toggle mobile sidebar
function toggleMobileSidebar() {
    mobileSidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    
    if (mobileSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile sidebar
function closeMobileSidebar() {
    mobileSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners for mobile sidebar
mobileToggle.addEventListener('click', toggleMobileSidebar);
sidebarClose.addEventListener('click', closeMobileSidebar);
sidebarOverlay.addEventListener('click', closeMobileSidebar);

// Mobile navigation links
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileSidebar();
    });
});

// Mobile icons functionality
mobileSearchToggle.addEventListener('click', () => {
    closeMobileSidebar();
    toggleSearch();
});

mobileLoginToggle.addEventListener('click', () => {
    closeMobileSidebar();
    toggleAuth();
});

mobileCartToggle.addEventListener('click', () => {
    closeMobileSidebar();
    toggleCart();
});

// Update mobile cart count
function updateMobileCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    mobileCartCount.textContent = totalItems;
    mobileCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Enhanced keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (mobileSidebar.classList.contains('open')) {
            closeMobileSidebar();
        }
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
        if (authModal.classList.contains('show')) {
            toggleAuth();
        }
        if (productModal.classList.contains('show')) {
            closeProductDetail();
        }
    }
});

// Update cart UI to include mobile cart count
const originalUpdateCartUI = updateCartUI;
updateCartUI = function() {
    originalUpdateCartUI();
    updateMobileCartUI();
};

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (cartSidebar.classList.contains('open')) toggleCart();
        if (authModal.classList.contains('show')) toggleAuth();
        if (productModal.classList.contains('show')) closeProductDetail();
    }
});
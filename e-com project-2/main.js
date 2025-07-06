const preloader = document.getElementById('preloader');
// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Hide preloader
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);

    // Initialize theme
    initializeTheme();

    // Initialize animations
    initializeAnimations();

    // Initialize skill bars
    initializeSkillBars();
});

// Main JavaScript functionality for GameVault

// Global variables
let currentTheme = localStorage.getItem('theme') || 'dark';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "Razer DeathAdder V3 Pro Gaming Mouse",
        category: "gaming-gear",
        brand: "razer",
        price: 149.99,
        originalPrice: 179.99,
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.5,
        reviews: 1234,
        badges: ["new", "bestseller"],
        description: "Experience ultimate precision with the Focus Pro 30K sensor and 90-hour battery life.",
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Corsair K95 RGB Platinum Gaming Keyboard",
        category: "gaming-gear",
        brand: "corsair",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.7,
        reviews: 892,
        badges: ["sale"],
        description: "Mechanical gaming keyboard with Cherry MX switches and dynamic RGB lighting.",
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "SteelSeries Arctis 7P Wireless Gaming Headset",
        category: "gaming-gear",
        brand: "steelseries",
        price: 159.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.3,
        reviews: 567,
        badges: ["new"],
        description: "Lossless 2.4GHz wireless gaming headset with 24-hour battery life.",
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Gaming Legend T-Shirt",
        category: "apparel",
        brand: "gamevault",
        price: 29.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.2,
        reviews: 234,
        badges: [],
        description: "Premium cotton gaming t-shirt with retro-inspired design.",
        inStock: true,
        featured: true
    },
    {
        id: 5,
        name: "RGB Gaming Mouse Pad",
        category: "accessories",
        brand: "razer",
        price: 49.99,
        originalPrice: 59.99,
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.4,
        reviews: 445,
        badges: ["sale"],
        description: "Large RGB mouse pad with customizable lighting effects.",
        inStock: true,
        featured: true
    },
    {
        id: 6,
        name: "Master Chief Collectible Figure",
        category: "collectibles",
        brand: "microsoft",
        price: 89.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
        reviews: 156,
        badges: ["bestseller"],
        description: "Highly detailed Master Chief figure from Halo series.",
        inStock: true,
        featured: true
    },
    {
        id: 7,
        name: "Logitech G Pro X Superlight",
        category: "gaming-gear",
        brand: "logitech",
        price: 149.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.6,
        reviews: 789,
        badges: ["new"],
        description: "Ultra-lightweight wireless gaming mouse for esports professionals.",
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: "HyperX Cloud II Gaming Headset",
        category: "gaming-gear",
        brand: "hyperx",
        price: 99.99,
        originalPrice: 129.99,
        image: "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.4,
        reviews: 1567,
        badges: ["sale"],
        description: "7.1 virtual surround sound gaming headset with memory foam.",
        inStock: true,
        featured: false
    },
    {
        id: 9,
        name: "ASUS ROG Swift Gaming Monitor",
        category: "gaming-gear",
        brand: "asus",
        price: 599.99,
        originalPrice: 699.99,
        image: "https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.7,
        reviews: 234,
        badges: ["sale"],
        description: "27-inch 1440p 165Hz gaming monitor with G-Sync technology.",
        inStock: true,
        featured: false
    },
    {
        id: 10,
        name: "Gaming Hoodie - Neon Edition",
        category: "apparel",
        brand: "gamevault",
        price: 59.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.3,
        reviews: 123,
        badges: ["new"],
        description: "Comfortable gaming hoodie with glow-in-the-dark print.",
        inStock: true,
        featured: false
    },
    {
        id: 11,
        name: "Gaming Chair Pro",
        category: "accessories",
        brand: "secretlab",
        price: 399.99,
        originalPrice: 449.99,
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
        reviews: 567,
        badges: ["bestseller"],
        description: "Ergonomic gaming chair with lumbar support and premium materials.",
        inStock: true,
        featured: false
    },
    {
        id: 12,
        name: "Cyberpunk 2077 Poster Set",
        category: "collectibles",
        brand: "cdprojekt",
        price: 24.99,
        originalPrice: null,
        image: "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.1,
        reviews: 89,
        badges: [],
        description: "Set of 3 high-quality Cyberpunk 2077 art prints.",
        inStock: true,
        featured: false
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeSearch();
    loadFeaturedProducts();
    updateCartCount();
    updateWishlistCount();
    initializeNewsletterForm();
    initializeScrollEffects();
    initializeLazyLoading();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        updateThemeIcon();
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('svg');
    if (currentTheme === 'dark') {
        icon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    } else {
        icon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;
    }
}

// Navigation
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
    
    // Sticky header effect
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(26, 26, 26, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--bg-card)';
                header.style.backdropFilter = 'blur(10px)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Search suggestions (basic implementation)
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                // In a real app, this would show search suggestions
                console.log('Searching for:', query);
            }
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // Redirect to products page with search query
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Product Management
function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;
    
    const featuredProducts = sampleProducts.filter(product => product.featured);
    
    featuredGrid.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners to product cards
    addProductCardListeners();
}

function createProductCard(product) {
    const discountPercentage = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    
    const badges = product.badges.map(badge => {
        const badgeClass = badge === 'new' ? 'badge-new' : 
                          badge === 'sale' ? 'badge-sale' : 
                          badge === 'bestseller' ? 'badge-bestseller' : '';
        return `<span class="${badgeClass}">${badge}</span>`;
    }).join('');
    
    const originalPriceHTML = product.originalPrice 
        ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>
           <span class="discount-badge">${discountPercentage}% OFF</span>`
        : '';
    
    const stars = Array.from({length: 5}, (_, i) => 
        `<span class="star ${i < Math.floor(product.rating) ? 'filled' : ''}">★</span>`
    ).join('');
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-badge">
                    ${badges}
                </div>
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <button class="action-btn quick-view-btn" data-product-id="${product.id}" title="Quick View">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.replace('-', ' ')}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-text">(${product.rating}) ${product.reviews} reviews</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${originalPriceHTML}
                </div>
                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="8" cy="21" r="1"></circle>
                        <circle cx="19" cy="21" r="1"></circle>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function addProductCardListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            addToCart(productId);
        });
    });
    
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            toggleWishlist(productId);
        });
    });
    
    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            showQuickView(productId);
        });
    });
    
    // Product card clicks (navigate to product page)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons
            if (e.target.closest('button')) return;
            
            const productId = this.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

// Cart Management
function addToCart(productId, quantity = 1) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Add animation to cart icon
    const cartLink = document.querySelector('.cart-link');
    if (cartLink) {
        cartLink.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cartLink.style.transform = 'scale(1)';
        }, 200);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        updateCartCount();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Show/hide cart count badge
        if (totalItems > 0) {
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Wishlist Management
function toggleWishlist(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification(`${product.name} removed from wishlist!`, 'info');
    } else {
        wishlist.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image
        });
        showNotification(`${product.name} added to wishlist!`, 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    updateWishlistButtons();
}

function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        
        if (wishlist.length > 0) {
            wishlistCount.style.display = 'block';
        } else {
            wishlistCount.style.display = 'none';
        }
    }
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        const productId = parseInt(button.dataset.productId);
        const isInWishlist = wishlist.some(item => item.id === productId);
        
        if (isInWishlist) {
            button.style.color = 'var(--secondary-color)';
            button.querySelector('svg').style.fill = 'var(--secondary-color)';
        } else {
            button.style.color = '';
            button.querySelector('svg').style.fill = 'none';
        }
    });
}

// Quick View Modal
function showQuickView(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="quickViewModal">
            <div class="modal-content">
                <button class="modal-close" id="closeQuickView">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="quick-view-info">
                        <h2>${product.name}</h2>
                        <div class="product-rating">
                            <div class="stars">
                                ${Array.from({length: 5}, (_, i) => 
                                    `<span class="star ${i < Math.floor(product.rating) ? 'filled' : ''}">★</span>`
                                ).join('')}
                            </div>
                            <span class="rating-text">(${product.rating}) ${product.reviews} reviews</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <p class="product-description">${product.description}</p>
                        <div class="quick-view-actions">
                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                                Add to Cart
                            </button>
                            <a href="product.html?id=${product.id}" class="btn btn-secondary">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.getElementById('closeQuickView');
    const addToCartBtn = modal.querySelector('.add-to-cart');
    
    closeBtn.addEventListener('click', closeQuickView);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeQuickView();
    });
    
    addToCartBtn.addEventListener('click', function() {
        addToCart(productId);
        closeQuickView();
    });
    
    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Newsletter Form
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simulate newsletter subscription
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-card);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: var(--z-tooltip);
                transform: translateX(100%);
                transition: transform var(--transition-normal);
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid var(--success-color);
            }
            
            .notification-error {
                border-left: 4px solid var(--error-color);
            }
            
            .notification-info {
                border-left: 4px solid var(--accent-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--spacing-md);
                gap: var(--spacing-md);
            }
            
            .notification-message {
                color: var(--text-primary);
                font-size: 0.875rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: var(--spacing-xs);
                border-radius: var(--radius-sm);
                transition: all var(--transition-fast);
            }
            
            .notification-close:hover {
                background: var(--bg-hover);
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    const autoHideTimer = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimer);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Scroll Effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-card, .category-card, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// Lazy Loading
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other scripts
window.GameVault = {
    sampleProducts,
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    showNotification,
    formatPrice,
    currentTheme
};
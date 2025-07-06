// Product detail page functionality

let currentProduct = null;
let selectedColor = '';
let selectedSize = '';
let quantity = 1;

// Initialize product page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product.html')) {
        initializeProductPage();
    }
});

function initializeProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        loadProduct(productId);
    } else {
        // Redirect to products page if no ID
        window.location.href = 'products.html';
    }
}

// Load product data
function loadProduct(productId) {
    currentProduct = window.GameVault.sampleProducts.find(p => p.id === productId);
    
    if (!currentProduct) {
        showProductNotFound();
        return;
    }
    
    updateProductDisplay();
    initializeProductInteractions();
    loadRelatedProducts();
    updateBreadcrumb();
}

// Update product display
function updateProductDisplay() {
    if (!currentProduct) return;
    
    // Update page title
    document.title = `${currentProduct.name} - GameVault`;
    
    // Update product images
    updateProductImages();
    
    // Update product info
    updateProductInfo();
    
    // Update product tabs
    updateProductTabs();
}

// Update product images
function updateProductImages() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        mainImage.src = currentProduct.image;
        mainImage.alt = currentProduct.name;
    }
    
    // For demo purposes, use the same image for thumbnails
    // In a real app, you'd have multiple product images
    thumbnails.forEach((thumb, index) => {
        thumb.src = currentProduct.image;
        thumb.alt = `${currentProduct.name} - View ${index + 1}`;
    });
}

// Update product information
function updateProductInfo() {
    // Product title
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = currentProduct.name;
    }
    
    // Product price
    const currentPrice = document.getElementById('currentPrice');
    const originalPrice = document.getElementById('originalPrice');
    
    if (currentPrice) {
        currentPrice.textContent = `$${currentProduct.price.toFixed(2)}`;
    }
    
    if (originalPrice && currentProduct.originalPrice) {
        originalPrice.textContent = `$${currentProduct.originalPrice.toFixed(2)}`;
        originalPrice.style.display = 'inline';
        
        // Calculate and show discount
        const discountPercentage = Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100);
        const discountBadge = document.querySelector('.discount-badge');
        if (discountBadge) {
            discountBadge.textContent = `${discountPercentage}% OFF`;
            discountBadge.style.display = 'inline';
        }
    } else if (originalPrice) {
        originalPrice.style.display = 'none';
        const discountBadge = document.querySelector('.discount-badge');
        if (discountBadge) {
            discountBadge.style.display = 'none';
        }
    }
    
    // Product rating
    updateProductRating();
    
    // Product description
    const productDescription = document.querySelector('.product-description p');
    if (productDescription) {
        productDescription.textContent = currentProduct.description;
    }
    
    // Product badges
    updateProductBadges();
    
    // Stock status
    updateStockStatus();
}

// Update product rating display
function updateProductRating() {
    const stars = document.querySelectorAll('.product-rating .star');
    const ratingText = document.querySelector('.product-rating .rating-text');
    
    stars.forEach((star, index) => {
        if (index < Math.floor(currentProduct.rating)) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
    
    if (ratingText) {
        ratingText.textContent = `(${currentProduct.rating}) ${currentProduct.reviews} reviews`;
    }
}

// Update product badges
function updateProductBadges() {
    const badgeContainer = document.querySelector('.product-badge');
    if (!badgeContainer) return;
    
    const badges = currentProduct.badges.map(badge => {
        const badgeClass = badge === 'new' ? 'badge-new' : 
                          badge === 'sale' ? 'badge-sale' : 
                          badge === 'bestseller' ? 'badge-bestseller' : '';
        return `<span class="${badgeClass}">${badge}</span>`;
    }).join('');
    
    badgeContainer.innerHTML = badges;
}

// Update stock status
function updateStockStatus() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (addToCartBtn) {
        if (currentProduct.inStock) {
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                Add to Cart
            `;
        } else {
            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = 'Out of Stock';
        }
    }
}

// Initialize product interactions
function initializeProductInteractions() {
    initializeThumbnailNavigation();
    initializeColorSelection();
    initializeSizeSelection();
    initializeQuantitySelector();
    initializeAddToCart();
    initializeWishlistToggle();
    initializeProductTabs();
    initializeImageZoom();
}

// Initialize thumbnail navigation
function initializeThumbnailNavigation() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            if (mainImage) {
                mainImage.src = this.src;
                mainImage.alt = this.alt;
            }
        });
    });
}

// Initialize color selection
function initializeColorSelection() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Update selected color
            selectedColor = this.dataset.color;
        });
    });
    
    // Set default color
    if (colorOptions.length > 0) {
        colorOptions[0].classList.add('active');
        selectedColor = colorOptions[0].dataset.color;
    }
}

// Initialize size selection
function initializeSizeSelection() {
    const sizeSelect = document.getElementById('sizeSelect');
    
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            selectedSize = this.value;
        });
        
        // Set default size
        selectedSize = sizeSelect.value;
    }
}

// Initialize quantity selector
function initializeQuantitySelector() {
    const qtyInput = document.querySelector('.qty-input');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    
    if (qtyInput && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', function() {
            const currentQty = parseInt(qtyInput.value);
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
                quantity = currentQty - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            const currentQty = parseInt(qtyInput.value);
            const maxQty = parseInt(qtyInput.max) || 10;
            if (currentQty < maxQty) {
                qtyInput.value = currentQty + 1;
                quantity = currentQty + 1;
            }
        });
        
        qtyInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            const min = parseInt(this.min) || 1;
            const max = parseInt(this.max) || 10;
            
            if (value < min) {
                this.value = min;
                quantity = min;
            } else if (value > max) {
                this.value = max;
                quantity = max;
            } else {
                quantity = value;
            }
        });
        
        // Set initial quantity
        quantity = parseInt(qtyInput.value);
    }
}

// Initialize add to cart functionality
function initializeAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (currentProduct && currentProduct.inStock) {
                window.GameVault.addToCart(currentProduct.id, quantity);
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }
}

// Initialize wishlist toggle
function initializeWishlistToggle() {
    const wishlistBtn = document.querySelector('.wishlist-toggle');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            if (currentProduct) {
                window.GameVault.toggleWishlist(currentProduct.id);
                updateWishlistButtonState();
            }
        });
        
        // Set initial state
        updateWishlistButtonState();
    }
}

// Update wishlist button state
function updateWishlistButtonState() {
    const wishlistBtn = document.querySelector('.wishlist-toggle');
    if (!wishlistBtn || !currentProduct) return;
    
    const isInWishlist = window.GameVault.wishlist.some(item => item.id === currentProduct.id);
    const icon = wishlistBtn.querySelector('svg path');
    
    if (isInWishlist) {
        wishlistBtn.style.color = 'var(--secondary-color)';
        if (icon) icon.style.fill = 'var(--secondary-color)';
        wishlistBtn.innerHTML = wishlistBtn.innerHTML.replace('Add to Wishlist', 'Remove from Wishlist');
    } else {
        wishlistBtn.style.color = '';
        if (icon) icon.style.fill = 'none';
        wishlistBtn.innerHTML = wishlistBtn.innerHTML.replace('Remove from Wishlist', 'Add to Wishlist');
    }
}

// Initialize product tabs
function initializeProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Initialize image zoom
function initializeImageZoom() {
    const mainImage = document.querySelector('.main-image');
    const mainImg = document.querySelector('.main-img');
    
    if (mainImage && mainImg) {
        mainImage.addEventListener('mouseenter', function() {
            this.style.cursor = 'zoom-in';
        });
        
        mainImage.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            mainImg.style.transformOrigin = `${x}% ${y}%`;
            mainImg.style.transform = 'scale(2)';
        });
        
        mainImage.addEventListener('mouseleave', function() {
            mainImg.style.transform = 'scale(1)';
            mainImg.style.transformOrigin = 'center center';
            this.style.cursor = 'default';
        });
    }
}

// Update product tabs content
function updateProductTabs() {
    if (!currentProduct) return;
    
    // Update specifications tab
    updateSpecificationsTab();
    
    // Update reviews tab
    updateReviewsTab();
}

// Update specifications tab
function updateSpecificationsTab() {
    const specsGrid = document.querySelector('.specs-grid');
    if (!specsGrid) return;
    
    // Sample specifications based on product category
    let specs = {};
    
    if (currentProduct.category === 'gaming-gear') {
        specs = {
            'Brand': currentProduct.brand,
            'Category': currentProduct.category.replace('-', ' '),
            'Price': `$${currentProduct.price.toFixed(2)}`,
            'Rating': `${currentProduct.rating}/5`,
            'Reviews': currentProduct.reviews,
            'In Stock': currentProduct.inStock ? 'Yes' : 'No'
        };
    } else {
        specs = {
            'Brand': currentProduct.brand,
            'Category': currentProduct.category.replace('-', ' '),
            'Price': `$${currentProduct.price.toFixed(2)}`,
            'Rating': `${currentProduct.rating}/5`,
            'Reviews': currentProduct.reviews
        };
    }
    
    const specsHTML = Object.entries(specs).map(([label, value]) => `
        <div class="spec-item">
            <span class="spec-label">${label}:</span>
            <span class="spec-value">${value}</span>
        </div>
    `).join('');
    
    specsGrid.innerHTML = specsHTML;
}

// Update reviews tab
function updateReviewsTab() {
    const reviewsList = document.querySelector('.reviews-list');
    if (!reviewsList) return;
    
    // Sample reviews
    const sampleReviews = [
        {
            name: 'ProGamer2024',
            rating: 5,
            date: '2 days ago',
            title: 'Perfect for competitive gaming',
            text: 'This product is incredible! The quality is amazing and it performs exactly as expected. Highly recommended for serious gamers.'
        },
        {
            name: 'TechReviewer',
            rating: 4,
            date: '1 week ago',
            title: 'Great build quality',
            text: 'Solid construction and feels premium. The performance is excellent for the price point. Only minor complaint is the packaging could be better.'
        }
    ];
    
    const reviewsHTML = sampleReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">${review.name}</span>
                    <div class="review-rating">
                        ${Array.from({length: 5}, (_, i) => 
                            `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
                        ).join('')}
                    </div>
                </div>
                <span class="review-date">${review.date}</span>
            </div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
    
    reviewsList.innerHTML = reviewsHTML;
}

// Load related products
function loadRelatedProducts() {
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (!relatedGrid || !currentProduct) return;
    
    // Get products from same category, excluding current product
    const relatedProducts = window.GameVault.sampleProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // If no products in same category, get random products
        relatedProducts.push(...window.GameVault.sampleProducts
            .filter(p => p.id !== currentProduct.id)
            .slice(0, 4));
    }
    
    relatedGrid.innerHTML = relatedProducts.map(product => createRelatedProductCard(product)).join('');
    
    // Add event listeners
    addRelatedProductListeners();
}

// Create related product card
function createRelatedProductCard(product) {
    const stars = Array.from({length: 5}, (_, i) => 
        `<span class="star ${i < Math.floor(product.rating) ? 'filled' : ''}">★</span>`
    ).join('');
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Add event listeners to related products
function addRelatedProductListeners() {
    // Add to cart buttons
    document.querySelectorAll('#relatedProductsGrid .add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            window.GameVault.addToCart(productId);
        });
    });
    
    // Product card clicks
    document.querySelectorAll('#relatedProductsGrid .product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('button')) return;
            
            const productId = this.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

// Update breadcrumb
function updateBreadcrumb() {
    if (!currentProduct) return;
    
    const productCategory = document.getElementById('productCategory');
    const productName = document.getElementById('productName');
    
    if (productCategory) {
        productCategory.textContent = currentProduct.category.replace('-', ' ');
    }
    
    if (productName) {
        productName.textContent = currentProduct.name;
    }
}

// Show product not found
function showProductNotFound() {
    document.body.innerHTML = `
        <div class="container" style="text-align: center; padding: 100px 20px;">
            <h1>Product Not Found</h1>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <a href="products.html" class="btn btn-primary">Back to Products</a>
        </div>
    `;
}

// Add to recently viewed
function addToRecentlyViewed(productId) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to beginning
    recentlyViewed.unshift(productId);
    
    // Keep only last 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Initialize recently viewed when product loads
if (currentProduct) {
    addToRecentlyViewed(currentProduct.id);
}
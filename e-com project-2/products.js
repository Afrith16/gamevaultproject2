// Products page functionality

let currentPage = 1;
let itemsPerPage = 12;
let filteredProducts = [...window.GameVault.sampleProducts];
let currentFilters = {
    category: '',
    brand: '',
    priceRange: '',
    search: ''
};
let currentSort = 'featured';
let currentView = 'grid';

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        initializeProductsPage();
    }
});

function initializeProductsPage() {
    parseURLParameters();
    initializeFilters();
    initializeViewToggle();
    initializePagination();
    loadProducts();
    updateResultsCount();
}

// Parse URL parameters for initial filters
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    currentFilters.category = urlParams.get('category') || '';
    currentFilters.search = urlParams.get('search') || '';
    
    // Set filter values in UI
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter && currentFilters.category) {
        categoryFilter.value = currentFilters.category;
    }
    
    if (searchInput && currentFilters.search) {
        searchInput.value = currentFilters.search;
    }
}

// Initialize filter functionality
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFilters = document.getElementById('clearFilters');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // Filter event listeners
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyFilters();
        });
    }
    
    if (brandFilter) {
        brandFilter.addEventListener('change', function() {
            currentFilters.brand = this.value;
            applyFilters();
        });
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            currentFilters.priceRange = this.value;
            applyFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentSort = this.value;
            applyFilters();
        });
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            clearAllFilters();
        });
    }
    
    // Search functionality
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performProductSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performProductSearch();
            }
        });
    }
}

// Apply filters and sorting
function applyFilters() {
    filteredProducts = [...window.GameVault.sampleProducts];
    
    // Apply category filter
    if (currentFilters.category) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === currentFilters.category
        );
    }
    
    // Apply brand filter
    if (currentFilters.brand) {
        filteredProducts = filteredProducts.filter(product => 
            product.brand === currentFilters.brand
        );
    }
    
    // Apply price range filter
    if (currentFilters.priceRange) {
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            switch (currentFilters.priceRange) {
                case '0-25':
                    return price >= 0 && price <= 25;
                case '25-50':
                    return price > 25 && price <= 50;
                case '50-100':
                    return price > 50 && price <= 100;
                case '100-200':
                    return price > 100 && price <= 200;
                case '200+':
                    return price > 200;
                default:
                    return true;
            }
        });
    }
    
    // Apply search filter
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    applySorting();
    
    // Reset to first page
    currentPage = 1;
    
    // Update display
    loadProducts();
    updateResultsCount();
    updatePagination();
    updateURL();
}

// Apply sorting to filtered products
function applySorting() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.rating - a.rating;
            });
            break;
    }
}

// Clear all filters
function clearAllFilters() {
    currentFilters = {
        category: '',
        brand: '',
        priceRange: '',
        search: ''
    };
    currentSort = 'featured';
    currentPage = 1;
    
    // Reset filter UI
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) categoryFilter.value = '';
    if (brandFilter) brandFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sortFilter) sortFilter.value = 'featured';
    if (searchInput) searchInput.value = '';
    
    applyFilters();
}

// Perform product search
function performProductSearch() {
    const searchInput = document.getElementById('searchInput');
    currentFilters.search = searchInput.value.trim();
    applyFilters();
}

// Initialize view toggle (grid/list)
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid class
            if (productsGrid) {
                productsGrid.classList.remove('grid-view', 'list-view');
                productsGrid.classList.add(`${view}-view`);
            }
            
            currentView = view;
        });
    });
}

// Load and display products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Show loading state
    productsGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <div class="no-products-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
                </div>
            `;
        } else {
            productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
            
            // Add event listeners to new product cards
            addProductCardListeners();
            
            // Update wishlist button states
            updateWishlistButtons();
        }
    }, 300);
}

// Create product card HTML (reuse from main.js but with modifications for list view)
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
    
    const stockStatus = product.inStock 
        ? '<span class="stock-status in-stock">In Stock</span>'
        : '<span class="stock-status out-of-stock">Out of Stock</span>';
    
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
                    <button class="action-btn compare-btn" data-product-id="${product.id}" title="Compare">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 6l6 6l-6 6"></path>
                            <path d="M3 6l6 6l-6 6"></path>
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
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-brand">Brand: ${product.brand}</span>
                    ${stockStatus}
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${originalPriceHTML}
                </div>
                <div class="product-actions-bottom">
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="8" cy="21" r="1"></circle>
                            <circle cx="19" cy="21" r="1"></circle>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                        </svg>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <a href="product.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to product cards
function addProductCardListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            window.GameVault.addToCart(productId);
        });
    });
    
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            window.GameVault.toggleWishlist(productId);
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
    
    // Compare buttons
    document.querySelectorAll('.compare-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            addToCompare(productId);
        });
    });
    
    // Product card clicks (navigate to product page)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons or links
            if (e.target.closest('button') || e.target.closest('a')) return;
            
            const productId = this.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

// Update wishlist button states
function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        const productId = parseInt(button.dataset.productId);
        const isInWishlist = window.GameVault.wishlist.some(item => item.id === productId);
        
        if (isInWishlist) {
            button.style.color = 'var(--secondary-color)';
            button.querySelector('svg').style.fill = 'var(--secondary-color)';
        } else {
            button.style.color = '';
            button.querySelector('svg').style.fill = 'none';
        }
    });
}

// Initialize pagination
function initializePagination() {
    // Pagination will be updated dynamically
}

// Update pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadProducts();
    updatePagination();
    updateURL();
    
    // Scroll to top of products
    const productsSection = document.querySelector('.products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (!resultsCount) return;
    
    const totalProducts = filteredProducts.length;
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalProducts);
    
    if (totalProducts === 0) {
        resultsCount.textContent = 'No products found';
    } else {
        resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${totalProducts} products`;
    }
}

// Update URL with current filters
function updateURL() {
    const params = new URLSearchParams();
    
    if (currentFilters.category) params.set('category', currentFilters.category);
    if (currentFilters.brand) params.set('brand', currentFilters.brand);
    if (currentFilters.priceRange) params.set('price', currentFilters.priceRange);
    if (currentFilters.search) params.set('search', currentFilters.search);
    if (currentSort !== 'featured') params.set('sort', currentSort);
    if (currentPage > 1) params.set('page', currentPage);
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
}

// Compare functionality
let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

function addToCompare(productId) {
    const product = window.GameVault.sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (compareList.length >= 3) {
        window.GameVault.showNotification('You can only compare up to 3 products at a time', 'info');
        return;
    }
    
    if (compareList.some(item => item.id === productId)) {
        window.GameVault.showNotification(`${product.name} is already in your compare list`, 'info');
        return;
    }
    
    compareList.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
        category: product.category
    });
    
    localStorage.setItem('compareList', JSON.stringify(compareList));
    window.GameVault.showNotification(`${product.name} added to compare list`, 'success');
    updateCompareCount();
}

function updateCompareCount() {
    // This would update a compare counter in the UI if implemented
    console.log(`Compare list has ${compareList.length} items`);
}

// Quick view functionality (reuse from main.js)
function showQuickView(productId) {
    const product = window.GameVault.sampleProducts.find(p => p.id === productId);
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
                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
    
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: var(--z-modal);
                opacity: 0;
                transition: opacity var(--transition-normal);
            }
            
            .modal-content {
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                transform: scale(0.9);
                transition: transform var(--transition-normal);
            }
            
            .modal-close {
                position: absolute;
                top: var(--spacing-md);
                right: var(--spacing-md);
                background: var(--bg-secondary);
                border: none;
                border-radius: var(--radius-full);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--text-secondary);
                transition: all var(--transition-fast);
                z-index: 1;
            }
            
            .modal-close:hover {
                background: var(--bg-hover);
                color: var(--text-primary);
            }
            
            .quick-view-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--spacing-xl);
                padding: var(--spacing-xl);
            }
            
            .quick-view-image img {
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-radius: var(--radius-md);
            }
            
            .quick-view-info h2 {
                margin-bottom: var(--spacing-md);
            }
            
            .quick-view-actions {
                display: flex;
                gap: var(--spacing-md);
                margin-top: var(--spacing-lg);
            }
            
            .quick-view-actions .btn {
                flex: 1;
            }
            
            @media (max-width: 768px) {
                .quick-view-content {
                    grid-template-columns: 1fr;
                    padding: var(--spacing-lg);
                }
                
                .quick-view-actions {
                    flex-direction: column;
                }
            }
            
            .no-products {
                grid-column: 1 / -1;
                text-align: center;
                padding: var(--spacing-3xl);
                color: var(--text-secondary);
            }
            
            .no-products-icon {
                margin-bottom: var(--spacing-lg);
                color: var(--text-muted);
            }
            
            .no-products h3 {
                margin-bottom: var(--spacing-md);
                color: var(--text-primary);
            }
            
            .no-products p {
                margin-bottom: var(--spacing-lg);
            }
            
            .page-ellipsis {
                display: flex;
                align-items: center;
                padding: var(--spacing-sm) var(--spacing-md);
                color: var(--text-muted);
            }
            
            .stock-status {
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .stock-status.in-stock {
                color: var(--success-color);
            }
            
            .stock-status.out-of-stock {
                color: var(--error-color);
            }
            
            .product-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-md);
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            .product-brand {
                text-transform: capitalize;
            }
            
            .product-actions-bottom {
                display: flex;
                gap: var(--spacing-sm);
            }
            
            .product-actions-bottom .btn {
                flex: 1;
            }
            
            @media (max-width: 767px) {
                .product-actions-bottom {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
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
    
    if (addToCartBtn && product.inStock) {
        addToCartBtn.addEventListener('click', function() {
            window.GameVault.addToCart(productId);
            closeQuickView();
        });
    }
    
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

// Make functions globally available
window.goToPage = goToPage;
window.clearAllFilters = clearAllFilters;
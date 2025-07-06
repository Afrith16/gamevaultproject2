// Cart page functionality

let cartItems = [];
let promoCode = '';
let discount = 0;

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        initializeCartPage();
    }
});

function initializeCartPage() {
    loadCartItems();
    initializeCartActions();
    loadRecentlyViewed();
    updateCartDisplay();
}

// Load cart items from localStorage
function loadCartItems() {
    cartItems = JSON.parse(localStorage.getItem('cart')) || [];
}

// Initialize cart page actions
function initializeCartActions() {
    const clearCartBtn = document.getElementById('clearCartBtn');
    const updateCartBtn = document.getElementById('updateCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoInput');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', updateCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
}

// Update cart display
function updateCartDisplay() {
    updateCartItemsList();
    updateCartSummary();
    updateCartCount();
    toggleEmptyCartState();
}

// Update cart items list
function updateCartItemsList() {
    const cartList = document.getElementById('cartList');
    const cartItemCount = document.getElementById('cartItemCount');
    
    if (!cartList) return;
    
    if (cartItems.length === 0) {
        cartList.innerHTML = '';
        if (cartItemCount) cartItemCount.textContent = '0';
        return;
    }
    
    if (cartItemCount) {
        cartItemCount.textContent = cartItems.length;
    }
    
    const cartHTML = cartItems.map(item => createCartItemHTML(item)).join('');
    cartList.innerHTML = cartHTML;
    
    // Add event listeners to cart items
    addCartItemListeners();
}

// Create cart item HTML
function createCartItemHTML(item) {
    const product = window.GameVault.sampleProducts.find(p => p.id === item.id);
    const itemTotal = item.price * item.quantity;
    
    return `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-details">
                    <span>Price: $${item.price.toFixed(2)}</span>
                    ${product ? `<span>Brand: ${product.brand}</span>` : ''}
                    ${product ? `<span>Category: ${product.category.replace('-', ' ')}</span>` : ''}
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn minus" data-product-id="${item.id}">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" data-product-id="${item.id}">
                        <button class="qty-btn plus" data-product-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item" data-product-id="${item.id}" title="Remove item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to cart items
function addCartItemListeners() {
    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const isPlus = this.classList.contains('plus');
            const qtyInput = document.querySelector(`.qty-input[data-product-id="${productId}"]`);
            
            if (qtyInput) {
                let newQuantity = parseInt(qtyInput.value);
                
                if (isPlus) {
                    newQuantity = Math.min(newQuantity + 1, 10);
                } else {
                    newQuantity = Math.max(newQuantity - 1, 1);
                }
                
                qtyInput.value = newQuantity;
                updateItemQuantity(productId, newQuantity);
            }
        });
    });
    
    // Quantity inputs
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.productId);
            let newQuantity = parseInt(this.value);
            
            // Validate quantity
            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1;
            } else if (newQuantity > 10) {
                newQuantity = 10;
            }
            
            this.value = newQuantity;
            updateItemQuantity(productId, newQuantity);
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            removeCartItem(productId);
        });
    });
}

// Update item quantity
function updateItemQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.GameVault.cart = cartItems; // Update global cart
        updateCartSummary();
        updateCartCount();
        
        // Update the specific item's total price display
        const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (cartItem) {
            const priceElement = cartItem.querySelector('.cart-item-price');
            if (priceElement) {
                const itemTotal = item.price * newQuantity;
                priceElement.textContent = `$${itemTotal.toFixed(2)}`;
            }
        }
    }
}

// Remove cart item
function removeCartItem(productId) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const item = cartItems[itemIndex];
        cartItems.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.GameVault.cart = cartItems; // Update global cart
        
        // Remove item from DOM with animation
        const cartItemElement = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (cartItemElement) {
            cartItemElement.style.opacity = '0';
            cartItemElement.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                updateCartDisplay();
            }, 300);
        }
        
        window.GameVault.showNotification(`${item.name} removed from cart`, 'info');
    }
}

// Clear entire cart
function clearCart() {
    if (cartItems.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cartItems = [];
        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.GameVault.cart = cartItems; // Update global cart
        updateCartDisplay();
        window.GameVault.showNotification('Cart cleared', 'info');
    }
}

// Update cart
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.GameVault.cart = cartItems; // Update global cart
    window.GameVault.showNotification('Cart updated', 'success');
}

// Update cart summary
function updateCartSummary() {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax - discount;
    
    // Update summary elements
    const subtotalElement = document.getElementById('cartSubtotal');
    const shippingElement = document.getElementById('cartShipping');
    const taxElement = document.getElementById('cartTax');
    const discountElement = document.getElementById('cartDiscount');
    const totalElement = document.getElementById('cartTotal');
    const discountRow = document.getElementById('discountRow');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    if (discountElement && discountRow) {
        if (discount > 0) {
            discountElement.textContent = `-$${discount.toFixed(2)}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
    }
}

// Calculate subtotal
function calculateSubtotal() {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Calculate shipping
function calculateShipping(subtotal) {
    // Free shipping over $50
    return subtotal >= 50 ? 0 : 9.99;
}

// Calculate tax
function calculateTax(subtotal) {
    // 8.5% tax rate
    return subtotal * 0.085;
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    if (!promoInput) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        window.GameVault.showNotification('Please enter a promo code', 'info');
        return;
    }
    
    // Sample promo codes
    const promoCodes = {
        'SAVE10': { type: 'percentage', value: 10, description: '10% off' },
        'WELCOME20': { type: 'percentage', value: 20, description: '20% off' },
        'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' },
        'SAVE25': { type: 'fixed', value: 25, description: '$25 off' }
    };
    
    if (promoCodes[code]) {
        const promo = promoCodes[code];
        const subtotal = calculateSubtotal();
        
        switch (promo.type) {
            case 'percentage':
                discount = subtotal * (promo.value / 100);
                break;
            case 'fixed':
                discount = Math.min(promo.value, subtotal);
                break;
            case 'shipping':
                // This would modify shipping calculation
                discount = calculateShipping(subtotal);
                break;
        }
        
        promoCode = code;
        promoInput.value = '';
        updateCartSummary();
        window.GameVault.showNotification(`Promo code applied: ${promo.description}`, 'success');
    } else {
        window.GameVault.showNotification('Invalid promo code', 'error');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        window.GameVault.showNotification('Your cart is empty', 'info');
        return;
    }
    
    // In a real app, this would redirect to checkout page
    window.GameVault.showNotification('Redirecting to checkout...', 'info');
    
    // Simulate checkout process
    setTimeout(() => {
        window.GameVault.showNotification('Checkout functionality would be implemented here', 'info');
    }, 1000);
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Toggle empty cart state
function toggleEmptyCartState() {
    const cartSection = document.querySelector('.cart-section');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cartItems.length === 0) {
        if (cartSection) cartSection.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
    } else {
        if (cartSection) cartSection.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
    }
}

// Load recently viewed products
function loadRecentlyViewed() {
    const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');
    if (!recentlyViewedGrid) return;
    
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const recentProducts = recentlyViewed
        .map(id => window.GameVault.sampleProducts.find(p => p.id === id))
        .filter(product => product)
        .slice(0, 4);
    
    if (recentProducts.length === 0) {
        // Hide recently viewed section if no products
        const recentlyViewedSection = document.querySelector('.recently-viewed');
        if (recentlyViewedSection) {
            recentlyViewedSection.style.display = 'none';
        }
        return;
    }
    
    recentlyViewedGrid.innerHTML = recentProducts.map(product => createRecentlyViewedCard(product)).join('');
    
    // Add event listeners
    addRecentlyViewedListeners();
}

// Create recently viewed product card
function createRecentlyViewedCard(product) {
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

// Add event listeners to recently viewed products
function addRecentlyViewedListeners() {
    // Add to cart buttons
    document.querySelectorAll('#recentlyViewedGrid .add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            window.GameVault.addToCart(productId);
        });
    });
    
    // Product card clicks
    document.querySelectorAll('#recentlyViewedGrid .product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('button')) return;
            
            const productId = this.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

// Save cart state before page unload
window.addEventListener('beforeunload', function() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
});
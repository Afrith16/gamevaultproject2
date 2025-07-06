// Global cart functionality (shared across all pages)

// Cart management functions that can be used across the site
window.CartManager = {
    // Add item to cart
    addItem: function(productId, quantity = 1, options = {}) {
        const product = window.GameVault.sampleProducts.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return false;
        }
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => 
            item.id === productId && 
            JSON.stringify(item.options || {}) === JSON.stringify(options)
        );
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                options: options,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
        this.showAddToCartAnimation(productId);
        
        return true;
    },
    
    // Remove item from cart
    removeItem: function(productId, options = {}) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => 
            !(item.id === productId && 
              JSON.stringify(item.options || {}) === JSON.stringify(options))
        );
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
    },
    
    // Update item quantity
    updateQuantity: function(productId, quantity, options = {}) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => 
            item.id === productId && 
            JSON.stringify(item.options || {}) === JSON.stringify(options)
        );
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = quantity;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartUI();
        }
    },
    
    // Clear entire cart
    clearCart: function() {
        localStorage.setItem('cart', JSON.stringify([]));
        this.updateCartUI();
    },
    
    // Get cart items
    getItems: function() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },
    
    // Get cart total
    getTotal: function() {
        const cart = this.getItems();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // Get cart item count
    getItemCount: function() {
        const cart = this.getItems();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    // Update cart UI elements
    updateCartUI: function() {
        const cartCount = document.getElementById('cartCount');
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemCount = this.getItemCount();
        
        // Update all cart count elements
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            element.style.display = itemCount > 0 ? 'block' : 'none';
        });
        
        // Update cart dropdown if it exists
        this.updateCartDropdown();
        
        // Trigger custom event for cart update
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this.getItems(),
                total: this.getTotal(),
                count: itemCount
            }
        }));
    },
    
    // Update cart dropdown (mini cart)
    updateCartDropdown: function() {
        const cartDropdown = document.getElementById('cartDropdown');
        if (!cartDropdown) return;
        
        const cart = this.getItems();
        
        if (cart.length === 0) {
            cartDropdown.innerHTML = `
                <div class="cart-dropdown-empty">
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        const cartHTML = `
            <div class="cart-dropdown-items">
                ${cart.slice(0, 3).map(item => `
                    <div class="cart-dropdown-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-dropdown-image">
                        <div class="cart-dropdown-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                        <button class="cart-dropdown-remove" onclick="CartManager.removeItem(${item.id})">×</button>
                    </div>
                `).join('')}
                ${cart.length > 3 ? `<p class="cart-dropdown-more">+${cart.length - 3} more items</p>` : ''}
            </div>
            <div class="cart-dropdown-footer">
                <div class="cart-dropdown-total">
                    <strong>Total: $${this.getTotal().toFixed(2)}</strong>
                </div>
                <div class="cart-dropdown-actions">
                    <a href="cart.html" class="btn btn-secondary">View Cart</a>
                    <button class="btn btn-primary" onclick="CartManager.proceedToCheckout()">Checkout</button>
                </div>
            </div>
        `;
        
        cartDropdown.innerHTML = cartHTML;
    },
    
    // Show add to cart animation
    showAddToCartAnimation: function(productId) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        const cartIcon = document.querySelector('.cart-link');
        
        if (productCard && cartIcon) {
            const productImage = productCard.querySelector('.product-image');
            if (productImage) {
                // Create flying image animation
                const flyingImage = productImage.cloneNode(true);
                flyingImage.style.position = 'fixed';
                flyingImage.style.zIndex = '9999';
                flyingImage.style.width = '50px';
                flyingImage.style.height = '50px';
                flyingImage.style.borderRadius = '50%';
                flyingImage.style.transition = 'all 0.8s ease-in-out';
                flyingImage.style.pointerEvents = 'none';
                
                const productRect = productImage.getBoundingClientRect();
                const cartRect = cartIcon.getBoundingClientRect();
                
                flyingImage.style.left = productRect.left + 'px';
                flyingImage.style.top = productRect.top + 'px';
                
                document.body.appendChild(flyingImage);
                
                // Animate to cart
                setTimeout(() => {
                    flyingImage.style.left = cartRect.left + 'px';
                    flyingImage.style.top = cartRect.top + 'px';
                    flyingImage.style.transform = 'scale(0.1)';
                    flyingImage.style.opacity = '0';
                }, 100);
                
                // Remove after animation
                setTimeout(() => {
                    document.body.removeChild(flyingImage);
                }, 900);
                
                // Cart icon bounce effect
                cartIcon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1)';
                }, 200);
            }
        }
    },
    
    // Proceed to checkout
    proceedToCheckout: function() {
        const cart = this.getItems();
        if (cart.length === 0) {
            window.GameVault.showNotification('Your cart is empty', 'info');
            return;
        }
        
        // In a real app, this would redirect to checkout
        window.location.href = 'cart.html';
    },
    
    // Save cart for later (wishlist functionality)
    saveForLater: function(productId, options = {}) {
        this.removeItem(productId, options);
        
        // Add to wishlist
        if (window.GameVault && window.GameVault.toggleWishlist) {
            window.GameVault.toggleWishlist(productId);
        }
        
        window.GameVault.showNotification('Item saved for later', 'info');
    },
    
    // Restore cart from saved state
    restoreCart: function() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const cart = JSON.parse(savedCart);
                // Validate cart items
                const validCart = cart.filter(item => {
                    const product = window.GameVault.sampleProducts.find(p => p.id === item.id);
                    return product && item.quantity > 0;
                });
                
                if (validCart.length !== cart.length) {
                    localStorage.setItem('cart', JSON.stringify(validCart));
                }
                
                this.updateCartUI();
            } catch (error) {
                console.error('Error restoring cart:', error);
                localStorage.setItem('cart', JSON.stringify([]));
            }
        }
    },
    
    // Get cart summary for display
    getSummary: function() {
        const cart = this.getItems();
        const subtotal = this.getTotal();
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const tax = subtotal * 0.085; // 8.5% tax
        const total = subtotal + shipping + tax;
        
        return {
            items: cart,
            itemCount: this.getItemCount(),
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        };
    },
    
    // Apply discount code
    applyDiscount: function(code) {
        const discountCodes = {
            'SAVE10': { type: 'percentage', value: 10 },
            'WELCOME20': { type: 'percentage', value: 20 },
            'SAVE25': { type: 'fixed', value: 25 }
        };
        
        const discount = discountCodes[code.toUpperCase()];
        if (discount) {
            localStorage.setItem('appliedDiscount', JSON.stringify(discount));
            return discount;
        }
        
        return null;
    },
    
    // Get applied discount
    getDiscount: function() {
        const discount = localStorage.getItem('appliedDiscount');
        return discount ? JSON.parse(discount) : null;
    },
    
    // Remove discount
    removeDiscount: function() {
        localStorage.removeItem('appliedDiscount');
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CartManager.restoreCart();
    
    // Add cart dropdown functionality
    initializeCartDropdown();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', function(event) {
        console.log('Cart updated:', event.detail);
    });
});

// Initialize cart dropdown
function initializeCartDropdown() {
    const cartLink = document.querySelector('.cart-link');
    const cartDropdown = document.getElementById('cartDropdown');
    
    if (cartLink && !cartDropdown) {
        // Create cart dropdown if it doesn't exist
        const dropdown = document.createElement('div');
        dropdown.id = 'cartDropdown';
        dropdown.className = 'cart-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            min-width: 300px;
            max-width: 400px;
            z-index: var(--z-dropdown);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all var(--transition-normal);
            margin-top: 10px;
        `;
        
        cartLink.style.position = 'relative';
        cartLink.appendChild(dropdown);
        
        // Show/hide dropdown on hover
        cartLink.addEventListener('mouseenter', function() {
            CartManager.updateCartDropdown();
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
        });
        
        cartLink.addEventListener('mouseleave', function() {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
        });
    }
}

// Add cart dropdown styles
const cartDropdownStyles = `
    .cart-dropdown-empty {
        padding: var(--spacing-lg);
        text-align: center;
        color: var(--text-secondary);
    }
    
    .cart-dropdown-items {
        max-height: 300px;
        overflow-y: auto;
        padding: var(--spacing-sm);
    }
    
    .cart-dropdown-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        border-bottom: 1px solid var(--border-primary);
    }
    
    .cart-dropdown-item:last-child {
        border-bottom: none;
    }
    
    .cart-dropdown-image {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: var(--radius-sm);
    }
    
    .cart-dropdown-info {
        flex: 1;
    }
    
    .cart-dropdown-info h4 {
        font-size: 0.875rem;
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--text-primary);
    }
    
    .cart-dropdown-info p {
        font-size: 0.75rem;
        margin: 0;
        color: var(--text-secondary);
    }
    
    .cart-dropdown-remove {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.25rem;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }
    
    .cart-dropdown-remove:hover {
        background: var(--bg-hover);
        color: var(--error-color);
    }
    
    .cart-dropdown-more {
        text-align: center;
        color: var(--text-muted);
        font-size: 0.75rem;
        margin: var(--spacing-sm) 0;
    }
    
    .cart-dropdown-footer {
        padding: var(--spacing-md);
        border-top: 1px solid var(--border-primary);
    }
    
    .cart-dropdown-total {
        text-align: center;
        margin-bottom: var(--spacing-md);
        color: var(--text-primary);
    }
    
    .cart-dropdown-actions {
        display: flex;
        gap: var(--spacing-sm);
    }
    
    .cart-dropdown-actions .btn {
        flex: 1;
        font-size: 0.875rem;
        padding: var(--spacing-sm) var(--spacing-md);
    }
`;

// Add styles to document
if (!document.querySelector('#cart-dropdown-styles')) {
    const style = document.createElement('style');
    style.id = 'cart-dropdown-styles';
    style.textContent = cartDropdownStyles;
    document.head.appendChild(style);
}

// Export for use in other scripts
window.CartManager = CartManager;
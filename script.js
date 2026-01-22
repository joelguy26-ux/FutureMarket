// ============================================
// AMAZON AFFILIATE PRODUCTS SYSTEM
// ============================================
// 
// To add products, simply add objects to the amazonProducts array below.
// Each product needs:
//   - id: unique identifier
//   - name: product name
//   - price: product price (number)
//   - originalPrice: original price if on sale (optional)
//   - image: product image URL
//   - image2: second image for hover effect (optional)
//   - affiliateLink: your Amazon affiliate link
//   - category: product category (optional, for filtering)
//
// Example affiliate link format:
//   https://www.amazon.com/dp/PRODUCT_ID?tag=YOUR_AFFILIATE_TAG
// ============================================

// Amazon Affiliate Products Data
// Add your products here - this is where you'll manage all your affiliate links
const amazonProducts = [
    // Your first Amazon affiliate product
    {
        id: 'product-1',
        name: 'Heated Blanket',
        price: 0,
        image: 'images/Gemini_Generated_Image_lk9naalk9naalk9n.png',
        image2: 'images/Gemini_Generated_Image_lk9naalk9naalk9n.png',
        affiliateLink: 'https://amzn.to/4sKu8B6',
        category: 'home'
    }
    // Add more products here by copying the object above and updating the details
];

// ============================================
// SHOPIFY STOREFRONT INTEGRATION
// ============================================
// This system allows you to sell your own products via Shopify
// while also displaying Amazon affiliate products above

// Shopify Configuration - FORCE VALUES (DO NOT CHANGE)
// These values are hardcoded to prevent caching issues
const FORCE_STORE_NAME = 'jsigku-13';
const FORCE_API_KEY = 'c57b0c7e84c2698e9e84f065aeac9ea3';

let SHOPIFY_CONFIG = {
    store: FORCE_STORE_NAME,
    apiKey: FORCE_API_KEY,
    apiVersion: '2023-10',
    enabled: true
};

// Immediately override any cached values
SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;

console.log('🔧 SHOPIFY CONFIG INITIALIZED:', {
    store: SHOPIFY_CONFIG.store,
    apiKey: SHOPIFY_CONFIG.apiKey?.substring(0, 10) + '...',
    expectedStore: 'jsigku-13',
    expectedApiKeyStart: 'c57b0c7e84'
});

// Shopify Buy Button client
let shopifyBuyClient = null;
let shopifyBuyUI = null;

// Product Management System
let products = [];
let collections = [];

// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-center');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu && navMenu) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth scrolling for navigation links
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

// Promotional Modal
let showPromoModal = false;

function showPromo() {
    if (!showPromoModal) {
        const promoModal = document.getElementById('promo-modal');
        if (promoModal) {
            promoModal.classList.add('active');
            showPromoModal = true;
        }
    }
}

function closePromoModal() {
    const promoModal = document.getElementById('promo-modal');
    if (promoModal) {
        promoModal.classList.remove('active');
    }
}

// Show promo modal on page load after a delay
setTimeout(() => {
    showPromo();
}, 1000);

// Close promo modal when clicking outside
document.addEventListener('click', function(e) {
    const promoModal = document.getElementById('promo-modal');
    if (e.target === promoModal) {
        closePromoModal();
    }
});

// Close promo modal with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePromoModal();
    }
});

// ============================================
// NEWSLETTER SUBSCRIPTION CONFIGURATION
// ============================================
// Choose your email service:
// 1. Web3Forms (Easiest - just needs your email)
// 2. Mailchimp (Requires API key and Mailchimp account)
// 3. Formspree (Requires Formspree account)
// ============================================

const NEWSLETTER_CONFIG = {
    // Option 1: Web3Forms (Recommended - No API key needed)
    // Just replace 'YOUR_EMAIL@example.com' with your email address
    web3formsAccessKey: '', // Leave empty to use default
    
    // Option 2: Mailchimp (Requires Mailchimp account)
    // Get these from: https://mailchimp.com/developer/marketing/
    mailchimpApiKey: '', // e.g., 'your-api-key-us1'
    mailchimpAudienceId: '', // e.g., 'your-audience-id'
    mailchimpServerPrefix: '', // e.g., 'us1' (from your API key)
    
    // Option 3: Formspree (Requires Formspree account)
    formspreeEndpoint: '', // e.g., 'https://formspree.io/f/your-form-id'
    
    // Service to use: 'web3forms', 'mailchimp', or 'formspree'
    service: 'web3forms'
};

// Helper function to show messages
function showNewsletterMessage(message, isError = false) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `newsletter-message ${isError ? 'newsletter-error' : 'newsletter-success'}`;
    messageEl.textContent = message;
    
    // Insert message after the form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm && newsletterForm.parentNode) {
        newsletterForm.parentNode.insertBefore(messageEl, newsletterForm.nextSibling);
        
        // Auto-remove success messages after 5 seconds
        if (!isError) {
            setTimeout(() => {
                messageEl.remove();
            }, 5000);
        }
    }
}

// Newsletter subscription function
async function subscribeEmail() {
    const emailInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-btn');
    const email = emailInput ? emailInput.value.trim() : '';
    
    // Validation
    if (!email) {
        showNewsletterMessage('Please enter your email address', true);
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNewsletterMessage('Please enter a valid email address', true);
        return;
    }
    
    // Disable button during submission
    if (newsletterBtn) {
        newsletterBtn.disabled = true;
        newsletterBtn.textContent = 'Subscribing...';
    }
    
    try {
        let success = false;
        
        // Web3Forms (Easiest option)
        if (NEWSLETTER_CONFIG.service === 'web3forms') {
            success = await subscribeViaWeb3Forms(email);
        }
        // Mailchimp (Requires API setup)
        else if (NEWSLETTER_CONFIG.service === 'mailchimp') {
            success = await subscribeViaMailchimp(email);
        }
        // Formspree (Requires Formspree account)
        else if (NEWSLETTER_CONFIG.service === 'formspree') {
            success = await subscribeViaFormspree(email);
        }
        
        if (success) {
            showNewsletterMessage('Thank you for subscribing! Check your email for confirmation.');
            if (emailInput) {
                emailInput.value = '';
            }
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNewsletterMessage('There was an error. Please try again later.', true);
    } finally {
        // Re-enable button
        if (newsletterBtn) {
            newsletterBtn.disabled = false;
            newsletterBtn.textContent = 'Subscribe';
        }
    }
}

// Web3Forms integration (No API key needed - just uses your email)
async function subscribeViaWeb3Forms(email) {
    // Web3Forms uses your email as the access key if no key is provided
    // For better security, get a free access key from https://web3forms.com
    const accessKey = NEWSLETTER_CONFIG.web3formsAccessKey || 'default';
    
    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            access_key: accessKey,
            subject: 'New Newsletter Subscription - Future Market',
            email: email,
            message: `New subscriber: ${email}`,
            from_name: 'Future Market Newsletter'
        })
    });
    
    const result = await response.json();
    return result.success === true;
}

// Mailchimp integration (Requires Mailchimp API credentials)
async function subscribeViaMailchimp(email) {
    if (!NEWSLETTER_CONFIG.mailchimpApiKey || !NEWSLETTER_CONFIG.mailchimpAudienceId) {
        throw new Error('Mailchimp API credentials not configured');
    }
    
    const serverPrefix = NEWSLETTER_CONFIG.mailchimpServerPrefix || 'us1';
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${NEWSLETTER_CONFIG.mailchimpAudienceId}/members`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${NEWSLETTER_CONFIG.mailchimpApiKey}`
        },
        body: JSON.stringify({
            email_address: email,
            status: 'subscribed'
        })
    });
    
    const result = await response.json();
    
    // Mailchimp returns 200 for success or 400 if already subscribed
    return response.ok || result.title === 'Member Exists';
}

// Formspree integration (Requires Formspree endpoint)
async function subscribeViaFormspree(email) {
    if (!NEWSLETTER_CONFIG.formspreeEndpoint) {
        throw new Error('Formspree endpoint not configured');
    }
    
    const response = await fetch(NEWSLETTER_CONFIG.formspreeEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            _subject: 'New Newsletter Subscription - Future Market'
        })
    });
    
    return response.ok;
}

// Hero cards are now non-interactive - only hover effects remain
// Product cards use Shopify Buy Button for cart functionality

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        // Handle button click
        const newsletterBtn = newsletterForm.querySelector('.newsletter-btn');
        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                subscribeEmail();
            });
        }
        
        // Handle Enter key in input field
        const newsletterInput = newsletterForm.querySelector('.newsletter-input');
        if (newsletterInput) {
            newsletterInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    subscribeEmail();
                }
            });
        }
    }
});

// Promo modal form submission
document.addEventListener('DOMContentLoaded', function() {
    const promoSignupBtn = document.querySelector('.promo-signup-btn');
    if (promoSignupBtn) {
        promoSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneInput = document.querySelector('.promo-input');
            const phone = phoneInput ? phoneInput.value : '';
            
            if (!phone) {
                alert('Please enter your phone number');
                return;
            }
            
            alert('Thank you for signing up! You\'ll receive your 10% discount code via SMS.');
            closePromoModal();
        });
    }
});

// Sample product data structure
const sampleProducts = [
    {
        id: 'wraith-shirt',
        name: 'WRAITH SHIRT',
        price: 40.00,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: true,
        collection: 'myrtle'
    },
    {
        id: 'solstice-thermal',
        name: 'SOLSTICE THERMAL',
        price: 62.00,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: true,
        collection: 'myrtle'
    },
    {
        id: 'myrtle-thermal',
        name: 'MYRTLE THERMAL',
        price: 62.00,
        image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: true,
        collection: 'myrtle'
    },
    {
        id: 'spotlight-hoodie',
        name: 'SPOTLIGHT HOODIE',
        price: 68.00,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: false,
        collection: 'myrtle'
    },
    {
        id: 'camo-jorts',
        name: 'CAMO JORTS',
        price: 62.00,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: false,
        collection: 'myrtle'
    },
    {
        id: 'white-war-thermal',
        name: 'WHITE WAR THERMAL',
        price: 58.00,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: false,
        collection: 'featured'
    },
    {
        id: 'black-war-thermal',
        name: 'BLACK WAR THERMAL',
        price: 58.00,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: false,
        collection: 'featured'
    },
    {
        id: 'tiger-thermal',
        name: 'TIGER THERMAL',
        price: 62.00,
        image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: false,
        collection: 'featured'
    },
    {
        id: 'black-leopard-crewneck',
        name: 'BLACK LEOPARD CREWNECK',
        price: 68.00,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: true,
        collection: 'featured'
    },
    {
        id: 'black-leopard-sweats',
        name: 'BLACK LEOPARD SWEATS',
        price: 62.00,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        soldOut: false,
        collection: 'featured'
    }
];

// Function to render products dynamically
function renderProducts(containerSelector, productFilter = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let productsToRender = products;
    if (productFilter) {
        productsToRender = products.filter(product => product.collection === productFilter);
    }

    // Keep empty spaces blank - don't show any message
    if (productsToRender.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = productsToRender.map((product, index) => {
        const originalPrice = product.compareAtPrice || product.price * 1.5; // Use compareAtPrice or calculate 50% off
        const isOnSale = originalPrice > product.price;
        const image2 = product.images && product.images.length > 1 ? product.images[1] : product.image;
        
        return `
        <div class="product-card" data-product-id="${product.id}" data-product-handle="${product.handle || ''}">
            ${isOnSale && !product.soldOut ? '<div class="sale-badge">Sale</div>' : ''}
            ${product.soldOut ? '<div class="sold-out-badge">Sold Out</div>' : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" />
                <img src="${image2}" alt="${product.name}" />
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-container">
                    ${isOnSale ? `<span class="product-price-original">$${originalPrice.toFixed(2)} USD</span>` : ''}
                    <span class="product-price-usd">$${product.price.toFixed(2)} USD</span>
                </div>
            </div>
            ${product.handle ? `<div class="shopify-buy-button" id="buy-button-${product.id}-${index}" data-product-handle="${product.handle}"></div>` : ''}
        </div>
    `;
    }).join('');

    // Re-attach event listeners to new product cards
    attachProductCardListeners(containerSelector);
    
    // Create Shopify Buy Buttons if available
    if (shopifyBuyUI) {
        setTimeout(() => createBuyButtonsForProducts(), 100);
    }
}

// Function to render products organized by collections
function renderProductsByCollections() {
    // Group products by collection
    const productsByCollection = {};
    
    products.forEach(product => {
        const collectionName = product.collectionName || 'Other';
        if (!productsByCollection[collectionName]) {
            productsByCollection[collectionName] = [];
        }
        productsByCollection[collectionName].push(product);
    });

    // Render first collection in the main section
    const firstCollection = Object.keys(productsByCollection)[0];
    if (firstCollection) {
        const collectionSection = document.querySelector('.collection-section');
        if (collectionSection) {
            const title = collectionSection.querySelector('.section-title');
            if (title) {
                title.textContent = firstCollection.toUpperCase();
            }
        }
        
        const mainGrid = document.querySelector('.collection-section .product-grid');
        if (mainGrid) {
            renderCollectionProducts(mainGrid, productsByCollection[firstCollection], firstCollection);
        }
    }

    // Render featured products
    const featuredProducts = products.filter(p => p.collection === 'featured' || p.tags?.includes('featured'));
    if (featuredProducts.length > 0) {
        const featuredGrid = document.querySelector('.featured-section .product-grid');
        if (featuredGrid) {
            const featuredTitle = document.querySelector('.featured-section .section-title');
            if (featuredTitle) {
                featuredTitle.textContent = 'FEATURED PRODUCTS';
            }
            renderCollectionProducts(featuredGrid, featuredProducts, 'Featured');
        }
    } else {
        // If no featured products, show second collection
        const secondCollection = Object.keys(productsByCollection)[1];
        if (secondCollection) {
            const featuredGrid = document.querySelector('.featured-section .product-grid');
            if (featuredGrid) {
                const featuredTitle = document.querySelector('.featured-section .section-title');
                if (featuredTitle) {
                    featuredTitle.textContent = secondCollection.toUpperCase();
                }
                renderCollectionProducts(featuredGrid, productsByCollection[secondCollection], secondCollection);
            }
        }
    }
}

// Function to render products for a specific collection
function renderCollectionProducts(container, productsToRender, collectionName) {
    if (!container) return;

    // Keep empty spaces blank - don't show any message
    if (productsToRender.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = productsToRender.map((product, index) => {
        const originalPrice = product.compareAtPrice || product.price * 1.5; // Use compareAtPrice or calculate 50% off
        const isOnSale = originalPrice > product.price;
        const image2 = product.images && product.images.length > 1 ? product.images[1] : product.image;
        
        return `
        <div class="product-card" data-product-id="${product.id}" data-product-handle="${product.handle || ''}">
            ${isOnSale && !product.soldOut ? '<div class="sale-badge">Sale</div>' : ''}
            ${product.soldOut ? '<div class="sold-out-badge">Sold Out</div>' : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" />
                <img src="${image2}" alt="${product.name}" />
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-container">
                    ${isOnSale ? `<span class="product-price-original">$${originalPrice.toFixed(2)} USD</span>` : ''}
                    <span class="product-price-usd">$${product.price.toFixed(2)} USD</span>
                </div>
            </div>
            ${product.handle ? `<div class="shopify-buy-button" id="buy-button-${product.id}-${index}" data-product-handle="${product.handle}"></div>` : ''}
        </div>
    `;
    }).join('');

    // Re-attach event listeners - pass the container element directly
    attachProductCardListenersToContainer(container);
    
    // Create Shopify Buy Buttons if available
    if (shopifyBuyUI) {
        setTimeout(() => createBuyButtonsForProducts(), 100);
    }
}

// Function to attach event listeners to product cards (accepts selector string)
function attachProductCardListeners(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    attachProductCardListenersToContainer(container);
}

// Function to create Shopify Buy Buttons for products
function createBuyButtonsForProducts() {
    if (!shopifyBuyUI) {
        console.log('⏳ Shopify Buy UI not ready yet');
        return;
    }

    document.querySelectorAll('.shopify-buy-button').forEach((buttonContainer, index) => {
        // Skip if button already created
        if (buttonContainer.hasAttribute('data-button-created')) {
            return;
        }

        const productHandle = buttonContainer.getAttribute('data-product-handle');
        if (!productHandle) {
            console.log('⚠️ No product handle found for buy button');
            return;
        }

        try {
            // Create product component but hide everything except the button
            shopifyBuyUI.createComponent('product', {
                handle: productHandle,
                node: buttonContainer,
                moneyFormat: '${{amount}}',
                options: {
                    product: {
                        contents: {
                            img: false,
                            imgWithCarousel: false,
                            title: false,
                            price: false,
                            button: true,
                            buttonWithQuantity: false
                        },
                        styles: {
                            button: {
                                'background-color': '#000000',
                                ':hover': {
                                    'background-color': '#000000'
                                },
                                ':focus': {
                                    'background-color': '#000000'
                                },
                                'width': '100%',
                                'margin': '0'
                            }
                        },
                        text: {
                            button: 'Add to cart'
                        }
                    },
                    cart: {
                        styles: {
                            button: {
                                'background-color': '#000000',
                                ':hover': {
                                    'background-color': '#000000'
                                }
                            }
                        },
                        text: {
                            button: 'Checkout'
                        }
                    },
                    toggle: {
                        styles: {
                            toggle: {
                                'background-color': '#000000',
                                ':hover': {
                                    'background-color': '#000000'
                                }
                            }
                        }
                    }
                }
            });
            
            // Mark as created
            buttonContainer.setAttribute('data-button-created', 'true');
        } catch (error) {
            console.error('Error creating buy button for', productHandle, error);
        }
    });
}

// Function to attach event listeners to product cards (accepts container element)
function attachProductCardListenersToContainer(container) {
    if (!container) return;

    // Don't add click handlers if Shopify Buy Button is enabled
    // The buy buttons will handle the cart functionality
    if (shopifyBuyUI) {
        return;
    }

    container.querySelectorAll('.product-card').forEach(card => {
        // Remove any existing event listeners by cloning
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Add click handler
        newCard.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-product-id');
            if (!productId) {
                console.error('No product ID found on card');
                return;
            }
            
            const product = products.find(p => p.id === productId);
            
            if (!product) {
                console.error('Product not found:', productId);
                return;
            }
            
            if (product.soldOut) {
                alert('This product is currently sold out.');
                return;
            }
            
            // Product cards use Shopify Buy Button for cart functionality
        });
        
        // Add cursor pointer
        newCard.style.cursor = 'pointer';
        
        // Add hover effects
        newCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        newCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Function to import products from external source
function importProducts(productData) {
    try {
        // Validate product data structure
        if (!Array.isArray(productData)) {
            throw new Error('Product data must be an array');
        }

        // Validate each product has required fields
        for (let product of productData) {
            if (!product.id || !product.name || !product.price) {
                throw new Error('Each product must have id, name, and price');
            }
        }

        // Replace products array
        products = productData;
        
        // Re-render products organized by collections
        if (products.length > 0 && products.some(p => p.collectionName)) {
            renderProductsByCollections();
        } else {
            // Fallback to old method if no collection names
            renderProducts('.collection-section .product-grid', 'myrtle');
            renderProducts('.featured-section .product-grid', 'featured');
        }
        
        console.log(`Successfully imported ${productData.length} products!`);
        return true;
        
    } catch (error) {
        console.error('Error importing products:', error.message);
        return false;
    }
}

// Function to add a single product
function addProduct(product) {
    // Validate product structure
    if (!product.id || !product.name || !product.price) {
        console.error('Product must have id, name, and price');
        return false;
    }

    // Check if product already exists
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex !== -1) {
        // Update existing product
        products[existingIndex] = { ...products[existingIndex], ...product };
    } else {
        // Add new product
        products.push(product);
    }

    // Re-render product sections
    renderProducts('.collection-section .product-grid', 'myrtle');
    renderProducts('.featured-section .product-grid', 'featured');
    
    return true;
}

// Function to remove a product
function removeProduct(productId) {
    products = products.filter(p => p.id !== productId);
    
    // Re-render product sections
    renderProducts('.collection-section .product-grid', 'myrtle');
    renderProducts('.featured-section .product-grid', 'featured');
    
    return true;
}

// Function to update product stock status
function updateProductStock(productId, soldOut) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.soldOut = soldOut;
        
        // Re-render product sections
        renderProducts('.collection-section .product-grid', 'myrtle');
        renderProducts('.featured-section .product-grid', 'featured');
        
        return true;
    }
    return false;
}

// Function to get products by collection
function getProductsByCollection(collection) {
    return products.filter(product => product.collection === collection);
}

// Function to search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.id.toLowerCase().includes(searchTerm)
    );
}


// Shopify API Integration - Fetch products from collections
async function fetchProductsFromShopify() {
    if (!SHOPIFY_CONFIG.enabled) {
        console.log('Shopify integration disabled. Using sample data.');
        return false;
    }

    try {
        // Try fetching products directly first (simpler, requires fewer permissions)
        const productsQuery = `
            query {
                products(first: 50) {
                    edges {
                        node {
                            id
                            title
                            handle
                            description
                            images(first: 2) {
                                edges {
                                    node {
                                        url
                                    }
                                }
                            }
                            variants(first: 1) {
                                edges {
                                    node {
                                        price {
                                            amount
                                        }
                                        compareAtPrice {
                                            amount
                                        }
                                        availableForSale
                                    }
                                }
                            }
                            tags
                        }
                    }
                }
            }
        `;

        // First, try to get products directly
        // Force use of current config - don't allow any cached values
        SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
        SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
        
        const apiUrl = `https://${FORCE_STORE_NAME}.myshopify.com/api/2023-10/graphql.json`;
        console.log('🌐 Fetching products from:', apiUrl);
        console.log('🔑 Using API key:', FORCE_API_KEY.substring(0, 10) + '...');
        console.log('📋 Current SHOPIFY_CONFIG:', {
            store: SHOPIFY_CONFIG.store,
            apiKey: SHOPIFY_CONFIG.apiKey?.substring(0, 10) + '...'
        });
        
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': FORCE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: productsQuery })
        });

        if (response.ok) {
            const data = await response.json();
            const allProducts = [];
            
            if (data.data?.products?.edges) {
                data.data.products.edges.forEach(productEdge => {
                    const product = productEdge.node;
                    const variant = product.variants.edges[0]?.node;
                    const images = product.images.edges || [];
                    const primaryImage = images[0]?.node;
                    const secondaryImage = images[1]?.node || primaryImage;
                    
                    // Determine collection assignment
                    let productCollection = 'myrtle';
                    if (product.tags.includes('featured')) {
                        productCollection = 'featured';
                    }
                    
                    allProducts.push({
                        id: product.id.split('/').pop(),
                        name: product.title.toUpperCase(),
                        price: parseFloat(variant?.price?.amount || 0),
                        compareAtPrice: variant?.compareAtPrice?.amount ? parseFloat(variant.compareAtPrice.amount) : null,
                        image: primaryImage?.url || 'https://via.placeholder.com/400x400',
                        images: images.map(img => img.node.url),
                        soldOut: !variant?.availableForSale || false,
                        collection: productCollection,
                        description: product.description,
                        handle: product.handle,
                        tags: product.tags,
                        collectionName: 'All Products'
                    });
                });
            }

            // Import the products
            importProducts(allProducts);
            console.log(`✅ Successfully loaded ${allProducts.length} products directly from Shopify!`);
            return true;
        }

        // If direct products query fails, try collections query (fallback)
        console.log('⚠️ Direct products query failed, trying collections query...');
        const collectionsQuery = `
            query {
                collections(first: 20) {
                    edges {
                        node {
                            id
                            title
                            handle
                            products(first: 50) {
                                edges {
                                    node {
                                        id
                                        title
                                        handle
                                        description
                                        images(first: 2) {
                                            edges {
                                                node {
                                                    url
                                                }
                                            }
                                        }
                                        variants(first: 1) {
                                            edges {
                                                node {
                                                    price {
                                                        amount
                                                    }
                                                    compareAtPrice {
                                                        amount
                                                    }
                                                    availableForSale
                                                }
                                            }
                                        }
                                        tags
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        // Use explicit values for collections query too
        SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
        SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
        
        const collectionsUrl = `https://${FORCE_STORE_NAME}.myshopify.com/api/2023-10/graphql.json`;
        console.log('🌐 Fetching collections from:', collectionsUrl);
        
        response = await fetch(collectionsUrl, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': FORCE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: collectionsQuery })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shopify API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                response: errorText,
                store: SHOPIFY_CONFIG.store,
                apiKeyLength: SHOPIFY_CONFIG.apiKey?.length
            });
            throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // Extract products from all collections
        const allProducts = [];
        
        if (data.data?.collections?.edges) {
            data.data.collections.edges.forEach(collectionEdge => {
                const collection = collectionEdge.node;
                const collectionName = collection.title.toLowerCase();
                
                if (collection.products?.edges) {
                    collection.products.edges.forEach(productEdge => {
                        const product = productEdge.node;
                        const variant = product.variants.edges[0]?.node;
                        const images = product.images.edges || [];
                        const primaryImage = images[0]?.node;
                        const secondaryImage = images[1]?.node || primaryImage;
                        
                        // Determine collection assignment
                        let productCollection = 'myrtle';
                        if (product.tags.includes('featured') || collectionName.includes('featured')) {
                            productCollection = 'featured';
                        } else if (collectionName.includes('myrtle')) {
                            productCollection = 'myrtle';
                        }
                        
                        allProducts.push({
                            id: product.id.split('/').pop(), // Extract ID from GraphQL ID
                            name: product.title.toUpperCase(),
                            price: parseFloat(variant?.price?.amount || 0),
                            compareAtPrice: variant?.compareAtPrice?.amount ? parseFloat(variant.compareAtPrice.amount) : null,
                            image: primaryImage?.url || 'https://via.placeholder.com/400x400',
                            images: images.map(img => img.node.url),
                            soldOut: !variant?.availableForSale || false,
                            collection: productCollection,
                            description: product.description,
                            handle: product.handle,
                            tags: product.tags,
                            collectionName: collection.title
                        });
                    });
                }
            });
        }

        // Remove duplicates (products might be in multiple collections)
        const uniqueProducts = [];
        const seenIds = new Set();
        
        allProducts.forEach(product => {
            if (!seenIds.has(product.id)) {
                seenIds.add(product.id);
                uniqueProducts.push(product);
            }
        });

        // Import the products
        importProducts(uniqueProducts);
        console.log(`✅ Successfully loaded ${uniqueProducts.length} products from ${data.data?.collections?.edges?.length || 0} collections!`);
        return true;

    } catch (error) {
        console.error('❌ Error fetching products from Shopify:', error.message);
        console.log('🔄 Falling back to sample data...');
        return false;
    }
}

// Shopify Collections Integration
async function fetchCollectionsFromShopify() {
    if (!SHOPIFY_CONFIG.enabled) return false;

    try {
        // Use Storefront API for collections to avoid CORS issues
        const query = `
            query {
                collections(first: 20) {
                    edges {
                        node {
                            id
                            title
                            handle
                            image {
                                url
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch(`https://${SHOPIFY_CONFIG.store}.myshopify.com/api/2023-10/graphql.json`, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shopify Collections API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                response: errorText
            });
            throw new Error(`Shopify Collections API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        collections = data.data.collections.edges.map(edge => ({
            id: edge.node.id.split('/').pop(),
            title: edge.node.title,
            handle: edge.node.handle,
            image: edge.node.image?.url || 'https://via.placeholder.com/400x300'
        }));

        console.log(`✅ Successfully loaded ${collections.length} collections from Shopify!`);
        return true;

    } catch (error) {
        console.error('❌ Error fetching collections from Shopify:', error.message);
        return false;
    }
}

// ============================================
// AMAZON PRODUCT RENDERING FUNCTIONS
// ============================================

// Render Amazon affiliate products
function renderAmazonProducts() {
    const productGrid = document.getElementById('amazon-products-grid');
    if (!productGrid) {
        console.error('⚠️ Product grid not found. Make sure id="amazon-products-grid" exists in HTML.');
        return;
    }

    console.log(`🔄 Rendering ${amazonProducts.length} Amazon products...`);

    if (amazonProducts.length === 0) {
        productGrid.innerHTML = '';
        console.log('📦 No Amazon products to display. Add products to the amazonProducts array in script.js');
        return;
    }

    productGrid.innerHTML = amazonProducts.map((product) => {
        const isOnSale = product.originalPrice && product.originalPrice > product.price;
        const image2 = product.image2 || product.image;
        const showPrice = product.price > 0;
        
        return `
            <div class="product-card amazon-product-card" data-product-id="${product.id}">
                ${isOnSale ? '<div class="sale-badge">Sale</div>' : ''}
                <a href="${product.affiliateLink}" target="_blank" rel="nofollow sponsored" class="product-link">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" />
                        <img src="${image2}" alt="${product.name}" />
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        ${showPrice ? `
                        <div class="product-price-container">
                            ${isOnSale ? `<span class="product-price-original">$${product.originalPrice.toFixed(2)} USD</span>` : ''}
                            <span class="product-price-usd">$${product.price.toFixed(2)} USD</span>
                        </div>
                        ` : ''}
                        <div class="amazon-badge">View on Amazon →</div>
                    </div>
                </a>
            </div>
        `;
    }).join('');

    console.log(`✅ Rendered ${amazonProducts.length} Amazon affiliate products`);
}

// Initialize Amazon products on page load
function initializeAmazonProducts() {
    renderAmazonProducts();
}

// Render Shopify products to the shopify section
function renderShopifyProducts() {
    const productGrid = document.getElementById('shopify-products-grid');
    if (!productGrid) {
        console.log('⚠️ Shopify product grid not found');
        return;
    }

    if (products.length === 0) {
        productGrid.innerHTML = '';
        console.log('📦 No Shopify products to display.');
        return;
    }

    productGrid.innerHTML = products.map((product, index) => {
        const originalPrice = product.compareAtPrice || product.price * 1.5;
        const isOnSale = originalPrice > product.price;
        const image2 = product.images && product.images.length > 1 ? product.images[1] : product.image;
        
        return `
            <div class="product-card shopify-product-card" data-product-id="${product.id}" data-product-handle="${product.handle || ''}">
                ${isOnSale && !product.soldOut ? '<div class="sale-badge">Sale</div>' : ''}
                ${product.soldOut ? '<div class="sold-out-badge">Sold Out</div>' : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" />
                    <img src="${image2}" alt="${product.name}" />
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price-container">
                        ${isOnSale ? `<span class="product-price-original">$${originalPrice.toFixed(2)} USD</span>` : ''}
                        <span class="product-price-usd">$${product.price.toFixed(2)} USD</span>
                    </div>
                </div>
                ${product.handle ? `<div class="shopify-buy-button" id="buy-button-${product.id}-${index}" data-product-handle="${product.handle}"></div>` : ''}
            </div>
        `;
    }).join('');

    // Create Shopify Buy Buttons if available
    if (shopifyBuyUI) {
        setTimeout(() => createBuyButtonsForProducts(), 100);
    }

    console.log(`✅ Rendered ${products.length} Shopify products`);
}

// Test Shopify API connection
async function testShopifyConnection() {
    // Force use of correct values
    SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
    SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
    
    console.log('🔍 Testing Shopify API connection...');
    console.log('Store:', FORCE_STORE_NAME);
    console.log('Full Store URL:', `https://${FORCE_STORE_NAME}.myshopify.com`);
    console.log('API Key (first 10 chars):', FORCE_API_KEY.substring(0, 10) + '...');
    console.log('API Key length:', FORCE_API_KEY.length);
    
    try {
        // Simple test query
        const testQuery = `
            query {
                shop {
                    name
                }
            }
        `;
        
        const testUrl = `https://${FORCE_STORE_NAME}.myshopify.com/api/2023-10/graphql.json`;
        console.log('🌐 Test URL:', testUrl);
        
        const response = await fetch(testUrl, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': FORCE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: testQuery })
        });
        
        const responseText = await response.text();
        console.log('Test Response Status:', response.status);
        console.log('Test Response:', responseText);
        
        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ API Connection successful! Shop name:', data.data?.shop?.name);
            return true;
        } else {
            console.error('❌ API Connection failed:', response.status, responseText);
            return false;
        }
    } catch (error) {
        console.error('❌ Connection test error:', error);
        return false;
    }
}

// Initialize Shopify products
async function initializeShopifyProducts() {
    if (!SHOPIFY_CONFIG.enabled) {
        console.log('📦 Shopify integration disabled.');
        return;
    }

    // Test connection first
    const connectionOk = await testShopifyConnection();
    if (!connectionOk) {
        console.log('⚠️ API connection test failed. Please check your credentials.');
        return;
    }

    // Try to load from Shopify
    const shopifyLoaded = await fetchProductsFromShopify();
    
    if (shopifyLoaded && products.length > 0) {
        renderShopifyProducts();
    } else {
        const productGrid = document.getElementById('shopify-products-grid');
        if (productGrid) {
            productGrid.innerHTML = '';
        }
    }
}

// Initialize Shopify Buy Button - MANUAL INITIALIZATION
function initializeShopifyBuyButton() {
    if (!window.ShopifyBuy) {
        console.log('⏳ Waiting for Shopify Buy Button SDK to load...');
        setTimeout(initializeShopifyBuyButton, 100);
        return;
    }

    // Force correct credentials before creating client
    SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
    SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
    
    console.log('🔧 Manually initializing Shopify Buy Button with:', {
        store: FORCE_STORE_NAME,
        apiKeyLength: FORCE_API_KEY.length
    });

    // Ensure we have the correct values
    if (!FORCE_STORE_NAME || !FORCE_API_KEY) {
        console.error('❌ Cannot initialize: Missing store name or API key');
        return;
    }

    // Manually create the client with correct credentials
    if (window.ShopifyBuy.UI) {
        createShopifyBuyClient();
    } else {
        // Wait for UI to be ready, then create client
        window.ShopifyBuy.onReady = function() {
            console.log('✅ Shopify Buy SDK UI ready, creating client...');
            createShopifyBuyClient();
        };
    }
}

function createShopifyBuyClient() {
    // CRITICAL: Force use of correct values - no caching allowed
    SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
    SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
    
    if (!FORCE_STORE_NAME || !FORCE_API_KEY) {
        console.error('❌ Cannot create client: Missing credentials');
        return;
    }

    const domain = `${FORCE_STORE_NAME}.myshopify.com`;
    
    console.log('🔧 Creating Shopify Buy Client MANUALLY:', {
        domain: domain,
        apiKey: FORCE_API_KEY.substring(0, 10) + '...',
        apiKeyLength: FORCE_API_KEY.length
    });

    // Double-check we're not using any cached values
    if (SHOPIFY_CONFIG.store !== FORCE_STORE_NAME) {
        console.warn('⚠️ Store mismatch! Forcing correct value...');
        SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
    }
    
    if (SHOPIFY_CONFIG.apiKey !== FORCE_API_KEY) {
        console.warn('⚠️ API key mismatch! Forcing correct value...');
        SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
    }

    try {
        // Build client with explicit values - no config object
        shopifyBuyClient = ShopifyBuy.buildClient({
            domain: domain,
            storefrontAccessToken: FORCE_API_KEY
        });
        
        console.log('✅ Shopify Buy Client created successfully with:', domain);

        ShopifyBuy.UI.onReady(shopifyBuyClient).then(function(ui) {
            shopifyBuyUI = ui;
            console.log('✅ Shopify Buy Button initialized');
            // Create buy buttons for existing products
            createBuyButtonsForProducts();
        });
    } catch (error) {
        console.error('❌ Error initializing Shopify Buy Button:', error);
    }
}

// Save Shopify credentials to localStorage
function saveShopifyCredentials(storeName, apiKey) {
    try {
        localStorage.setItem('shopify_store', storeName);
        localStorage.setItem('shopify_api_key', apiKey);
        localStorage.setItem('shopify_enabled', 'true');
        console.log('✅ Shopify credentials saved');
    } catch (error) {
        console.error('❌ Error saving credentials:', error);
    }
}

// Load Shopify credentials from localStorage
function loadShopifyCredentials() {
    try {
        const store = localStorage.getItem('shopify_store');
        const apiKey = localStorage.getItem('shopify_api_key');
        const enabled = localStorage.getItem('shopify_enabled') === 'true';
        
        if (store && apiKey && enabled) {
            return { store, apiKey, enabled };
        }
        return null;
    } catch (error) {
        console.error('❌ Error loading credentials:', error);
        return null;
    }
}

// Clear saved Shopify credentials
function clearShopifyCredentials() {
    try {
        localStorage.removeItem('shopify_store');
        localStorage.removeItem('shopify_api_key');
        localStorage.removeItem('shopify_enabled');
        console.log('✅ Shopify credentials cleared');
    } catch (error) {
        console.error('❌ Error clearing credentials:', error);
    }
}

// Function to enable Shopify integration
function enableShopifyIntegration(storeName, apiKey, saveCredentials = true) {
    SHOPIFY_CONFIG.store = storeName;
    SHOPIFY_CONFIG.apiKey = apiKey;
    SHOPIFY_CONFIG.enabled = true;

    // Save credentials to localStorage for persistence
    if (saveCredentials) {
        saveShopifyCredentials(storeName, apiKey);
    }

    console.log('🔄 Shopify integration enabled. Reloading products...');
    initializeShopifyProducts();
    
    // Initialize Buy Button
    initializeShopifyBuyButton();
}

// Function to disable Shopify integration
function disableShopifyIntegration() {
    SHOPIFY_CONFIG.enabled = false;
    console.log('📦 Shopify integration disabled.');
    products = [];
    // Clear product grids
    const collectionGrid = document.querySelector('.collection-section .product-grid');
    const featuredGrid = document.querySelector('.featured-section .product-grid');
    if (collectionGrid) collectionGrid.innerHTML = '';
    if (featuredGrid) featuredGrid.innerHTML = '';
}

// Initialize both Amazon and Shopify products on page load
document.addEventListener('DOMContentLoaded', function() {
    // CRITICAL: Force config values BEFORE anything else runs
    SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
    SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
    SHOPIFY_CONFIG.enabled = true;
    
    console.log('🚀 DOMContentLoaded - FORCING CONFIG:', {
        store: FORCE_STORE_NAME,
        apiKey: FORCE_API_KEY.substring(0, 10) + '...',
        expectedUrl: `https://${FORCE_STORE_NAME}.myshopify.com`
    });
    
    // Initialize Amazon affiliate products (always show)
    initializeAmazonProducts();
    
    // IMPORTANT: Clear localStorage again (in case SDK tried to use it)
    try {
        localStorage.removeItem('shopify_store');
        localStorage.removeItem('shopify_api_key');
        localStorage.removeItem('shopify_enabled');
        console.log('🧹 Cleared localStorage again in DOMContentLoaded');
    } catch (e) {
        console.log('⚠️ Could not clear localStorage:', e);
    }
    
    // Force config again after clearing
    SHOPIFY_CONFIG.store = FORCE_STORE_NAME;
    SHOPIFY_CONFIG.apiKey = FORCE_API_KEY;
    
    console.log('📋 Final Config Verification:', {
        store: SHOPIFY_CONFIG.store,
        matches: SHOPIFY_CONFIG.store === FORCE_STORE_NAME,
        apiKeyMatches: SHOPIFY_CONFIG.apiKey === FORCE_API_KEY,
        expectedUrl: `https://${FORCE_STORE_NAME}.myshopify.com`
    });
    
    // Our Store uses the themed buy-button embed in index.html (product-component-1769097705122).
    // Shopify product fetch + dynamic buy buttons are disabled.
});

// Add hover effects to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add hover effects to hero cards
document.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
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
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.product-card, .hero-card, .section-title');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add loading animation to buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.disabled) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #000, #333);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
createScrollProgress();
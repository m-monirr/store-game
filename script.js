// Game data
const games = [
    {
        id: 1,
        title: "Cyber Adventure",
        genre: "action",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 2,
        title: "Fantasy Quest",
        genre: "rpg",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 3,
        title: "Space Explorers",
        genre: "adventure",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 4,
        title: "Football Pro",
        genre: "sports",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 5,
        title: "Ancient Empires",
        genre: "strategy",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 6,
        title: "Zombie Survival",
        genre: "action",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
];

// DOM elements
const gamesContainer = document.getElementById('gamesContainer');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const genreFilter = document.getElementById('genreFilter');
const priceFilter = document.getElementById('priceFilter');
const cartCount = document.querySelector('.cart-count');

// Cart state
let cart = [];

// Display games
function displayGames(gamesToDisplay) {
    gamesContainer.innerHTML = '';
    
    gamesToDisplay.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="game-image">
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <span class="game-genre">${game.genre}</span>
                <p class="game-price">$${game.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${game.id}">Add to Cart</button>
            </div>
        `;
        gamesContainer.appendChild(gameCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const gameId = parseInt(e.target.getAttribute('data-id'));
    const game = games.find(g => g.id === gameId);
    
    // Check if game is already in cart
    const existingItem = cart.find(item => item.id === gameId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...game,
            quantity: 1
        });
    }
    
    updateCart();
}

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} (${item.quantity}x)</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
            
            total += item.price * item.quantity;
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
}

// Remove from cart function
function removeFromCart(e) {
    const gameId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== gameId);
    updateCart();
}

// Filter games
function filterGames() {
    const genreValue = genreFilter.value;
    const priceValue = priceFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    
    let filteredGames = games;
    
    // Filter by genre
    if (genreValue !== 'all') {
        filteredGames = filteredGames.filter(game => game.genre === genreValue);
    }
    
    // Filter by price
    if (priceValue !== 'all') {
        const [min, max] = priceValue.split('-').map(Number);
        
        if (priceValue.endsWith('+')) {
            filteredGames = filteredGames.filter(game => game.price >= 60);
        } else {
            filteredGames = filteredGames.filter(game => game.price >= min && game.price <= max);
        }
    }
    
    // Filter by search
    if (searchValue) {
        filteredGames = filteredGames.filter(game => 
            game.title.toLowerCase().includes(searchValue)
    }
    
    displayGames(filteredGames);
}

// Event listeners
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

searchBtn.addEventListener('click', filterGames);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filterGames();
    }
});

genreFilter.addEventListener('change', filterGames);
priceFilter.addEventListener('change', filterGames);

// Initialize
displayGames(games);
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const productGrid = document.getElementById('product-grid');

// Format price to IDR
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price);
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm overflow-hidden flex flex-col';
    card.innerHTML = `
        <div class="relative">
            <img src="${product.image || 'assets/placeholder.jpg'}" alt="${product.name}" class="w-full h-48 object-cover">
            <button class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                <i class="far fa-heart text-[#4B7F52]"></i>
            </button>
            ${product.theme ? `<span class="absolute top-2 left-2 bg-[#4B7F52] text-white text-xs font-semibold px-2 py-1 rounded-full">${product.theme}</span>` : ''}
        </div>
        <div class="p-4 flex flex-col flex-grow">
            <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
            <p class="text-gray-600 text-sm mb-4 flex-grow">${product.description || 'No description available.'}</p>
            <div class="flex justify-between items-center mt-auto">
                <span class="text-[#4B7F52] font-bold">${formatPrice(product.price)}</span>
                <button class="bg-[#4B7F52] text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Buy Now
                </button>
            </div>
        </div>
    `;
    return card;
}

// Load products
async function loadProducts() {
    try {
        const snapshot = await db.collection('products')
            .where('stock', '>', 0)
            .orderBy('stock', 'desc')
            .orderBy('createdAt', 'desc')
            .get();

        productGrid.innerHTML = '';
        
        if (snapshot.empty) {
            productGrid.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">No products available at the moment.</p>
                </div>
            `;
            return;
        }

        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data() };
            const card = createProductCard(product);
            productGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-red-500">Error loading products. Please try again later.</p>
            </div>
        `;
    }
}

// Add to wishlist functionality
function toggleWishlist(productId) {
    // Implement wishlist functionality here
    console.log('Toggle wishlist for product:', productId);
}

// Initialize page
document.addEventListener('DOMContentLoaded', loadProducts);
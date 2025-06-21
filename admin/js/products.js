// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('products-table-body');

// Open modal for adding new product
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    productForm.reset();
    productModal.style.display = 'flex';
}

// Open modal for editing product
function openEditProductModal(product) {
    document.getElementById('modalTitle').textContent = 'Edit Product';
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description;
    // Store product ID for updating
    productForm.dataset.productId = product.id;
    productModal.style.display = 'flex';
}

// Close modal
function closeProductModal() {
    productModal.style.display = 'none';
    productForm.reset();
    delete productForm.dataset.productId;
}

// Format price to IDR
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price);
}

// Handle form submission
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        theme: document.getElementById('productTheme').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const imageFile = document.getElementById('productImage').files[0];
    
    try {
        if (imageFile) {
            // Upload image to Firebase Storage
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`products/${Date.now()}_${imageFile.name}`);
            const snapshot = await imageRef.put(imageFile);
            const imageUrl = await snapshot.ref.getDownloadURL();
            productData.image = imageUrl;
        }

        if (productForm.dataset.productId) {
            // Update existing product
            await db.collection('products').doc(productForm.dataset.productId).update(productData);
        } else {
            // Add new product
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(productData);
        }

        closeProductModal();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product. Please try again.');
    }
});

// Delete product
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await db.collection('products').doc(productId).delete();
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    }
}

// Load products
async function loadProducts() {
    try {
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        productsTableBody.innerHTML = '';
        
        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data() };
            const row = document.createElement('tr');
            row.className = 'border-t border-gray-200';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" class="h-12 w-12 object-cover rounded">
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold">${product.name}</div>
                    <div class="text-sm text-gray-500">${product.description}</div>
                    <div class="text-xs text-[#4B7F52]">Tema: ${product.theme}</div>
                </td>
                <td class="px-6 py-4">${formatPrice(product.price)}
                </td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="openEditProductModal(${JSON.stringify(product)})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Error loading products. Please try again.');
    }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);
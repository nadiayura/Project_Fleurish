// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to format currency in IDR
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

// Function to update statistics
async function updateStatistics() {
    try {
        // Get orders statistics
        const ordersSnapshot = await db.collection('orders').get();
        const totalOrders = ordersSnapshot.size;
        
        // Get products statistics
        const productsSnapshot = await db.collection('products').get();
        let totalStock = 0;
        productsSnapshot.forEach(doc => {
            totalStock += doc.data().stock || 0;
        });

        // Get revenue statistics
        let totalRevenue = 0;
        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            if (order.status === 'completed') {
                totalRevenue += order.total || 0;
            }
        });

        // Update statistics in the UI
        document.querySelector('#total-orders').textContent = totalOrders;
        document.querySelector('#total-stock').textContent = totalStock;
        document.querySelector('#total-revenue').textContent = formatCurrency(totalRevenue);

        // Update order status counts
        const orderStatusCounts = {
            'pending': 0,
            'shipping': 0,
            'completed': 0,
            'cancelled': 0
        };

        ordersSnapshot.forEach(doc => {
            const status = doc.data().status;
            if (status in orderStatusCounts) {
                orderStatusCounts[status]++;
            }
        });

        // Update order status in the UI
        document.querySelector('#orders-pending').textContent = orderStatusCounts.pending;
        document.querySelector('#orders-shipping').textContent = orderStatusCounts.shipping;
        document.querySelector('#orders-completed').textContent = orderStatusCounts.completed;
        document.querySelector('#orders-cancelled').textContent = orderStatusCounts.cancelled;

    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

// Function to initialize sales chart
function initializeSalesChart() {
    // Here you would implement your chart using a library like Chart.js
    // For now, we'll leave this as a placeholder
    console.log('Chart initialization would go here');
}

// Update statistics when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateStatistics();
    initializeSalesChart();
});

// Update statistics every 5 minutes
setInterval(updateStatistics, 5 * 60 * 1000);
// Theme and UI interactions

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('translate-x-0');
    sidebar.classList.toggle('-translate-x-full');
}

// Initialize responsive behaviors
function initializeResponsive() {
    const sidebar = document.getElementById('sidebar');
    
    // Add mobile classes to sidebar
    if (window.innerWidth < 768) {
        sidebar.classList.add('transform', '-translate-x-full', 'transition-transform', 'duration-300', 'ease-in-out', 'z-50');
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('transform', '-translate-x-full', 'transition-transform', 'duration-300', 'ease-in-out', 'z-50');
        } else {
            sidebar.classList.add('transform', '-translate-x-full', 'transition-transform', 'duration-300', 'ease-in-out', 'z-50');
        }
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', e => {
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-800 text-white text-sm px-2 py-1 rounded-lg -mt-8 -ml-2 opacity-0 transition-opacity duration-200';
            tooltip.textContent = element.getAttribute('data-tooltip');
            element.appendChild(tooltip);
            setTimeout(() => tooltip.classList.remove('opacity-0'), 50);
        });

        element.addEventListener('mouseleave', e => {
            const tooltip = element.querySelector('div');
            if (tooltip) {
                tooltip.classList.add('opacity-0');
                setTimeout(() => tooltip.remove(), 200);
            }
        });
    });
}

// Handle scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize all UI behaviors
document.addEventListener('DOMContentLoaded', () => {
    initializeResponsive();
    initializeTooltips();
    initializeScrollAnimations();
});
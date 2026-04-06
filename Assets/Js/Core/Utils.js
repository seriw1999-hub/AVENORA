export const utils = {
    formatPrice(price) {
        return new Intl.NumberFormat('az-AZ', { style: 'currency', currency: 'AZN' }).format(price);
    },
    
    showToast(message, type = 'info') {
        console.log(`[${type.toUpperCase()}]: ${message}`);
        // Bura gələcəkdə real bir bildiriş (toast) kitabxanası qoya bilərsən
    }
};

// API client üçün sadə bir wrapper
export const authGuard = {
    protectAdmin() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== "Admin") {
            alert("Bu səhifəyə giriş icazəniz yoxdur!");
            window.location.href = '../auth.html';
        }
    },
    
    protectUser() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = '../auth.html';
        }
    }
};
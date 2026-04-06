import { apiClient } from '../core/api.js';
import CONFIG from '../core/config.js';

// Login Forması üçün elementləri tutaq
const loginForm = document.querySelector('#login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#login-email').value;
        const password = document.querySelector('#login-password').value;

        try {
            const response = await apiClient.post(CONFIG.ENDPOINTS.AUTH_LOGIN, { email, password });

            if (response.ok) {
                const data = await response.json();

                // 1. İstifadəçi məlumatlarını LocalStorage-ə yazaq (Sessiyanı qorumaq üçün)
                localStorage.setItem('user', JSON.stringify(data));

                // 2. Rola görə yönləndirmə (Backend-dən gələn Role-a əsasən)
                // Qeyd: AuthManager.cs-də User obyektini qaytardığımız üçün içində Role olacaq.
                if (data.role === "Admin") {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'user/profile.html';
                }
            } else {
                alert("Email və ya şifrə yanlışdır!");
            }
        } catch (error) {
            console.error("Giriş xətası:", error);
        }
    });
}


// Səhifə yüklənəndə vəziyyəti yoxla
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // Əgər user artıq daxil olubsa, onu idarəetmə panelinə göndər (istəyə bağlı)
    if (user && user.isLoggedIn) {
        console.log("İstifadəçi artıq daxil olub:", user.name);
    }
});

let isLogin = true;

function toggleAuth() {
    isLogin = !isLogin;

    // Elementləri seçirik
    const title = document.getElementById('auth-title');
    const desc = document.getElementById('auth-desc');
    const nameField = document.getElementById('name-field');
    const submitBtn = document.getElementById('submit-btn');
    const switchText = document.getElementById('switch-text');

    if (isLogin) {
        title.innerText = "Xoş Gəlmisiniz!";
        desc.innerText = "Davam etmək üçün hesabınıza giriş edin.";
        nameField.classList.add('hidden');
        document.getElementById('full-name').required = false; // Login-də ad vacib deyil
        submitBtn.innerText = "GİRİŞ ET";
        switchText.innerHTML = 'Hesabınız yoxdur? <button type="button" onclick="toggleAuth()" class="text-blue-600 font-bold hover:underline">Qeydiyyatdan keçin</button>';
    } else {
        title.innerText = "Hesab Yaradın";
        desc.innerText = "Avenora imkanlarından yararlanmaq üçün qeydiyyatdan keçin.";
        nameField.classList.remove('hidden');
        document.getElementById('full-name').required = true; // Qeydiyyatda ad vacibdir
        submitBtn.innerText = "QEYDİYYATI TAMAMLA";
        switchText.innerHTML = 'Artıq hesabınız var? <button type="button" onclick="toggleAuth()" class="text-blue-600 font-bold hover:underline">Giriş edin</button>';
    }
}

function handleAuth(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('full-name').value;

    // Login simulyasiyası üçün sadə yoxlama
    if (isLogin) {
        // Burada normalda API-yə müraciət olmalıdır
        // Simulyasiya: Əgər login olursa, mövcud datanı və ya default datanı yazırıq
        const userData = {
            name: "Sərxan Rəsulov", // Test üçün default ad
            email: email,
            isLoggedIn: true,
            lastLogin: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        alert("Giriş uğurludur! Yönləndirilirsiniz...");
    } else {
        // Qeydiyyat simulyasiyası
        const userData = {
            name: fullName,
            email: email,
            isLoggedIn: true,
            joinDate: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        alert("Qeydiyyat uğurla tamamlandı!");
    }

    // Yönləndirmə
    window.location.href = "index.html"; // Və ya "user-manage.html"
}
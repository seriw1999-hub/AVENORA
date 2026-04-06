document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('currentUser');
    const user = userData ? JSON.parse(userData) : null;

    // Elementləri seçirik
    const desktopUserArea = document.getElementById('user-menu-desktop');
    const mobileUserArea = document.getElementById('user-menu-mobile');

    // Səbət və Favorit düymələrini seçirik (əgər varsa)
    const cartBtn = document.querySelector('button[onclick*="cart"]');
    const favBtn = document.querySelector('button[onclick*="fav"]');
    const loginLink = document.getElementById('main-login-link') || document.querySelector('a[href="auth.html"]');

    if (user && user.isLoggedIn) {
        // --- İSTİFADƏÇİ DAXİL OLUB ---

        // 1. Giriş linkini gizlət
        if (loginLink) loginLink.style.display = 'none';

        // 2. Səbət və Favoritləri göstər (CSS-də default hidden olmalıdırlar)
        if (cartBtn) cartBtn.classList.remove('hidden');
        if (favBtn) favBtn.classList.remove('hidden');

        // 3. Desktop Profil Menyusu
        if (desktopUserArea) {
            desktopUserArea.innerHTML = `
                <div class="relative group">
                    <button id="user-btn" class="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-full transition border border-gray-200">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff" class="w-8 h-8 rounded-full shadow-sm">
                        <span class="text-sm font-bold text-gray-700">${user.name}</span>
                        <i class="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                    </button>
                    
                    <div id="user-dropdown-menu" class="hidden absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-[9999] overflow-hidden">
                        <div class="px-4 py-3 bg-slate-50/50 border-b border-gray-50">
                            <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Hesabım</p>
                            <p class="text-xs font-semibold text-gray-800 truncate">${user.email}</p>
                        </div>
                        <div class="py-1">
                            <a href="user/profile.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 transition">
                                <i class="fa-solid fa-circle-user text-blue-500"></i> Profilim
                            </a>
                            <a href="user/bookings.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 transition">
                                <i class="fa-solid fa-suitcase text-green-500"></i> Sifarişlərim
                            </a>
                        </div>
                        <div class="border-t border-gray-50">
                            <button id="logout-btn" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 font-bold hover:bg-red-50 transition">
                                <i class="fa-solid fa-right-from-bracket"></i> Çıxış yap
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const userBtn = document.getElementById('user-btn');
            const dropdown = document.getElementById('user-dropdown-menu');
            userBtn.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); };
        }

        // Çıxış funksiyası
        document.getElementById('logout-btn').onclick = () => {
            localStorage.removeItem('currentUser');
            window.location.href = '../index.html';
        };

    } else {
        // --- İSTİFADƏÇİ DAXİL OLMAYIB ---

        // Səbət və Favoritləri gizlət
        if (cartBtn) cartBtn.classList.add('hidden');
        if (favBtn) favBtn.classList.add('hidden');

        // Giriş düyməsini göstər
        if (loginLink) loginLink.style.display = 'block';
    }

    // Mobil menyu və digər kodlar buraya davam edir...
});

// 4. MOBİL MENYU TOGGLE (Köhnə kodun)
const toggle = document.getElementById('mobile-toggle');
const menu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

if (toggle && menu) {
    toggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        menuIcon?.classList.toggle('hidden');
        closeIcon?.classList.toggle('hidden');
    });
}

// 5. AKTİV LİNKİ QEYD ETMƏK (Hazırkı səhifəni göy rəng edir)
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('text-blue-600', 'font-bold');
    }
});

// Kənara klikləyəndə dropdown bağlansın
window.onclick = () => {
    const dropdown = document.getElementById('user-dropdown-menu');
    if (dropdown) dropdown.classList.add('hidden');
};


// --- REZERVASIYA QORUMASI SİSTEMİ ---

// Səhifədəki bütün düymələri və linkləri yoxlayırıq
document.addEventListener('click', (e) => {
    // Kliklənən element "REZERV" sözü saxlayırsa və ya xüsusi klası varsa
    const isReserveBtn = e.target.closest('button')?.innerText.toUpperCase().includes('REZERV') ||
        e.target.closest('.reserve-btn');

    if (isReserveBtn) {
        // İstifadəçi girişini yoxlayırıq
        const userData = localStorage.getItem('currentUser');

        if (!userData) {
            // Əgər giriş yoxdursa:
            e.preventDefault(); // Səhifənin keçidini dayandır
            e.stopPropagation(); // Digər eventləri blokla

            // İstifadəçiyə xəbərdarlıq veririk
            alert("Hörmətli səyyah! Sifariş etmək üçün zəhmət olmasa daxil olun və ya qeydiyyatdan keçin.");

            // Giriş səhifəsinə yönləndiririk
            window.location.href = 'auth.html';
        }
    }
});
import { apiClient } from '../core/api.js';
import { utils } from '../core/utils.js';

let allTours = [];
let activeCategory = 'all';
let cart = JSON.parse(localStorage.getItem('avenora_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('avenora_favs')) || [];

const catMatch = activeCategory === 'all' ||
    (t.region && t.region.toLowerCase() === activeCategory.toLowerCase()) ||
    (t.category && t.category.toLowerCase() === activeCategory.toLowerCase()) ||
    (activeCategory === 'early' && t.isEarly);
document.addEventListener('DOMContentLoaded', async () => {
    renderCategoryButtons(); // <-- Kateqoriyaları bura əlavə etdik
    await loadTours();
    setupStaticListeners();
    updateCartBadge();
    updateFavBadge();
});
async function loadTours() {
    try {
        // Bu hissəni müvəqqəti aktiv et ki, kartlar görünsün
        allTours = [
            { id: 1, name: "Roma Klasikası", category: "italy", region: "europe", price: 850, image: "assets/images/tours/img1.jpg", rating: 4.9 },
            { id: 2, name: "Paris İşıqları", category: "france", region: "europe", price: 1200, image: "assets/images/tours/img12.jpg", rating: 4.8 },
            { id: 3, name: "İstanbul Gəzintisi", category: "turkey", region: "asia", price: 450, image: "assets/images/tours/img3.jpg", rating: 4.7 },
            { id: 4, name: "Tokio Nağılı", category: "japan", region: "asia", price: 2100, image: "assets/images/tours/HONG KONG.jpg", rating: 5.0 },
            { id: 5, name: "Misir Piramidaları", category: "egypt", region: "africa", price: 750, image: "assets/images/tours/img5.jpg", rating: 4.6 },
            { id: 6, name: "Laplandiya Qış Nağılı", category: "lapland", region: "asia", price: 1800, image: "assets/images/tours/img7.jpg", rating: 4.9 },
            { id: 7, name: "Phuket Çimərlikləri", category: "thailand", region: "asia", price: 1300, image: "assets/images/tours/img9.jpg", rating: 4.8 },
            { id: 8, name: "London Turu", category: "europe", region: "europe", price: 1100, image: "assets/images/tours/img8.jpg", rating: 4.7 },
            { id: 9, name: "Barcelona Ruhu", category: "europe", region: "europe", price: 900, image: "assets/images/tours/img6.jpg", rating: 4.6 },
            { id: 10, name: "Dubay Lüksü", category: "africa", isEarly: true, region: "asia", price: 2000, image: "assets/images/tours/img4.jpg", rating: 4.8 },
    { id: 12, name: "Qəbələ Turu", category: "azerbaijan", region: "local", price: 50, image: "assets/images/tours/img11.jpg", rating: 4.5, isEarly: true}  ];
        applyFilters();
        renderPopularTours(allTours);
    } catch (err) {
        console.error("Data xətası:", err);
    }
}

const categories = [
    { id: 'all', name: 'Hamısı', icon: 'fa-border-all' },
    { id: 'europe', name: 'Avropa', icon: 'fa-earth-europe' },
    { id: 'asia', name: 'Asiya', icon: 'fa-earth-asia' },
    { id: 'africa', name: 'Afrika', icon: 'fa-earth-africa' },
    { id: 'america', name: 'Amerika', icon: 'fa-earth-americas' },
    { id: 'local', name: 'Daxili Turlar', icon: 'fa-map-location-dot' },
    { id: 'early', name: 'Erkən Rezervasiya', icon: 'fa-clock' }
];
function applyFilters() {
    // Elementlərin mövcudluğunu yoxlayaq ki, xəta verməsin
    const priceSlider = document.getElementById('price-slider');
    const visaToggle = document.getElementById('visa-toggle');
    const discountToggle = document.getElementById('discount-toggle');

    const price = priceSlider ? parseInt(priceSlider.value) : 10000;
    const visa = visaToggle ? visaToggle.checked : false;
    const discount = discountToggle ? discountToggle.checked : false;

    const filtered = allTours.filter(t => {
        // Kateqoriya uyğunluğu
        const catMatch = activeCategory === 'all' ||
            (t.region && t.region.toLowerCase() === activeCategory.toLowerCase()) ||
            (t.category && t.category.toLowerCase() === activeCategory.toLowerCase()) ||
            (activeCategory === 'early' && t.isEarly);

        const priceMatch = t.price <= price;
        const visaMatch = !visa || t.visa;
        const discMatch = !discount || t.discount;

        return catMatch && priceMatch && visaMatch && discMatch;
    });

    renderTours(filtered);
    // updateCategoryUI funksiyasına ehtiyac qalmır, çünki renderCategoryButtons rəngləri tənzimləyir
}

// EKRANA ÇIXARMAQ
function renderTours(data) {
    const grid = document.getElementById('tours-grid');
    if (!grid) return;

    grid.innerHTML = data.map(tour => `
        <div class="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            <div class="relative h-56 overflow-hidden cursor-pointer" onclick="location.href='tours-detal.html?id=${tour.id}'">
                <img src="${tour.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute top-4 left-4 flex gap-2">
                    ${tour.discount ? '<span class="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">Endirim</span>' : ''}
                    ${tour.visa ? '<span class="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">Vizasız</span>' : ''}
                </div>
            </div>
            <div class="p-6 flex-1 flex flex-col">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-[11px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">${tour.category}</span>
                    <div class="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                        <i class="fa-solid fa-star"></i> ${tour.rating}
                    </div>
                </div>
                <h5 class="text-lg font-extrabold text-slate-900 mb-4 line-clamp-1">
                    <a href="tours-detal.html?id=${tour.id}">${tour.name}</a>
                </h5>
                <div class="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                    <span class="text-xl font-black text-slate-900">${tour.price} ₼</span>
                    <div class="flex gap-2">
                        <button onclick="window.toggleFav(${tour.id})" class="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center">
                            <i class="${favorites.includes(tour.id) ? 'fa-solid text-red-500' : 'fa-regular text-slate-400'} fa-heart"></i>
                        </button>
                        <button onclick="window.addToCart(${tour.id})" class="bg-slate-900 hover:bg-blue-600 text-white w-10 h-10 rounded-xl transition-colors">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// POPULYAR TURLAR (SAĞ TƏRƏF)
function renderPopularTours(data) {
    const list = document.getElementById('popular-tours-list');
    if (!list) return;
    const populars = data.filter(t => t.rating >= 4.8).slice(0, 4);
    list.innerHTML = populars.map(t => `
        <div class="flex gap-4 group cursor-pointer" onclick="location.href='tours-detal.html?id=${t.id}'">
            <img src="${t.image}" class="w-16 h-16 rounded-2xl object-cover">
            <div>
                <h4 class="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">${t.name}</h4>
                <p class="text-blue-600 font-extrabold text-sm">${t.price} ₼</p>
            </div>
        </div>
    `).join('');
}

// --- GLOBAL FUNKSİYALAR ---
window.toggleFav = function (id) {
    const idx = favorites.indexOf(id);
    if (idx === -1) favorites.push(id);
    else favorites.splice(idx, 1);
    localStorage.setItem('avenora_favs', JSON.stringify(favorites));
    updateFavBadge();
    applyFilters();
};

window.addToCart = function (id) {
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('avenora_cart', JSON.stringify(cart));
        updateCartBadge();
        utils.showToast("Səbətə əlavə olundu", "success");
    }
    window.openSidePanel('cart');
};

window.openSidePanel = function (type) {
    const panel = document.getElementById('side-panel');
    const overlay = document.getElementById('overlay');

    if (type === 'cart') renderCartPanel();

    panel.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
};

window.closePanel = function () {
    document.getElementById('side-panel').classList.add('translate-x-full');
    document.getElementById('overlay').classList.add('hidden');
};

// Səbətin içini dolduran funksiya
function renderCartPanel() {
    const body = document.getElementById('panel-body');
    const checkout = document.getElementById('checkout-section');
    let subtotal = 0;

    if (cart.length === 0) {
        body.innerHTML = `<div class="text-center py-20 opacity-40 font-bold">Səbət boşdur</div>`;
        checkout.classList.add('hidden');
        return;
    }

    checkout.classList.remove('hidden');
    body.innerHTML = cart.map(id => {
        const t = allTours.find(x => x.id === id);
        if (!t) return '';
        subtotal += t.price;
        return `
            <div class="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl mb-3">
                <img src="${t.image}" class="w-12 h-12 rounded-xl object-cover">
                <div class="flex-1 font-bold text-sm">${t.name}<br><span class="text-blue-600">${t.price} ₼</span></div>
                <button onclick="window.removeFromCart(${t.id})" class="text-slate-300 hover:text-red-500"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');

    const fee = Math.round(subtotal * 0.05);
    document.getElementById('subtotal').innerText = `${subtotal} ₼`;
    document.getElementById('service-fee').innerText = `${fee} ₼`;
    document.getElementById('total-price').innerText = `${subtotal + fee} ₼`;
}

window.removeFromCart = function (id) {
    cart = cart.filter(x => x !== id);
    localStorage.setItem('avenora_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartPanel();
};

function setupStaticListeners() {
    // Kateqoriya düymələri
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.cat;
            applyFilters();
        });
    });

    // Slider
    document.getElementById('price-slider').addEventListener('input', (e) => {
        document.getElementById('price-display').innerText = `${e.target.value} ₼`;
        applyFilters();
    });

    // Checkboxlar
    document.getElementById('visa-toggle').addEventListener('change', applyFilters);
    document.getElementById('discount-toggle').addEventListener('change', applyFilters);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge'); // Navbardakı ID
    if (badge) {
        badge.innerText = cart.length;
        badge.classList.toggle('hidden', cart.length === 0);
    }
}

function updateFavBadge() {
    const badge = document.getElementById('fav-badge'); // Navbardakı ID
    if (badge) {
        badge.innerText = favorites.length;
        badge.classList.toggle('hidden', favorites.length === 0);
    }
}

function updateCategoryUI() {
    document.querySelectorAll('.cat-btn').forEach(btn => {
        const isSelected = btn.dataset.cat === activeCategory;
        btn.classList.toggle('bg-blue-50', isSelected);
        btn.classList.toggle('text-blue-600', isSelected);
        btn.classList.toggle('bg-slate-50', !isSelected);
        btn.classList.toggle('text-slate-600', !isSelected);

        const icon = btn.querySelector('i');
        if (icon) icon.className = isSelected ? 'fa-solid fa-check text-[10px]' : 'fa-solid fa-chevron-right text-[10px]';
    });
}

//category və filter düymələrinə listener qoşmaq
function renderCategoryButtons() {
    const container = document.getElementById('category-btns');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
        <button data-cat="${cat.id}"
            class="cat-btn flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeCategory === cat.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600'}">
            <span>${cat.name}</span> 
            <i class="fa-solid ${activeCategory === cat.id ? 'fa-check' : 'fa-chevron-right'} text-[10px]"></i>
        </button>
    `).join('');

    // Düymələr yarandıqdan sonra onlara click listener-i yenidən qoşmaq lazımdır
    setupCategoryEventListeners();
}

function setupCategoryEventListeners() {
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.onclick = () => {
            activeCategory = btn.dataset.cat;
            applyFilters();
            renderCategoryButtons(); // Düymələrin rəngini yeniləmək üçün
        };
    });
}
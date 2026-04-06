// 1. DATA (Məlumat Bazası) - Bütün turlar burada olmalıdır
const toursData = [
    { id: 1, name: "Roma Klasikası", category: "europe", price: 850, image: "assets/images/tours/best roma.jpg" },
    { id: 2, name: "Paris İşıqları", category: "europe", price: 1200, image: "assets/images/tours/best paris.jpg" },
    { id: 3, name: "İstanbul Gəzintisi", category: "turkey", price: 450, image: "assets/images/tours/bestistanbul.jpg" },
    { id: 4, name: "Tokio Nağılı", category: "asia", price: 2100, image: "assets/images/tours/best tokyo.png" },
    { id: 5, name: "Misir Piramidaları", category: "africa", price: 750, image: "assets/images/tours/egypt.jpg" },
    { id: 6, name: "Laplandiya Qış Nağılı", category: "asia", price: 1800, image: "assets/images/tours/lapland.jpg" },
    { id: 7, name: "Phuket Çimərlikləri", category: "asia", price: 1300, image: "assets/images/tours/thailand.jpg" },
    { id: 8, name: "London Turu", category: "europe", price: 1100, image: "assets/images/tours/best london.jpg" },
   { id: 9, name: "Barcelona Ruhu", category: "europe", price: 900, image: "assets/images/tours/img6.jpg" },
    { id: 10, name: "Dubay Lüksü", category: "africa", price: 2000, image: "assets/images/tours/img4.jpg" }];

const categories = [
    { id: 'all', name: 'Hamısı', icon: 'fa-border-all' },
    { id: 'europe', name: 'Avropa', icon: 'fa-earth-europe' },
    { id: 'asia', name: 'Asiya', icon: 'fa-earth-asia' },
    { id: 'africa', name: 'Afrika', icon: 'fa-earth-africa' },
    { id: 'america', name: 'Amerika', icon: 'fa-earth-americas' },
    { id: 'local', name: 'Daxili Turlar', icon: 'fa-map-location-dot' },
    { id: 'early', name: 'Erkən Rezervasiya', icon: 'fa-clock' }
];

// 3. TURLARI EKRANA YAZDIRAN FUNKSİYA
function renderTours(data = toursData) {
    const container = document.getElementById('tour-container');
    const countDisplay = document.getElementById('results-count');

    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p class="text-slate-400">Bu kateqoriyada hələ ki aktiv tur tapılmadı.</p>
            </div>`;
    } else {
        container.innerHTML = data.map(tour => `
            <div class="tour-card bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div class="relative h-56">
                    <img src="${tour.image}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/600x400?text=Tour+Image'">
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                        ${tour.price} ₼-dan
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="font-bold text-slate-800 mb-4 h-14 overflow-hidden">${tour.name}</h3>
                    <button class="w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        Ətraflı bax
                    </button>
                </div>
            </div>
        `).join('');
    }

    if (countDisplay) {
        countDisplay.innerText = `${data.length} tur tapıldı`;
    }
}

// 4. KATEQORİYA DÜYMƏLƏRİNİ YARATMAQ
function generateCategoryGrid() {
    const grid = document.getElementById('dynamic-category-grid');
    if (!grid) return;

    grid.innerHTML = categories.map(cat => `
        <button data-cat="${cat.id}" 
                onclick="filterByCategory('${cat.id}')"
                class="cat-card group flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-500 hover:shadow-md transition-all duration-300">
            <div class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${cat.color} group-hover:bg-blue-600 group-hover:text-white">
                <i class="fa-solid ${cat.icon} text-sm"></i>
            </div>
            <span class="text-xs font-bold text-slate-700 group-hover:text-blue-600 truncate">${cat.name}</span>
        </button>
    `).join('');
}

// 5. FİLTRLƏMƏ MƏNTİQİ
function filterByCategory(catId) {
    // Düymənin vizual olaraq aktivləşməsi
    document.querySelectorAll('.cat-card').forEach(card => {
        card.classList.remove('border-blue-600', 'ring-2', 'ring-blue-100', 'shadow-md');
        if (card.dataset.cat === catId) {
            card.classList.add('border-blue-600', 'ring-2', 'ring-blue-100', 'shadow-md');
        }
    });

    // Məlumata görə süzgəcdən keçirmə
    const filtered = (catId === 'all')
        ? toursData
        : toursData.filter(t => t.category === catId);

    renderTours(filtered);
}

// 6. DİGƏR KOMPONENTLƏR (Scroll, Video, Office Cards)
function initOtherComponents() {
    // Horizontal Scroll
    const track = document.getElementById('destinationsTrack');
    let isDown = false, startX, scrollLeft;

    if (track) {
        track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.parentElement.scrollLeft;
        });
        track.addEventListener('mouseleave', () => isDown = false);
        track.addEventListener('mouseup', () => isDown = false);
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.parentElement.scrollLeft = scrollLeft - walk;
        });
    }

    // Office Cards
    document.querySelectorAll('.office-card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (!e.target.closest('.close-btn')) {
                this.classList.add('active');
                const overlay = this.querySelector('.info-overlay');
                if (overlay) overlay.style.transform = "translateY(0)";
            }
        });

        const closeBtn = card.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                card.classList.remove('active');
                const overlay = card.querySelector('.info-overlay');
                if (overlay) overlay.style.transform = "translateY(100%)";
            });
        }
    });

    // Video Control
    const video = document.getElementById('whyUsVideo');
    const controlBtn = document.getElementById('videoControlBtn');
    if (video && controlBtn) {
        controlBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                document.getElementById('playIcon').classList.replace('fa-play', 'fa-pause');
            } else {
                video.pause();
                document.getElementById('playIcon').classList.replace('fa-pause', 'fa-play');
            }
        });
    }
}

// 7. SƏHİFƏ START
document.addEventListener('DOMContentLoaded', () => {
    generateCategoryGrid();
    renderTours(toursData); // İlkin yüklənmədə hamısını göstər
    initOtherComponents();

    // URL-dən kateqoriya yoxla
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('cat');
    if (cat) setTimeout(() => filterByCategory(cat), 300);
});

// why choose us bölməsi üçün animasiya
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('whyUsVideo');
    const controlBtn = document.getElementById('videoControlBtn');
    const playIcon = document.getElementById('playIcon');
    const muteBtn = document.getElementById('videoMuteBtn');
    const muteIcon = document.getElementById('muteIcon');

    if (video && controlBtn) {
        // Oynat / Dayandır Məntiqi
        controlBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playIcon.classList.replace('fa-play', 'fa-pause');
                controlBtn.classList.add('opacity-0'); // Oynayanda düymə gizlənsin (hover-də görünəcək)
            } else {
                video.pause();
                playIcon.classList.replace('fa-pause', 'fa-play');
                controlBtn.classList.remove('opacity-0');
            }
        });

        // Hover edəndə düymənin görünməsi
        video.parentElement.addEventListener('mouseenter', () => {
            controlBtn.classList.remove('opacity-0');
        });

        video.parentElement.addEventListener('mouseleave', () => {
            if (!video.paused) {
                controlBtn.classList.add('opacity-0');
            }
        });

        // Səs Məntiqi
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (video.muted) {
                muteIcon.classList.replace('fa-volume-high', 'fa-volume-xmark');
            } else {
                muteIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
                // Səsi açanda video dayanıbsa avtomatik başlasın
                if (video.paused) video.play();
            }
        });
    }
});
// Səhifə start
window.onload = () => {
    generateCategoryGrid();
    renderTours();
    renderPopular();
    setTimeout(checkUrl, 200);
};


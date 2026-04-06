document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = parseInt(urlParams.get('id'));

    if (typeof toursData !== 'undefined' && toursData.length > 0) {
        const tour = toursData.find(t => t.id === tourId);
        if (tour) {
            renderTourDetails(tour);
            renderRelatedTours(tour, toursData);
            // Dinamik yaradılan düyməyə klik hadisəsini bağlayırıq
            setupReserveButton(tour);
        } else {
            showNotFoundError();
        }
    } else {
        console.error("toursData tapılmadı!");
    }
});

function renderTourDetails(tour) {
    const container = document.getElementById('tours-detal-container');
    if (!container) return;

    container.innerHTML = ` 
        <section class="relative h-[60vh] w-full overflow-hidden">
            <img src="${tour.image}" class="w-full h-full object-cover tour-hero-img">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8 md:p-20">
                <div class="max-w-6xl mx-auto w-full">
                    <span class="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4 inline-block">
                        ${tour.category}
                    </span>
                    <h1 class="text-4xl md:text-6xl font-black text-white mb-4">${tour.name}</h1>
                </div>
            </div>
        </section>

        <section class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div class="lg:col-span-2 space-y-8">
                <div class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-black mb-6 text-slate-900">Tur Haqqında</h2>
                    <p class="text-slate-600 leading-relaxed">Bu möhtəşəm ${tour.name} turu sizə unudulmaz anlar vəd edir.</p>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 sticky top-28 text-center">
                    <p class="text-xs font-bold text-slate-400 uppercase">Qiymət</p>
                    <p class="text-3xl font-black text-slate-900 mb-6"><span class="tour-price">${tour.price}</span> ₼</p>
                    
                    <button id="dynamic-reserve-btn" class="w-full bg-blue-600 text-white font-black py-5 rounded-2xl mb-4 hover:bg-blue-700 transition-all active:scale-95">
                        İNDİ REZERV ET
                    </button>
                    
                    <button class="w-full border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all">
                        Sevimlilərə At
                    </button>
                </div>
            </div>
        </section>
    `;
}

// Düymə kliklənməsini idarə edən funksiya
function setupReserveButton(tour) {
    const btn = document.getElementById('dynamic-reserve-btn');
    if (!btn) return;

    btn.onclick = function() {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (!user) {
            alert("Sifariş üçün giriş edin!");
            window.location.href = 'auth.html';
            return;
        }

        const newBooking = {
            tourName: tour.name,
            price: tour.price,
            image: tour.image,
            date: new Date().toLocaleDateString('az-AZ'),
            status: 'Gözləmədə'
        };

        let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
        bookings.push(newBooking);
        localStorage.setItem('userBookings', JSON.stringify(bookings));

        alert("Rezervasiya uğurla tamamlandı!");
        window.location.href = 'user/bookings.html';
    };
}

// Bənzər turlar funksiyası (kodun qalan hissəsi eyni qalsın...)
function renderRelatedTours(currentTour, allTours) {
    const relatedContainer = document.getElementById('related-tours-grid');
    if (!relatedContainer) return;
    const related = allTours.filter(t => t.category === currentTour.category && t.id !== currentTour.id).slice(0, 3);
    relatedContainer.innerHTML = related.map(item => `
        <div class="group bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
            <div class="p-5">
                <h4 class="font-bold text-slate-900 mb-2">${item.name}</h4>
                <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-black">${item.price} ₼</span>
                    <a href="tours-detal.html?id=${item.id}" class="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">Detallar →</a>
                </div>
            </div>
        </div>
    `).join('');
}

function showNotFoundError() {
    document.getElementById('tours-detal-container').innerHTML = `<h2 class="text-center py-20">Tur tapılmadı!</h2>`;
}

function setupReserveButton(tour) {
    // interval ilə düymənin HTML-ə tam oturduğundan əmin oluruq
    const checkBtn = setInterval(() => {
        const btn = document.getElementById('dynamic-reserve-btn');
        if (btn) {
            clearInterval(checkBtn);
            btn.onclick = function() {
                saveBooking(tour);
            };
        }
    }, 100);
}

function saveBooking(tour) {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        alert("Sifariş üçün giriş edin!");
        window.location.href = 'auth.html';
        return;
    }

    // MÜHÜM: bookings.html-in oxuduğu açar sözlə eyni olmalıdır
    let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
    
    const newBooking = {
        tourName: tour.name,
        price: tour.price,
        image: tour.image,
        date: new Date().toLocaleDateString('az-AZ'),
        status: 'Gözləmədə'
    };

    bookings.push(newBooking);
    localStorage.setItem('userBookings', JSON.stringify(bookings));

    alert("Rezervasiya uğurla tamamlandı!");
    window.location.href = 'user/bookings.html';
}
// Əgər tur tapılmazsa, istifadəçiyə məlumat vermək üçün funksiya
function showNotFoundError() {
    const errorElement = document.getElementById('error-message'); // Sənin elementin ID-si
    if (errorElement) { // <--- BU YOXLAMANI ƏLAVƏ ET
        errorElement.innerHTML = "Tur tapılmadı";
    }
}
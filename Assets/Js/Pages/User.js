document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // Əgər giriş edilməyibsə, ana səhifəyə at
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    // --- PROFİL SƏHİFƏSİ ÜÇÜN ---
    if (document.getElementById('profile-form')) {
        const nameInput = document.getElementById('profile-name');
        const emailInput = document.getElementById('profile-email');
        const profileImg = document.getElementById('profile-img');

        // Hazırkı məlumatları doldur
        nameInput.value = user.name;
        emailInput.value = user.email;
        profileImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=128`;

        document.getElementById('profile-form').onsubmit = (e) => {
            e.preventDefault();
            
            // Yeni məlumatları obyektə yaz
            user.name = nameInput.value;
            user.email = emailInput.value;
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert("Məlumatlar uğurla yeniləndi!");
            window.location.reload();
        };
    }

    // --- SİFARİŞLƏR SƏHİFƏSİ ÜÇÜN ---
    if (document.getElementById('bookings-list')) {
        const bookingsList = document.getElementById('bookings-list');
        const noBookings = document.getElementById('no-bookings');
        
        // LocalStorage-dan sifarişləri götür (yoxdursa boş massiv)
        const bookings = JSON.parse(localStorage.getItem('userBookings')) || [];

        if (bookings.length === 0) {
            noBookings.classList.remove('hidden');
        } else {
            bookingsList.innerHTML = bookings.map((item, index) => `
                <div class="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden">
                            <img src="${item.image || '../assets/images/tours/default.jpg'}" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900">${item.tourName}</h3>
                            <p class="text-xs text-slate-500"><i class="fa-regular fa-calendar mr-1"></i> ${item.date}</p>
                            <p class="text-blue-600 font-bold text-sm mt-1">${item.price} AZN</p>
                        </div>
                    </div>
                    <button onclick="cancelBooking(${index})" class="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition">
                        Ləğv et
                    </button>
                </div>
            `).join('');
        }
    }
});

// Sifarişi ləğv etmək funksiyası
function cancelBooking(index) {
    if (confirm("Bu rezervasiyanı ləğv etmək istədiyinizə əminsiniz?")) {
        let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
        bookings.splice(index, 1);
        localStorage.setItem('userBookings', JSON.stringify(bookings));
        window.location.reload();
    }
}
// user.js daxilində
const bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
// Diqqət et ki, 'userBookings' tours-detal.js-dəki ilə eyni həriflərlə yazılıb.
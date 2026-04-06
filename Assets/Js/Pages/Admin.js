import { apiClient } from '../core/api.js';
import CONFIG from '../core/config.js';
import { authGuard } from '../core/utils.js';

// 1. Təhlükəsizlik Yoxlaması
authGuard.protectAdmin();

document.addEventListener('DOMContentLoaded', async () => {
    // --- SIDEBAR İDARƏETMƏ ---
    const sidebar = document.getElementById('admin-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // --- MODAL AÇMA/BAĞLAMA ---
    const openModalBtn = document.getElementById('open-tour-modal');
    const closeModalBtn = document.getElementById('close-tour-modal');
    const tourDialog = document.getElementById('tour-dialog');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => tourDialog.classList.remove('hidden'));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => tourDialog.classList.add('hidden'));
    }

    // --- MƏLUMATLARIN YÜKLƏNMƏSİ ---
    await loadDashboardStats();
    await loadToursTable();
});

// --- DASHBOARD STATİSTİKALARI ---
async function loadDashboardStats() {
    try {
        const tours = await apiClient.get(CONFIG.ENDPOINTS.TOURS);
        const totalToursElem = document.getElementById('total-tours');
        if (totalToursElem) {
            totalToursElem.textContent = tours.length;
        }
    } catch (error) {
        console.error("Statistikalar yüklənmədi:", error);
    }
}

// --- TURLARI CƏDVƏLƏ DOLDURMAQ ---
async function loadToursTable() {
    const tbody = document.getElementById('tours-table');
    if (!tbody) return;

    try {
        const tours = await apiClient.get(CONFIG.ENDPOINTS.TOURS);
        tbody.innerHTML = ''; 

        tours.forEach(t => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 border-b"; // Tailwind istifadə edirsənsə
            tr.innerHTML = `
                <td class="p-3">${t.name}</td>
                <td class="p-3">${t.category}</td>
                <td class="p-3">
                    <span class="px-2 py-1 text-xs rounded ${t.isVisaRequired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                        ${t.isVisaRequired ? 'Viza Lazımdır' : 'Viza Yoxdur'}
                    </span>
                </td>
                <td class="p-3 font-bold">${t.price} AZN</td>
                <td class="p-3">${t.rating} ⭐</td>
                <td class="p-3 text-right">
                    <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="editTour(${t.id})">✏️</button>
                    <button class="text-red-600 hover:text-red-800" onclick="deleteTour(${t.id})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Cədvəl yüklənmədi:", error);
    }
}

// --- TUR SİLMƏ FUNKSİYASI ---
window.deleteTour = async (id) => {
    if (confirm('Bu turu silmək istədiyinizə əminsiniz?')) {
        try {
            // apiClient-də delete metodu varsa ondan istifadə et, yoxsa fetch:
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.TOURS}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Tur silindi!");
                await loadToursTable(); 
                await loadDashboardStats(); // Sayı da yeniləyək
            } else {
                alert("Xəta: Backend-də bu ID-li tur tapılmadı.");
            }
        } catch (error) {
            alert("Silmə zamanı xəta baş verdi.");
        }
    }
};

// --- YENİ TUR ƏLAVƏ ETMƏK ---
const tourForm = document.getElementById('tour-form');
if (tourForm) {
    tourForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('tour-name').value,
            description: document.getElementById('tour-desc').value,
            price: parseFloat(document.getElementById('tour-price').value),
            category: document.getElementById('tour-category').value,
            imagePath: document.getElementById('tour-image').value,
            isVisaRequired: document.getElementById('tour-visa').checked,
            rating: 5.0
        };

        try {
            const data = await apiClient.post(CONFIG.ENDPOINTS.TOURS, formData);
            if (data) {
                alert("Tur uğurla əlavə edildi!");
                tourForm.reset(); // Formu təmizlə
                document.getElementById('tour-dialog').classList.add('hidden'); // Modalı bağla
                await loadToursTable(); 
                await loadDashboardStats();
            }
        } catch (error) {
            console.error("Post xətası:", error);
            alert("Xəta: Tur əlavə edilmədi. Backend-i yoxlayın.");
        }
    });
}

import { apiClient } from '../core/api.js';
import CONFIG from '../core/config.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadUsersTable();
});

async function loadUsersTable() {
    const tbody = document.getElementById('users-table');
    if (!tbody) return;

    try {
        // Backend-də UsersController olmalıdır
        const users = await apiClient.get('/Users'); // Endpoint-i dəqiqləşdirin
        tbody.innerHTML = '';

        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="p-4 font-medium">${u.fullName}</td>
                <td class="p-4 text-gray-500">${u.email}</td>
                <td class="p-4 text-right">
                    <button class="text-red-500 hover:underline" onclick="deleteUser(${u.id})">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("İstifadəçilər yüklənmədi:", error);
    }
}
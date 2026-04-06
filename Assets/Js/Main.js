// // assets/js/main.js əlavə et
// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const response = await fetch('/api/tour-types'); // Backend-də yeni endpoint
//         const types = await response.json();

//         const grid = document.querySelector('.travel-grid');
//         grid.innerHTML = ''; // mövcud statik sil

//         types.forEach(type => {
//             const link = document.createElement('a');
//             link.href = `turlar?type=${type.slug}`;
//             link.className = 'travel-item group relative h-52 overflow-hidden rounded-xl';
//             link.innerHTML = `
//                 <img src="${type.iconUrl}" alt="${type.name}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
//                 <div class="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
//                 <div class="absolute bottom-4 left-4 text-white">
//                     <h3 class="font-heading text-xl font-bold">${type.name}</h3>
//                     <p class="text-sm text-white/70">${type.description} · ${type.tourCount} tur</p>
//                 </div>
//             `;
//             grid.appendChild(link);
//         });
//     } catch (err) {
//         console.error('Səyahət tipləri yüklənə bilmədi:', err);
//     }
// });
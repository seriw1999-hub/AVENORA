document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 20000; // Sürət (nə qədər kiçik olsa, o qədər sürətli olar)

    const startCounter = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    // Səhifəni skrol edəndə görünən kimi başlasın
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target); // Bir dəfə işləsin
            }
        });
    }, { threshold: 1.0 });

    counters.forEach(counter => observer.observe(counter));
});


document.querySelectorAll('.office-card').forEach(card => {
    // Karta klik edəndə məlumatı aç
    card.addEventListener('click', function (e) {
        // Əgər kliklənən yer bağlama düyməsi (X) deyilsə, kartı aç
        if (!e.target.classList.contains('close-btn')) {
            this.classList.add('active');
        }
    });

    // X düyməsinə klik edəndə məlumatı bağla
    const closeBtn = card.querySelector('.close-btn');
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation(); // Kartın öz klik hadisəsinin işləməməsi üçün
        card.classList.remove('active');
    });
});

// overlay kliklənəndə məlumatı bağla
document.querySelectorAll('.office-card').forEach(card => {
    card.addEventListener('click', function (e) {
        if (!e.target.classList.contains('close-btn')) {
            this.classList.add('active');
            this.querySelector('.info-overlay').style.transform = "translateY(0)";
        }
    });

    const closeBtn = card.querySelector('.close-btn');
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        card.classList.remove('active');
        card.querySelector('.info-overlay').style.transform = "translateY(100%)";
    });
});

// gallery sekmesinde sekil kliklənəndə modal aç
function switchTab(tabName) {
    const blogContent = document.getElementById('blog-content');
    const galleryContent = document.getElementById('gallery-content');
    const btnBlog = document.getElementById('btn-blog');
    const btnGallery = document.getElementById('btn-gallery');

    if (tabName === 'blog') {
        // Kontenti dəyiş
        blogContent.classList.remove('hidden');
        galleryContent.classList.add('hidden');
        // Düymə stilini dəyiş
        btnBlog.classList.add('active-tab', 'text-white');
        btnGallery.classList.remove('active-tab', 'text-white');
        btnGallery.classList.add('text-gray-500');
    } else {
        // Kontenti dəyiş
        galleryContent.classList.remove('hidden');
        blogContent.classList.add('hidden');
        // Düymə stilini dəyiş
        btnGallery.classList.add('active-tab', 'text-white');
        btnBlog.classList.remove('active-tab', 'text-white');
        btnBlog.classList.add('text-gray-500');
    }
}

function switchTab(tab) {
    const blog = document.getElementById('blog-content');
    const gallery = document.getElementById('gallery-content');
    const btnB = document.getElementById('btn-blog');
    const btnG = document.getElementById('btn-gallery');

    if (tab === 'blog') {
        blog.classList.remove('hidden'); gallery.classList.add('hidden');
        btnB.classList.add('active-tab'); btnG.classList.remove('active-tab');
        btnG.classList.add('text-gray-400');
    } else {
        gallery.classList.remove('hidden'); blog.classList.add('hidden');
        btnG.classList.add('active-tab'); btnB.classList.remove('active-tab');
        btnB.classList.add('text-gray-400');
    }
}

// Bloq Modalı Açmaq
function openBlogModal(id, title, tag, date, imgSrc) {
    const modal = document.getElementById('blogModal');
    document.getElementById('modalImage').src = imgSrc;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalTag').innerText = tag;
    document.getElementById('modalDate').innerText = date;

    // Nümunə məzmun (Real saytda bura ID-yə görə fərqli mətnlər gələ bilər)
    document.getElementById('modalBody').innerHTML = `
        <p>Avenora Travel olaraq sizə unudulmaz ${title} təcrübəsi təklif edirik. Bu səyahət zamanı siz həm yerli mədəniyyətlə tanış olacaq, həm də lüks xidmətimizdən zövq alacaqsınız.</p>
        <p>Sənədlərin hazırlanması, viza dəstəyi və bilet təminatı tamamilə bizim üzərimizdədir. Siz sadəcə çamadanınızı hazırlayın!</p>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Arxa fonu dondur
}

function closeBlogModal() {
    document.getElementById('blogModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Qalereya Lightbox
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = src;
    lb.classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

// Kənara klikləyəndə bağlamaq
function closeModalOnOutsideClick(e, modalId) {
    if (e.target.id === modalId) {
        if (modalId === 'blogModal') closeBlogModal();
    }
}
// assets/js/components/slider.js
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.scroll-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollAmount = 1040; // hər kartın eni + gap

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
});
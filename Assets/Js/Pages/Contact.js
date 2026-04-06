document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Göndərmə düyməsini deaktiv et
    const btn = this.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Göndərilir... <i class='fas fa-spinner animate-spin ml-2'></i>";
    btn.disabled = true;

    // Simulyasiya (Real API yoxdursa)
    setTimeout(() => {
        alert('Təşəkkür edirik! Mesajınız uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.');
        btn.innerHTML = originalText;
        btn.disabled = false;
        this.reset(); // Formanı təmizlə
    }, 2000);
});
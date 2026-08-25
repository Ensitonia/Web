// Carrossel dos cards de "Cursos em Destaque" na página Para Empresas
(function () {
    const container = document.getElementById('empresasCardsContainer');
    const btnPrev = document.getElementById('empresasCardsPrev');
    const btnNext = document.getElementById('empresasCardsNext');

    if (!container || !btnPrev || !btnNext) return;

    function larguraDoScroll() {
        const card = container.querySelector('.curso-card');
        const gap = 16; // precisa bater com o "gap" do .cursos-grid no CSS mobile
        return card ? card.offsetWidth + gap : 300;
    }

    btnPrev.addEventListener('click', () => {
        container.scrollBy({ left: -larguraDoScroll(), behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
        container.scrollBy({ left: larguraDoScroll(), behavior: 'smooth' });
    });
})();
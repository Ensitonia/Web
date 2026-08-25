// Carrossel da Lista de Vagas
(function () {
    const carrossel = document.getElementById('vgLista');
    const btnPrev = document.getElementById('vgPrev');
    const btnNext = document.getElementById('vgNext');
    const dotsContainer = document.getElementById('vgDots');

    if (!carrossel) return;

    const cards = Array.from(carrossel.children);

    // Cria as bolinhas dinamicamente
    cards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('vg-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(i));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function scrollToCard(index) {
        const card = cards[index];
        carrossel.scrollTo({
            left: card.offsetLeft - carrossel.offsetLeft,
            behavior: 'smooth'
        });
    }

    function getCardWidth() {
        return cards[0].offsetWidth + 16; // largura do card + gap
    }

    btnNext?.addEventListener('click', () => {
        carrossel.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });

    btnPrev?.addEventListener('click', () => {
        carrossel.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });

    // Atualiza bolinha ativa e estado das setas conforme o scroll
    let scrollTimeout;
    carrossel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = carrossel.scrollLeft;

            let closestIndex = 0;
            let closestDistance = Infinity;
            cards.forEach((card, i) => {
                const distance = Math.abs(card.offsetLeft - carrossel.offsetLeft - scrollLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            });

            dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));

            if (btnPrev) btnPrev.disabled = scrollLeft <= 4;
            if (btnNext) {
                const maxScroll = carrossel.scrollWidth - carrossel.clientWidth;
                btnNext.disabled = scrollLeft >= maxScroll - 4;
            }
        }, 80);
    });

    if (btnPrev) btnPrev.disabled = true;
})();
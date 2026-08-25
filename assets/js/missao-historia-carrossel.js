// Carrossel de Missão/História (Sobre Nós)
(function () {
    const wrapper = document.getElementById('missaoHistoriaWrapper');
    const dotsContainer = document.getElementById('missaoHistoriaDots');

    if (!wrapper || !dotsContainer) return;

    const cards = Array.from(wrapper.children);

    cards.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            const card = cards[i];
            wrapper.scrollTo({
                left: card.offsetLeft - wrapper.offsetLeft,
                behavior: 'smooth'
            });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    let scrollTimeout;
    wrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = wrapper.scrollLeft;
            let closestIndex = 0;
            let closestDistance = Infinity;

            cards.forEach((card, i) => {
                const distance = Math.abs(card.offsetLeft - wrapper.offsetLeft - scrollLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            });

            dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));
        }, 80);
    });
})();
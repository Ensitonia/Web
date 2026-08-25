const botaoMenu = document.getElementById("menuHamburguer");
const menuMobile = document.getElementById("menuMobile");

if (botaoMenu && menuMobile) {
    botaoMenu.addEventListener("click", () => {
        const aberto = menuMobile.classList.toggle("aberto");
        botaoMenu.setAttribute("aria-expanded", aberto);
    });

    const links = document.querySelectorAll("#menuMobile nav a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            menuMobile.classList.remove("aberto");
            botaoMenu.setAttribute("aria-expanded", "false");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            menuMobile.classList.remove("aberto");
            botaoMenu.setAttribute("aria-expanded", "false");
        }
    });
}


// Painel de Acessibilidade

const btnAcessibilidade = document.getElementById('btnAcessibilidade');
const painelAcessibilidade = document.getElementById('painelAcessibilidade');
const fecharPainel = document.getElementById('fecharPainel');

btnAcessibilidade.addEventListener('click', () => {
    painelAcessibilidade.classList.toggle('ativo');
});

fecharPainel.addEventListener('click', () => {
    painelAcessibilidade.classList.remove('ativo');
});

document.addEventListener('click', (e) => {
    const cliqueForaDoPainel = !painelAcessibilidade.contains(e.target) && !btnAcessibilidade.contains(e.target);
    if (cliqueForaDoPainel && painelAcessibilidade.classList.contains('ativo')) {
        painelAcessibilidade.classList.remove('ativo');
    }
});

// Integração VLibras com o painel de acessibilidade

function aguardarVLibras(callback, tentativas = 0) {
    const botaoNativo = document.querySelector('#vlibras-access-wrapper, div[vw-access-button]');

    if (botaoNativo) {
        callback(botaoNativo);
    } else if (tentativas < 50) {
        setTimeout(() => {
            aguardarVLibras(callback, tentativas + 1);
        }, 100);
    }
}

// Mantém o botão nativo do VLibras invisível pro usuário sem mexer
// em display, width ou height — o VLibras parece usar esses valores
// internamente pra decidir se reage a um clique (foi por isso que a
// tentativa anterior, encolhendo pra 1px, quebrou o clique em
// "Libras"). Deixamos o tamanho/posição normais e só tornamos
// transparente + bloqueado pro mouse do usuário; o clique disparado
// via JavaScript (botaoNativo.click()) continua funcionando porque
// .click() ignora pointer-events.
// vlibras-plugin.js injeta um elemento próprio com
// id="vlibras-access-wrapper" (não existe no HTML original, é criado
// via JS) — é esse o ícone que ficava aparecendo.
function esconderVisualmenteMasFuncional(el) {
    el.style.setProperty("opacity", "0", "important");
    el.style.setProperty("pointer-events", "none", "important");
}

function esconderBotaoNativoVLibrasParaSempre() {
    setInterval(() => {
        document.querySelectorAll('[vw-access-button], #vlibras-access-wrapper').forEach((el) => {
            if (el.style.opacity !== "0") {
                esconderVisualmenteMasFuncional(el);
            }
        });
    }, 200);
}

esconderBotaoNativoVLibrasParaSempre();

const itemAbrirLibras = document.getElementById('abrirLibras');

// Também tenta esconder imediatamente (caso o botão já exista)
aguardarVLibras(() => {});

if (itemAbrirLibras) {
    itemAbrirLibras.addEventListener('click', () => {
        aguardarVLibras((botaoNativo) => {
            const alvoClicavel =
                botaoNativo.querySelector('button, [role="button"], a') || botaoNativo;
            alvoClicavel.click();

            if (painelAcessibilidade) {
                painelAcessibilidade.classList.remove('ativo');
            }
        });
    });
}

document.addEventListener('click', function (e) {
    const fecharClicado = e.target.closest('[vw-plugin-wrapper] .close-btn, [action="close"], .vpw-actions [action="close"]');

    if (fecharClicado && btnAcessibilidade) {
        btnAcessibilidade.style.display = 'flex';
    }
}, true);

// Alto contraste


const btnAltoContraste = document.getElementById("btnAltoContraste");

function alternarContraste() {
    document.body.classList.toggle("alto-contraste");
    const ativo = document.body.classList.contains("alto-contraste");
    localStorage.setItem("altoContraste", ativo ? "1" : "0");
}

if (btnAltoContraste) {
    btnAltoContraste.addEventListener("click", alternarContraste);
}


// Modo noturno


function alternarModoNoturno(forcar) {
    const ativo = typeof forcar === "boolean"
        ? forcar
        : !document.body.classList.contains("modo-noturno");

    document.body.classList.toggle("modo-noturno", ativo);
    localStorage.setItem("modoNoturno", ativo ? "1" : "0");
    atualizarIconeModoNoturno();
}

function atualizarIconeModoNoturno() {
    const botao = document.getElementById("btnModoNoturno");
    if (!botao) return;

    const ativo = document.body.classList.contains("modo-noturno");
    botao.innerHTML = ativo
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    botao.setAttribute("aria-label", ativo ? "Desativar modo noturno" : "Ativar modo noturno");
}

function criarBotaoModoNoturno() {
    if (document.getElementById("btnModoNoturno")) return;

    const areaAcoes =
        document.querySelector(".acoes-header") ||
        document.querySelector(".menu-mobile > div:last-child");

    if (!areaAcoes) return;

    // Garante que o container fique alinhado numa linha só, verticalmente centralizado
    areaAcoes.style.display = "flex";
    areaAcoes.style.alignItems = "center";
    areaAcoes.style.flexWrap = "nowrap";
    if (!areaAcoes.style.gap) {
        areaAcoes.style.gap = "12px";
    }

    const botao = document.createElement("button");
    botao.type = "button";
    botao.id = "btnModoNoturno";
    botao.className = "btn-modo-noturno";

    areaAcoes.insertBefore(botao, areaAcoes.firstChild);

    botao.addEventListener("click", () => alternarModoNoturno());

    atualizarIconeModoNoturno();
}

criarBotaoModoNoturno();


// Aumentar e diminuir fonte


const TAMANHO_PADRAO = 16;
const TAMANHO_MAXIMO = 24;
const TAMANHO_MINIMO = 12;

let tamanho = TAMANHO_PADRAO;

function aplicarTamanhoFonte() {
    const escala = (tamanho / TAMANHO_PADRAO) * 100;
    document.body.style.zoom = escala + "%";
}

function aumentarFonte() {
    if (tamanho < TAMANHO_MAXIMO) {
        tamanho += 2;
        aplicarTamanhoFonte();
    }
}

function diminuirFonte() {
    if (tamanho > TAMANHO_MINIMO) {
        tamanho -= 2;
        aplicarTamanhoFonte();
    }
}

const btnAumentarFonte = document.getElementById("btnAumentarFonte");
const btnDiminuirFonte = document.getElementById("btnDiminuirFonte");

if (btnAumentarFonte) {
    btnAumentarFonte.addEventListener("click", aumentarFonte);
}

if (btnDiminuirFonte) {
    btnDiminuirFonte.addEventListener("click", diminuirFonte);
}


// Reaplica preferências salvas ao carregar a página


function aplicarPreferenciasSalvas() {
    if (localStorage.getItem("altoContraste") === "1") {
        document.body.classList.add("alto-contraste");
    }

    if (localStorage.getItem("modoNoturno") === "1") {
        document.body.classList.add("modo-noturno");
        atualizarIconeModoNoturno();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicarPreferenciasSalvas);
} else {
    aplicarPreferenciasSalvas();
}


// Atalhos de teclado


function mostrarAtalhos() {
    alert(
        "Atalhos disponíveis:\n\n" +
        "Alt + A — Abrir/fechar painel de acessibilidade\n" +
        "Alt + C — Alternar alto contraste\n" +
        "Alt + N — Alternar modo noturno\n" +
        "Alt + (+) — Aumentar fonte\n" +
        "Alt + (-) — Diminuir fonte\n" +
        "Alt + L — Abrir intérprete de Libras\n" +
        "Alt + → — Próximo botão/link da página\n" +
        "Alt + ← — Botão/link anterior\n" +
        "Alt + K — Mostrar esta lista de atalhos"
    );
}

const itemAtalhos = document.getElementById("itemAtalhos");

if (itemAtalhos) {
    itemAtalhos.addEventListener("click", mostrarAtalhos);
}

document.addEventListener("keydown", (e) => {
    if (!e.altKey) return;

    switch (e.key.toLowerCase()) {

        case "k":
            e.preventDefault();
            mostrarAtalhos();
            break;

        case "arrowright":
            e.preventDefault();
            moverFoco("proximo");
            break;

        case "arrowleft":
            e.preventDefault();
            moverFoco("anterior");
            break;

        case "a":
            e.preventDefault();
            painelAcessibilidade.classList.toggle("ativo");
            break;

        case "c":
            e.preventDefault();
            alternarContraste();
            break;

        case "n":
            e.preventDefault();
            alternarModoNoturno();
            break;

        case "+":
        case "=":
            e.preventDefault();
            aumentarFonte();
            break;

        case "-":
            e.preventDefault();
            diminuirFonte();
            break;

        case "l":
            e.preventDefault();
            if (itemAbrirLibras) {
                itemAbrirLibras.click();
            }
            break;
    }
});


// Navegação por botões/links 

function elementosFocaveis() {
    const seletor = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';
    return Array.from(document.querySelectorAll(seletor)).filter(el => {
        return el.offsetParent !== null;
    });
}

function moverFoco(direcao) {
    const elementos = elementosFocaveis();
    if (elementos.length === 0) return;

    const indiceAtual = elementos.indexOf(document.activeElement);
    let proximoIndice;

    if (indiceAtual === -1) {
        proximoIndice = direcao === "proximo" ? 0 : elementos.length - 1;
    } else {
        proximoIndice = direcao === "proximo"
            ? (indiceAtual + 1) % elementos.length
            : (indiceAtual - 1 + elementos.length) % elementos.length;
    }

    elementos[proximoIndice].focus();
    elementos[proximoIndice].scrollIntoView({ behavior: "smooth", block: "center" });
}


// Carrossel dos cards (setinhas) — só tem efeito visual quando o CSS
// ativa o scroll horizontal (mobile)

const cardsContainer = document.getElementById("cardsContainer");
const cardsPrev = document.getElementById("cardsPrev");
const cardsNext = document.getElementById("cardsNext");

if (cardsContainer && cardsPrev && cardsNext) {
    const distanciaScroll = () => {
        const primeiroCard = cardsContainer.querySelector(".card, .curso-card");
        if (!primeiroCard) return 260;
        const estilo = getComputedStyle(cardsContainer);
        const gap = parseInt(estilo.columnGap || estilo.gap || "16", 10) || 16;
        return primeiroCard.getBoundingClientRect().width + gap;
    };

    cardsPrev.addEventListener("click", () => {
        cardsContainer.scrollBy({ left: -distanciaScroll(), behavior: "smooth" });
    });

    cardsNext.addEventListener("click", () => {
        cardsContainer.scrollBy({ left: distanciaScroll(), behavior: "smooth" });
    });
}


// Accordion do rodapé (mobile) — só tem efeito visual quando o CSS
// esconde .footer-col-conteudo por padrão (breakpoint mobile)

const acordeoesFooter = document.querySelectorAll(".footer-col-titulo");

acordeoesFooter.forEach((titulo) => {
    const abrirFechar = () => {
        const coluna = titulo.closest(".footer-col");
        const aberto = coluna.classList.toggle("aberto");
        titulo.setAttribute("aria-expanded", aberto);
    };

    titulo.addEventListener("click", abrirFechar);

    titulo.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrirFechar();
        }
    });
});
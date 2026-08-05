

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
    const botaoNativo = document.querySelector('div[vw-access-button]');
    if (botaoNativo) {
        callback(botaoNativo);
    } else if (tentativas < 50) {
        setTimeout(() => aguardarVLibras(callback, tentativas + 1), 100);
    }
}

const itemAbrirLibras = document.getElementById('abrirLibras');

if (itemAbrirLibras) {
    itemAbrirLibras.addEventListener('click', () => {
        aguardarVLibras((botaoNativo) => {
            botaoNativo.click();

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


document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("altoContraste") === "1") {
        document.body.classList.add("alto-contraste");
    }
});


// Atalhos de teclado


function mostrarAtalhos() {
    alert(
        "Atalhos disponíveis:\n\n" +
        "Alt + A — Abrir/fechar painel de acessibilidade\n" +
        "Alt + C — Alternar alto contraste\n" +
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
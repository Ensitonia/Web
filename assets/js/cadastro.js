import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCPfeeFtdmZSouMn4xLSJ78Kp_s8ie7W8I",
    authDomain: "ensintonia-77895.firebaseapp.com",
    projectId: "ensintonia-77895",
    storageBucket: "ensintonia-77895.firebasestorage.app",
    messagingSenderId: "529846177682",
    appId: "1:529846177682:web:723ade0cf8fbeb7b2e3b4b",
    measurementId: "G-3606ETPKHW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let tipoConta = "";

// Seleção do tipo de conta (com feedback visual)
const opcoesTipo = document.querySelectorAll(".tipo");
const camposEmpresa = document.getElementById("camposEmpresa");
const nomeEmpresaInput = document.getElementById("nomeEmpresa");
const cnpjInput = document.getElementById("cnpj");

function selecionarTipo(tipo, elemento) {
    tipoConta = tipo;
    opcoesTipo.forEach((o) => o.classList.remove("selecionado"));
    elemento.classList.add("selecionado");

    if (tipo === "empresa") {
        camposEmpresa.hidden = false;
    } else {
        camposEmpresa.hidden = true;
        nomeEmpresaInput.value = "";
        cnpjInput.value = "";
    }
}

const elAprendiz = document.getElementById("aprendiz");
const elEmpresa = document.getElementById("empresa");

if (elAprendiz) {
    elAprendiz.addEventListener("click", function () {
        selecionarTipo("aprendiz", this);
    });
} else {
    console.error("Elemento #aprendiz não encontrado na página.");
}

if (elEmpresa) {
    elEmpresa.addEventListener("click", function () {
        selecionarTipo("empresa", this);
    });
} else {
    console.error("Elemento #empresa não encontrado na página.");
}

// Máscara automática do CNPJ (00.000.000/0000-00)
function formatarCNPJ(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

if (cnpjInput) {
    cnpjInput.addEventListener("input", () => {
        cnpjInput.value = formatarCNPJ(cnpjInput.value);
    });
}

const form = document.querySelector("form");
const mensagemErro = document.getElementById("mensagemErro");

function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.hidden = false;
    mensagemErro.scrollIntoView({ behavior: "smooth", block: "center" });
}

function esconderErro() {
    mensagemErro.hidden = true;
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();
    esconderErro();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;

    if (nome === "" || email === "" || senha === "" || confirmar === "") {
        mostrarErro("Preencha todos os campos obrigatórios.");
        return;
    }

    if (senha.length < 6) {
        mostrarErro("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (senha !== confirmar) {
        mostrarErro("As senhas não coincidem.");
        return;
    }

    if (tipoConta === "") {
        mostrarErro("Escolha um tipo de conta.");
        return;
    }

    const nomeEmpresa = nomeEmpresaInput ? nomeEmpresaInput.value.trim() : "";
    const cnpj = cnpjInput ? cnpjInput.value.trim() : "";

    if (tipoConta === "empresa") {
        if (nomeEmpresa === "" || cnpj === "") {
            mostrarErro("Preencha o nome da empresa e o CNPJ.");
            return;
        }

        const cnpjValido = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
        if (!cnpjValido) {
            mostrarErro("Digite um CNPJ válido no formato 00.000.000/0000-00.");
            return;
        }
    }

    try {

        const usuario = await createUserWithEmailAndPassword(auth, email, senha);

        await updateProfile(usuario.user, {
            displayName: nome
        });

        const dadosUsuario = {
            nome,
            email,
            tipoConta
        };

        if (tipoConta === "empresa") {
            dadosUsuario.nomeEmpresa = nomeEmpresa;
            dadosUsuario.cnpj = cnpj;
        }

        await setDoc(doc(db, "usuarios", usuario.user.uid), dadosUsuario);

        window.location.href = "entrar.html";

    } catch (erro) {

        if (erro.code === "auth/email-already-in-use") {
            mostrarErro("Esse e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
        } else if (erro.code === "auth/invalid-email") {
            mostrarErro("E-mail inválido.");
        } else {
            mostrarErro("Erro: " + erro.message);
        }

    }

});
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

function selecionarTipo(tipo, elemento) {
    tipoConta = tipo;
    opcoesTipo.forEach((o) => o.classList.remove("selecionado"));
    elemento.classList.add("selecionado");
}

document.getElementById("aprendiz").addEventListener("click", function () {
    selecionarTipo("aprendiz", this);
});

document.getElementById("empresa").addEventListener("click", function () {
    selecionarTipo("empresa", this);
});

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;

    if (nome === "" || email === "" || senha === "" || confirmar === "") {
        alert("Preencha todos os campos.");
        return;
    }

    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (senha !== confirmar) {
        alert("As senhas não coincidem.");
        return;
    }

    if (tipoConta === "") {
        alert("Escolha um tipo de conta.");
        return;
    }

    try {

        const usuario = await createUserWithEmailAndPassword(auth, email, senha);

        await updateProfile(usuario.user, {
            displayName: nome
        });

        await setDoc(doc(db, "usuarios", usuario.user.uid), {
            nome,
            email,
            tipoConta
        });

        window.location.href = "entrar.html";

    } catch (erro) {

        if (erro.code === "auth/email-already-in-use") {
            alert("Esse e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
        } else if (erro.code === "auth/invalid-email") {
            alert("E-mail inválido.");
        } else {
            alert("Erro: " + erro.message);
        }

    }

});
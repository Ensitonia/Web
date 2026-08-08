import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCPfeeFtdmZSouMn4xLSJ78Kp_s8ie7W8I",
    authDomain: "ensintonia-77895.firebaseapp.com",
    projectId: "ensintonia-77895",
    storageBucket: "ensintonia-77895.firebasestorage.app",
    messagingSenderId: "529846177682",
    appId: "1:529846177682:web:723ade0cf8fbeb7b2e3b4b",
    measurementId: "G-3606ETPKHW"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("formRecuperar");
const mensagem = document.getElementById("mensagemRecuperar");
const botao = form.querySelector("button[type='submit']");

function mostrarMensagem(texto, tipo) {
    mensagem.hidden = false;
    mensagem.textContent = texto;
    mensagem.style.color = tipo === "erro" ? "#c0392b" : "#03948A";
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
        mostrarMensagem("Digite um e-mail.", "erro");
        return;
    }

    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {

        await sendPasswordResetEmail(auth, email);

        mostrarMensagem(
            "Enviamos um link de redefinição para o seu e-mail. Confira também a caixa de spam.",
            "sucesso"
        );
        form.reset();

    } catch (erro) {

        if (erro.code === "auth/user-not-found") {
            // Por segurança, não revelamos se o e-mail existe ou não na base
            mostrarMensagem(
                "Se esse e-mail estiver cadastrado, você receberá um link de redefinição em instantes.",
                "sucesso"
            );
        } else if (erro.code === "auth/invalid-email") {
            mostrarMensagem("E-mail inválido.", "erro");
        } else if (erro.code === "auth/too-many-requests") {
            mostrarMensagem("Muitas tentativas. Aguarde um pouco antes de tentar novamente.", "erro");
        } else {
            mostrarMensagem("Erro: " + erro.message, "erro");
        }

    } finally {
        botao.disabled = false;
        botao.textContent = "Enviar link de redefinição";
    }

});
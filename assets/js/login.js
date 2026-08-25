import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc
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


const destinoPorTipo = {
    aprendiz: "cursos.html",
    empresa: "para-empresas.html"
};


const form = document.querySelector("form");
const aceitarPolitica = document.getElementById("aceitarPolitica");
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

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        mostrarErro("Preencha todos os campos obrigatórios.");
        return;
    }

    if (!aceitarPolitica.checked) {
        mostrarErro("Você precisa aceitar a Política de Privacidade para continuar.");
        return;
    }

    try {

        const credencial = await signInWithEmailAndPassword(auth, email, senha);

        // Busca o documento do usuário no Firestore pelo uid
        const usuarioRef = doc(db, "usuarios", credencial.user.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {
            mostrarErro("Login realizado, mas não encontramos seus dados de cadastro.");
            window.location.href = "../index.html";
            return;
        }

        const dados = usuarioSnap.data();
        const destino = destinoPorTipo[dados.tipoConta] || "../index.html";

        window.location.href = destino;

    } catch (erro) {

        if (erro.code === "auth/invalid-credential" || erro.code === "auth/wrong-password") {
            mostrarErro("E-mail ou senha incorretos.");
        } else if (erro.code === "auth/user-not-found") {
            mostrarErro("Não encontramos uma conta com esse e-mail.");
        } else {
            mostrarErro("Erro: " + erro.message);
        }

    }

});
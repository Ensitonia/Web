import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
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

// Evita inicializar o app duas vezes se outro script já inicializou nessa página
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {

    const btnLogin = document.querySelector(".btn-login");
    const btnCadastro = document.querySelector(".btn-cadastrar-se");

    // Usa o pai do botão de login como container (funciona com ou sem .acoes-header)
    const areaAcoes = btnLogin ? btnLogin.parentElement : document.querySelector(".acoes-header");
    if (!areaAcoes) return;

    if (user) {

        // Busca o nome no Firestore (fallback pro displayName do Auth)
        let nome = user.displayName || "Usuário";

        try {
            const snap = await getDoc(doc(db, "usuarios", user.uid));
            if (snap.exists() && snap.data().nome) {
                nome = snap.data().nome;
            }
        } catch (erro) {
            console.error("Erro ao buscar dados do usuário:", erro);
        }

        const primeiroNome = nome.trim().split(" ")[0];

        if (btnLogin) btnLogin.style.display = "none";
        if (btnCadastro) btnCadastro.style.display = "none";

        // Evita duplicar se o script rodar mais de uma vez
        if (areaAcoes.querySelector(".perfil-header")) return;

        const perfil = document.createElement("div");
        perfil.className = "perfil-header";
        perfil.innerHTML = `
            <div class="btn-perfil" id="btnPerfil" role="button" tabindex="0">
                <i class="fa-solid fa-circle-user icone-perfil"></i>
                <span class="nome-perfil">${primeiroNome}</span>
            </div>
            <div class="dropdown-perfil" id="dropdownPerfil">
                <button id="btnSair">Sair</button>
            </div>
        `;

        areaAcoes.appendChild(perfil);

        const btnPerfil = perfil.querySelector("#btnPerfil");
        const dropdown = perfil.querySelector("#dropdownPerfil");

        btnPerfil.addEventListener("click", () => {
            dropdown.classList.toggle("aberto");
        });

        btnPerfil.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                dropdown.classList.toggle("aberto");
            }
        });

        // Fecha o dropdown se clicar fora
        document.addEventListener("click", (e) => {
            if (!perfil.contains(e.target)) {
                dropdown.classList.remove("aberto");
            }
        });

        perfil.querySelector("#btnSair").addEventListener("click", async () => {
            await signOut(auth);
            window.location.href = "../index.html";
        });

    } else {

        if (btnLogin) btnLogin.style.display = "";
        if (btnCadastro) btnCadastro.style.display = "";

        const perfilExistente = areaAcoes.querySelector(".perfil-header");
        if (perfilExistente) perfilExistente.remove();

    }

});
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { mostrarToast } from "./toast.js";

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

const config = window.acessoConfig;

// Esconde a página até confirmar que o usuário pode ver o conteúdo,
// pra evitar o "flash" do conteúdo protegido antes do redirecionamento.
if (config && config.tipoPermitido) {
    document.documentElement.style.visibility = "hidden";
}

function liberarAcesso() {
    document.documentElement.style.visibility = "visible";
}

// Mostra o toast (que fica visível mesmo com a página escondida)
// e só redireciona depois de um tempo, pra dar tempo da pessoa ler.
function bloquear(mensagem, destino) {
    document.documentElement.style.visibility = "visible";
    mostrarToast(mensagem);

    setTimeout(() => {
        window.location.href = destino || "../index.html";
    }, 1800);
}

if (config && config.tipoPermitido) {

    onAuthStateChanged(auth, async (user) => {

        // Ninguém logado: não tem como saber o tipo de conta, então bloqueia
        if (!user) {
            bloquear(
                "Você precisa estar logado como empresa para acessar essa área.",
                config.redirecionarPara
            );
            return;
        }

        try {
            const snap = await getDoc(doc(db, "usuarios", user.uid));
            const tipoConta = snap.exists() ? snap.data().tipoConta : null;

            if (tipoConta !== config.tipoPermitido) {
                bloquear(
                    "Essa área é exclusiva para contas de empresa.",
                    config.redirecionarPara
                );
                return;
            }

            // Tipo de conta bate com o permitido: libera a página
            liberarAcesso();

        } catch (erro) {
            console.error("Erro ao verificar permissão de acesso:", erro);
            bloquear(
                "Não foi possível confirmar seu acesso. Tente novamente.",
                config.redirecionarPara
            );
        }

    });

}
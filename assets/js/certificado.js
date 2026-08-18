import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
const db = getFirestore(app);


async function buscarNomeUsuario() {
    const user = auth.currentUser;
    if (!user) return null;

    let nome = user.displayName || "Usuário";

    try {
        const snap = await getDoc(doc(db, "usuarios", user.uid));
        if (snap.exists() && snap.data().nome) {
            nome = snap.data().nome;
        }
    } catch (erro) {
        console.error("Erro ao buscar nome do usuário:", erro);
    }

    return nome;
}

function montarHtmlCertificado(nome, nomeCurso, cargaHoraria, dataEmissao) {
    const container = document.createElement("div");
    container.id = "certificado-render";

    container.innerHTML = `
        <style>
            #certificado-render {
                position: fixed;
                top: -99999px;
                left: -99999px;
                width: 1400px;
                height: 990px;
                font-family: "Inter", Arial, sans-serif;
                box-sizing: border-box;
                background: linear-gradient(135deg, #F3E7FA 0%, #ffffff 55%, #F3E7FA 100%);
                padding: 40px;
            }

            #certificado-render * {
                box-sizing: border-box;
            }

            .cert-card {
                position: relative;
                width: 100%;
                height: 100%;
                background: #ffffff;
                border-radius: 28px;
                border: 3px solid #795EC9;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 60px 90px;
            }

            .cert-blob {
                position: absolute;
                border-radius: 50%;
                opacity: 0.85;
            }

            .cert-blob.roxo { background: #795EC9; }
            .cert-blob.verde { background: #03948A; }
            .cert-blob.laranja { background: #F6943C; }
            .cert-blob.lilas { background: #F3E7FA; }

            .cert-top-wave {
                position: absolute;
                top: -120px;
                left: -120px;
                width: 340px;
                height: 340px;
                background: #F3E7FA;
                border-radius: 50%;
            }

            .cert-top-wave::after {
                content: "";
                position: absolute;
                top: 60px;
                left: 60px;
                width: 120px;
                height: 120px;
                background: #ffffff;
                border-radius: 50%;
            }

            .cert-bottom-wave {
                position: absolute;
                bottom: -160px;
                right: -160px;
                width: 420px;
                height: 420px;
                background: #F3E7FA;
                border-radius: 50%;
            }

            .cert-logo-row {
                display: flex;
                align-items: center;
                gap: 14px;
                margin-bottom: 18px;
                z-index: 2;
            }

            .cert-logo-row img {
                height: 56px;
            }

            .cert-logo-fallback {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .cert-dot {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: inline-block;
            }

            .cert-marca {
                font-size: 30px;
                font-weight: 700;
                color: #795EC9;
                letter-spacing: -0.5px;
            }

            .cert-titulo {
                font-size: 46px;
                font-weight: 800;
                color: #795EC9;
                margin: 6px 0 4px 0;
                z-index: 2;
            }

            .cert-linha-decorativa {
                width: 140px;
                height: 6px;
                border-radius: 6px;
                background: linear-gradient(90deg, #795EC9, #03948A, #F6943C);
                margin: 10px 0 26px 0;
                z-index: 2;
            }

            .cert-texto {
                font-size: 22px;
                color: #333333;
                z-index: 2;
            }

            .cert-nome {
                font-size: 44px;
                font-weight: 800;
                color: #03948A;
                margin: 10px 0 18px 0;
                z-index: 2;
            }

            .cert-curso {
                font-size: 22px;
                color: #333333;
                max-width: 900px;
                line-height: 1.5;
                z-index: 2;
            }

            .cert-curso strong {
                color: #795EC9;
            }

            .cert-rodape {
                margin-top: 44px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                max-width: 980px;
                z-index: 2;
            }

            .cert-data {
                font-size: 16px;
                color: #666666;
                text-align: left;
            }

            .cert-selo {
                width: 92px;
                height: 92px;
                border-radius: 50%;
                background: #795EC9;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .cert-selo-interno {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: #ffffff;
                border: 3px solid #03948A;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 34px;
                color: #03948A;
                font-weight: 800;
            }

            .cert-assinatura {
                font-size: 16px;
                color: #666666;
                text-align: right;
            }

            .cert-assinatura strong {
                display: block;
                color: #795EC9;
                font-size: 18px;
            }
        </style>

        <div class="cert-card">
            <div class="cert-top-wave"></div>
            <div class="cert-bottom-wave"></div>

            <div class="cert-blob roxo" style="width:22px;height:22px;top:50px;right:110px;"></div>
            <div class="cert-blob verde" style="width:14px;height:14px;top:90px;right:80px;"></div>
            <div class="cert-blob laranja" style="width:18px;height:18px;top:130px;right:130px;"></div>

            <div class="cert-blob verde" style="width:20px;height:20px;bottom:60px;left:100px;"></div>
            <div class="cert-blob roxo" style="width:14px;height:14px;bottom:100px;left:70px;"></div>
            <div class="cert-blob laranja" style="width:16px;height:16px;bottom:40px;left:150px;"></div>

            <div class="cert-logo-row" id="cert-logo-area">
                <div class="cert-logo-fallback">
                    <span class="cert-dot" style="background:#795EC9;"></span>
                    <span class="cert-dot" style="background:#03948A;"></span>
                    <span class="cert-dot" style="background:#F6943C;"></span>
                    <span class="cert-marca">EnSintonia</span>
                </div>
            </div>

            <div class="cert-titulo">Certificado de Conclusão</div>
            <div class="cert-linha-decorativa"></div>

            <div class="cert-texto">Certificamos que</div>
            <div class="cert-nome">${nome}</div>
            <div class="cert-curso">
                concluiu com êxito o curso <strong>"${nomeCurso}"</strong>${cargaHoraria ? `, com carga horária de ${cargaHoraria}` : ""},
                através da plataforma EnSintonia — inclusão que transforma.
            </div>

            <div class="cert-rodape">
                <div class="cert-data">Emitido em<br>${dataEmissao}</div>
                <div class="cert-selo">
                    <div class="cert-selo-interno">✓</div>
                </div>
                <div class="cert-assinatura">
                    <strong>EnSintonia</strong>
                    Plataforma de inclusão
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);
    return container;
}

function tentarInserirLogo(container, caminho) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const area = container.querySelector("#cert-logo-area");
            area.innerHTML = `<img src="${caminho}" alt="EnSintonia">`;
            resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = caminho;
    });
}


export async function gerarCertificado(nomeCurso, cargaHoraria) {

    const nome = await buscarNomeUsuario();

    if (!nome) {
        alert("Você precisa estar logado para emitir o certificado.");
        return;
    }

    if (typeof html2canvas === "undefined") {
        alert("Erro interno: html2canvas não foi carregado nesta página.");
        return;
    }

    const dataEmissao = new Date().toLocaleDateString("pt-BR");
    const container = montarHtmlCertificado(nome, nomeCurso, cargaHoraria, dataEmissao);

   
    await tentarInserirLogo(container, "../assets/images/logo.png");

    const canvas = await html2canvas(container.querySelector(".cert-card"), {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const docPdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    const largura = docPdf.internal.pageSize.getWidth();
    const altura = docPdf.internal.pageSize.getHeight();

    docPdf.addImage(imgData, "PNG", 0, 0, largura, altura);
    docPdf.save(`certificado-${nome.trim().split(" ")[0].toLowerCase()}.pdf`);
}
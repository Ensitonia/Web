import { gerarCertificado } from "./certificado.js";



const config = window.configQuiz;

if (!config) {
    console.error("window.configQuiz não foi definido nesta página. O quiz não será corrigido.");
} else {

    const formQuestoes = document.getElementById("formQuestoes");
    const avisoQuestoes = document.getElementById("avisoQuestoes");

    formQuestoes.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const nomesQuestoes = Object.keys(config.gabarito);

        const perguntasRespondidas = nomesQuestoes.every(
            (nome) => formQuestoes.querySelector(`input[name="${nome}"]:checked`)
        );

        if (!perguntasRespondidas) {
            avisoQuestoes.hidden = false;
            avisoQuestoes.textContent = "Responda todas as questões antes de finalizar.";
            avisoQuestoes.focus();
            return;
        }

        // Corrige as respostas
        let acertos = 0;

        nomesQuestoes.forEach((nome) => {
            const selecionado = formQuestoes.querySelector(`input[name="${nome}"]:checked`);
            if (selecionado && selecionado.value === config.gabarito[nome]) {
                acertos++;
            }
        });

        const notaFinal = Math.round((acertos / nomesQuestoes.length) * 100);
        const notaMinima = config.notaMinima ?? 70;

        if (notaFinal < notaMinima) {
            avisoQuestoes.hidden = false;
            avisoQuestoes.textContent = `Você acertou ${acertos} de ${nomesQuestoes.length} questões (${notaFinal}%). É preciso pelo menos ${notaMinima}% para emitir o certificado. Revise o conteúdo e tente novamente.`;
            avisoQuestoes.focus();
            return;
        }

        avisoQuestoes.hidden = true;

        await gerarCertificado(config.nomeCurso, config.cargaHoraria);

        window.location.href = "./cursos.html";

    });

}
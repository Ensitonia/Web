export function mostrarToast(mensagem) {
    const existente = document.querySelector(".toast-ensintonia");
    if (existente) existente.remove();

    const toast = document.createElement("div");
    toast.className = "toast-ensintonia";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-info"></i>
        <span>${mensagem}</span>
    `;
    document.body.appendChild(toast);

    // pequeno delay pra garantir que a transição de entrada rode
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add("visivel"));
    });

    setTimeout(() => {
        toast.classList.remove("visivel");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
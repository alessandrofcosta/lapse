document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".status-container").forEach(ficha => {
        const vidaAtual = ficha.querySelector(".vida-atual");
        const sanidadeAtual = ficha.querySelector(".sanidade-atual");

        function limitarValor(elemento) {
            let valorNumerico = parseInt(elemento.textContent.replace(/\D/g, ""), 10); // Remove tudo que não for número
            let max = parseInt(elemento.dataset.max, 10);
            let min = parseInt(elemento.dataset.min, 10);

            if (isNaN(valorNumerico)) {
                elemento.textContent = ""; // Permite campo vazio temporariamente
            } else if (valorNumerico < min) {
                elemento.textContent = min;
            } else if (valorNumerico > max) {
                elemento.textContent = max;
            } else {
                elemento.textContent = valorNumerico; // Mantém apenas números válidos
            }
        }

        function restaurarValorSeVazio(elemento) {
            if (elemento.textContent.trim() === "") {
                elemento.textContent = elemento.dataset.min; // Retorna ao mínimo se estiver vazio ao sair do campo
            }
        }

        [vidaAtual, sanidadeAtual].forEach(elemento => {
            elemento.addEventListener("input", () => limitarValor(elemento));

            elemento.addEventListener("blur", () => restaurarValorSeVazio(elemento));

            elemento.addEventListener("keydown", (event) => {
                // Permitir apenas números, Backspace e as setas do teclado
                if (!/[0-9]/.test(event.key) && 
                    event.key !== "Backspace" && 
                    event.key !== "ArrowLeft" && 
                    event.key !== "ArrowRight" && 
                    event.key !== "Delete" && 
                    event.key !== "Enter") {
                    event.preventDefault();
                }

                if (event.key === "Enter") {
                    event.preventDefault();
                    elemento.blur(); // Sai do modo de edição
                }
            });
        });
    });
});

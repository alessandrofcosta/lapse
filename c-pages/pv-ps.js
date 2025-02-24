document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".status-container").forEach(ficha => {
        const vidaAtual = ficha.querySelector(".vida-atual");
        const sanidadeAtual = ficha.querySelector(".sanidade-atual");

        function limitarValor(elemento) {
            let valorNumerico = parseInt(elemento.textContent);
            let max = parseInt(elemento.dataset.max);
            let min = parseInt(elemento.dataset.min);

            if (isNaN(valorNumerico)) {
                elemento.textContent = ""; // Permite campo vazio temporariamente
            } else if (valorNumerico < min) {
                elemento.textContent = min;
            } else if (valorNumerico > max) {
                elemento.textContent = max;
            }
        }

        function restaurarValorSeVazio(elemento) {
            if (elemento.textContent.trim() === "") {
                elemento.textContent = elemento.dataset.min; // Retorna ao mínimo se estiver vazio ao sair do campo
            }
        }

        vidaAtual.addEventListener("input", () => limitarValor(vidaAtual));
        sanidadeAtual.addEventListener("input", () => limitarValor(sanidadeAtual));

        vidaAtual.addEventListener("blur", () => restaurarValorSeVazio(vidaAtual));
        sanidadeAtual.addEventListener("blur", () => restaurarValorSeVazio(sanidadeAtual));

        [vidaAtual, sanidadeAtual].forEach(elemento => {
            elemento.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    elemento.blur(); // Sai do modo de edição
                }
            });
        });
    });
});

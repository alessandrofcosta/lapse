document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".status-container").forEach((ficha, index) => {
        const vidaAtual = ficha.querySelector(".vida-atual");
        const sanidadeAtual = ficha.querySelector(".sanidade-atual");
        
        function salvarValorNoStorage() {
            const estado = {
                vida: vidaAtual.textContent,
                sanidade: sanidadeAtual.textContent
            };
            localStorage.setItem(`ficha_${index}`, JSON.stringify(estado));
        }

        function carregarValorDoStorage() {
            const estadoSalvo = localStorage.getItem(`ficha_${index}`);
            if (estadoSalvo) {
                const estado = JSON.parse(estadoSalvo);
                vidaAtual.textContent = estado.vida;
                sanidadeAtual.textContent = estado.sanidade;
            }
        }
        
        function limitarValor(elemento) {
            let valorNumerico = parseInt(elemento.textContent.replace(/\D/g, ""), 10);
            let max = parseInt(elemento.dataset.max, 10);
            let min = parseInt(elemento.dataset.min, 10);

            if (isNaN(valorNumerico)) {
                elemento.textContent = "";
            } else if (valorNumerico < min) {
                elemento.textContent = min;
            } else if (valorNumerico > max) {
                elemento.textContent = max;
            } else {
                elemento.textContent = valorNumerico;
            }
        }

        function restaurarValorSeVazio(elemento) {
            if (elemento.textContent.trim() === "") {
                elemento.textContent = elemento.dataset.min;
            }
        }

        [vidaAtual, sanidadeAtual].forEach(elemento => {
            elemento.addEventListener("input", () => {
                limitarValor(elemento);
                salvarValorNoStorage();
            });

            elemento.addEventListener("blur", () => {
                restaurarValorSeVazio(elemento);
                salvarValorNoStorage();
            });

            elemento.addEventListener("keydown", (event) => {
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
                    elemento.blur();
                }
            });
        });

        carregarValorDoStorage();
    });
});

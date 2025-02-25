document.addEventListener("DOMContentLoaded", () => {
    const webhookURL = "https://discord.com/api/webhooks/1343770651525120051/C_pG97T2EEifIN7Ov4dRvzG3phpnj0iGHX202EvfHmpbrvD4ZV7EPrxMaKVg8YAlJ71q";

    document.querySelectorAll(".rolar-pericia").forEach(button => {
        button.addEventListener("click", (event) => {
            const button = event.target;
            const atributo = button.getAttribute("data-atr") || 0;
            const pericia = button.getAttribute("data-per") || 0;

            const mensagem = {
                content: `d20+${atributo}+${pericia}`
            };

            fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mensagem)
            })
            .then(response => console.log("Enviado!", response))
            .catch(error => console.error("Erro:", error));
        });
    });
});

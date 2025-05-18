function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

function sendMessage(message) {
    webhookURL = 'https://discord.com/api/webhooks/1373715908299718787/WtnyLk11LVlSfBysRCPRCDc0I9uGYUAUSNo2MeECvtbA8kHT9GPt_FbBe1ROPpcOq37o';

    const mensagem = {
        content: message
    };

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensagem)
    })
    .then(response => console.log("Enviado!", response))
    .catch(error => console.error("Erro:", error));
}

const rollButtonElement = document.querySelectorAll('.js-roll-button')

rollButtonElement.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('selected');
        rollDice();
        button.classList.remove('selected');
    })
});


function rollDice() {
    selected = document.querySelector('.selected');
    dataDice = {
        atributoNome: selected.getAttribute('data-atributo-nome') || '',
        atributoBonus: Number(selected.getAttribute('data-atributo-bonus')) || 0,
        atributoSigla: selected.getAttribute('data-atributo-sigla'),
        periciaNome: selected.getAttribute('data-pericia-nome') || '',
        periciaValor: Number(selected.getAttribute('data-pericia-valor')) || 0,
        periciaBonus: Number(selected.getAttribute('data-pericia-bonus')) || 0,
        atributoValor: Number(selected.getAttribute('data-atributo')) || 0
    }

    if (!dataDice.atributoValor) {
        data[nomeAcesso].atributos.forEach((atributo) => {
            if (atributo.sigla === dataDice.atributoSigla) {
                dataDice.atributoValor = atributo.valor || 0;
                dataDice.atributoBonus = atributo.bonus || 0;
                dataDice.atributoNome = atributo.nome;
            }
        })
    }

    if (dataDice.atributoValor + dataDice.atributoBonus < 0 && dataDice.periciaValor + dataDice.periciaBonus < 0) {
        messageToSend = `1d20${dataDice.atributoValor + dataDice.atributoBonus}${dataDice.periciaValor + dataDice.periciaBonus}`
    } else if (dataDice.atributoValor + dataDice.atributoBonus < 0) {
        messageToSend = `1d20${dataDice.atributoValor + dataDice.atributoBonus}+${dataDice.periciaValor + dataDice.periciaBonus}`
    } else if (dataDice.periciaValor + dataDice.periciaBonus < 0) {
        messageToSend = `1d20+${dataDice.atributoValor + dataDice.atributoBonus}${dataDice.periciaValor + dataDice.periciaBonus}`
    } else {
        messageToSend = `1d20+${dataDice.atributoValor + dataDice.atributoBonus}+${dataDice.periciaValor + dataDice.periciaBonus}`
    }

    sendMessage(`-# <@${capitalize(data[nomeAcesso].info.discord_id)}> ${dataDice.periciaNome || dataDice.atributoNome}\n!rolar ${messageToSend}`)
}

const d20Button = document.querySelector('.js-d20-button');

d20Button.addEventListener('click', () => {
    sendMessage(`-# <@${capitalize(data[nomeAcesso].info.discord_id)}>\n!rolar 1d20`)
})
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function sendNPCMessage(message) {
    const webhookURLNPC = 'https://discord.com/api/webhooks/COLOQUE_AQUI/WEBHOOK_NPC';

    const mensagem = {
        content: message
    };

    fetch(webhookURLNPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mensagem)
    })
    .then(response => console.log('Enviado (NPC)!', response))
    .catch(error => console.error('Erro NPC:', error));
}

const rollButtonElement = document.querySelectorAll('.js-roll-button');

rollButtonElement.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('selected');
        rollDiceNPC();
        button.classList.remove('selected');
    });
});

function rollDiceNPC() {
    const selected = document.querySelector('.selected');
    const dataDice = {
        atributoNome: selected.getAttribute('data-atributo-nome') || '',
        atributoBonus: Number(selected.getAttribute('data-atributo-bonus')) || 0,
        atributoSigla: selected.getAttribute('data-atributo-sigla'),
        periciaNome: selected.getAttribute('data-pericia-nome') || '',
        periciaValor: Number(selected.getAttribute('data-pericia-valor')) || 0,
        periciaBonus: Number(selected.getAttribute('data-pericia-bonus')) || 0,
        atributoValor: Number(selected.getAttribute('data-atributo')) || 0,
        atributoPrestigio: Number(selected.getAttribute('data-prestigio')) || 1
    };

    if (!dataDice.atributoValor) {
        npcData[nomeAcessoNPC].atributos.forEach((atributo) => {
            if (atributo.sigla === dataDice.atributoSigla) {
                dataDice.atributoPrestigio = atributo.prestigio ?? 1;
                dataDice.atributoValor = atributo.valor || 0;
                dataDice.atributoBonus = atributo.bonus || 0;
                dataDice.atributoNome = atributo.nome;
            }
        });
    }

    let messageToSend = '';
    if (dataDice.atributoValor + dataDice.atributoBonus < 0 && dataDice.periciaValor + dataDice.periciaBonus < 0) {
        messageToSend = `${dataDice.atributoPrestigio}d20${dataDice.atributoValor + dataDice.atributoBonus}${dataDice.periciaValor + dataDice.periciaBonus}`;
    } else if (dataDice.atributoValor + dataDice.atributoBonus < 0) {
        messageToSend = `${dataDice.atributoPrestigio}d20${dataDice.atributoValor + dataDice.atributoBonus}+${dataDice.periciaValor + dataDice.periciaBonus}`;
    } else if (dataDice.periciaValor + dataDice.periciaBonus < 0) {
        messageToSend = `${dataDice.atributoPrestigio}d20+${dataDice.atributoValor + dataDice.atributoBonus}${dataDice.periciaValor + dataDice.periciaBonus}`;
    } else {
        messageToSend = `${dataDice.atributoPrestigio}d20+${dataDice.atributoValor + dataDice.atributoBonus}+${dataDice.periciaValor + dataDice.periciaBonus}`;
    }

    sendNPCMessage(`-# <@${capitalize(npcData[nomeAcessoNPC].info.discord_id)}> ${dataDice.periciaNome || dataDice.atributoNome}\n!rolar ${messageToSend}`);
}

const d20Button = document.querySelector('.js-d20-button');

d20Button.addEventListener('click', () => {
    sendNPCMessage(`-# <@${capitalize(npcData[nomeAcessoNPC].info.discord_id)}>\n!rolar 1d20`);
});

const rollAttackButtonElement = document.querySelectorAll('.js-roll-button-attack');

rollAttackButtonElement.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('selected');
        rollAttackDiceNPC();
        button.classList.remove('selected');
    });
});

function rollAttackDiceNPC() {
    const selected = document.querySelector('.selected');
    const dano = selected.getAttribute('data-dano');
    const nome = selected.getAttribute('data-nome');
    const efeito = selected.getAttribute('data-efeito');

    if (dano === 'undefined') {
        sendNPCMessage(`-# <@${capitalize(npcData[nomeAcessoNPC].info.discord_id)}> ${nome}\n\`${efeito}\`\nHabilidade sem dano.`);
    } else {
        sendNPCMessage(`-# <@${capitalize(npcData[nomeAcessoNPC].info.discord_id)}> ${nome}\n\`${efeito}\`\n!rolar ${dano}`);
    }
}

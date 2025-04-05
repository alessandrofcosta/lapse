const elements = {
    info: document.querySelector('.js-info-container'),
    status: document.querySelector('.js-status-container'),
    atributo1: document.querySelector('.js-atributo-dado-1'),
    atributo2: document.querySelector('.js-atributo-dado-2'),
    pericia: document.querySelector('.js-dado-pericia-container'),
    habilidade: document.querySelector('.js-habilidade-container'),
    ataque: document.querySelector('.js-ataque-container'),
};

function renderInfo() {
    elements.info.innerHTML = 
    `
    <h1>Informações</h1>

    <div id="icontainers">
        <div class="dado-info-container">
            <p class="info">Idade</p> <p>${data[nomeAcesso].info.idade}</p>
        </div>
        <div class="dado-info-container">
            <p class="info">Altura</p> <p>${data[nomeAcesso].info.altura / 100}m</p>
        </div>
        <div class="dado-info-container">
            <p class="info">Peso</p> <p>${data[nomeAcesso].info.peso} Kg</p>
        </div>
        
        <div class="dado-info-container">
            <p class="info">Classe social</p><p>${data[nomeAcesso].info.classe}</p>
        </div>
        
        <div class="dado-info-container">
            <p class="info">Arquétipo</p><p>${data[nomeAcesso].info.arquetipo}</p>
        </div>
    </div>
    `
}

function renderStatus() {
    elements.status.innerHTML = 
    `
    <div class="pv-container">
        <p id="pv">PV</p> <p id="pv-info"><span contenteditable="true" data-max="${data[nomeAcesso].atributos[0].pv}" data-min="0" class="vida-atual">${data[nomeAcesso].atributos[0].pv}</span> / ${data[nomeAcesso].atributos[0].pv}</p>
    </div>
    <div class="ps-container">
        <p id="ps">PS</p> <p id="ps-info"><span contenteditable="true" data-max="${data[nomeAcesso].atributos[0].ps}" data-min="0" class="sanidade-atual">${data[nomeAcesso].atributos[0].ps}</span> / ${data[nomeAcesso].atributos[0].ps}</p>
    </div>
    `
}

function renderAtributo() {
    let atributoElement1HTML = ''
    let atributoElement2HTML = ''
    for (let i = 1; i <= 3; i++) { 
        atributoElement1HTML += 
        `
        <p class="atributos"><button class="roll-button-atributo  js-roll-button" data-atributo-nome="${data[nomeAcesso].atributos[i].nome}" data-atributo="${data[nomeAcesso].atributos[i].valor}" data-atributo-bonus="${data[nomeAcesso].atributos[i].bonus || 0}"><img src="../../media/dado-d20.png"></img></button> [${data[nomeAcesso].atributos[i].sigla}] ${data[nomeAcesso].atributos[i].nome}: <span class="atributo-info-number">0${data[nomeAcesso].atributos[i].valor}</span> <span>${formatBonus(data[nomeAcesso].atributos[i].bonus) || ''}</span></p>
        `
    }
    
    for (let i = 4; i <= 6; i++) { 
        atributoElement2HTML += 
        `
        <p class="atributos"><button class="roll-button-atributo js-roll-button" data-atributo-nome="${data[nomeAcesso].atributos[i].nome}" data-atributo="${data[nomeAcesso].atributos[i].valor}" data-atributo-bonus="${data[nomeAcesso].atributos[i].bonus || 0}"><img src="../../media/dado-d20.png"></img></button> [${data[nomeAcesso].atributos[i].sigla}] ${data[nomeAcesso].atributos[i].nome}: <span class="atributo-info-number">0${data[nomeAcesso].atributos[i].valor}</span> <span>${formatBonus(data[nomeAcesso].atributos[i].bonus) || ''}</span></p>
        `
    }
    
    elements.atributo1.innerHTML = atributoElement1HTML;
    elements.atributo2.innerHTML = atributoElement2HTML;
}

function renderPericia() {
    let periciaTitleHTML = '';
    let innerPericiaHTML = '';
    let periciaHTML = '';
    
    data[nomeAcesso].pericias.forEach((valor) => {
        periciaTitleHTML += 
        `
            <div class="pericia js-pericia">
                <h1 class="titulo-pericia">${valor.atributo}</h1>
            
        `
    
        valor.pericia_valor.forEach((pericia) => {
            innerPericiaHTML += 
            `
                <p class="pericias"><button class="roll-button-pericia js-roll-button" data-atributo-sigla="${valor.atributo}" data-pericia-nome="${pericia.nome}" data-pericia-valor="${pericia.valor}" data-pericia-bonus="${pericia.bonus || 0}"><img src="../../media/dado-d20.png"></img></button> <span class="pericia-info">${pericia.nome}</span><span class="pericia-info-number">${pericia.valor}/15</span> <strong>${formatBonus(pericia.bonus) || ''}</strong></p>
            `;
        })
    
        periciaHTML += periciaTitleHTML + innerPericiaHTML + '</div>';
        innerPericiaHTML = '';
        periciaTitleHTML = '';
    })
    
    elements.pericia.innerHTML = periciaHTML;
}

function renderSomaPontos() {
    dataNome = data[nomeAcesso]
    totalPontos = 0
    dataNome.atributos.forEach((atributo) => {
        totalPontos += atributo.valor || 0
    })

    dataNome.pericias.forEach((pericia) => {
        pericia.pericia_valor.forEach((value) => {
            totalPontos += value.valor
        })
    })

    console.log(totalPontos)

    document.querySelector('.js-soma-pericia')
        .innerHTML = totalPontos
}

function renderHabilidade() {
    let habilidadesHTML = '<h1>Habilidades</h1>';
    let subhabilidadesHTML = ''
    data[nomeAcesso].habilidades.forEach((valor) => {
        if (valor.subataques) {
            habilidadesHTML += 
            `<div class="habilidade">
                <h2>${valor.nome} <span class="grimorio">${valor.grimorio}</span> <span class="nivel-habilidade">Nível ${valor.nivel}</span></h2>
                <p>${valor.descricao}</p> <br>
            `

            
            
            valor.subataques.forEach((sub) => {
                subhabilidadesHTML += 
                `
                <span class="lot-habilidade">${sub.nome} | ${sub.descricao}</span> <br>
                `

                habilidadesHTML += subhabilidadesHTML;
                subhabilidadesHTML = ''
            })
        } else {
            habilidadesHTML += 
            `<div class="habilidade">
                <h2>${valor.nome} <span class="grimorio">${valor.grimorio}</span> <span class="nivel-habilidade">Nível ${valor.nivel}</span></h2>
                <p>${valor.descricao}</p>
            </div>
            `
        }  
    })
    
    elements.habilidade.innerHTML = habilidadesHTML;
    
}

function renderAtaques() {
    let ataquesHTML = '';
    let efeitosHTML = '';
    let subhabilidadeHTML = '';
    let totalHTML = '<h1>Ataques</h1>';
    
    data[nomeAcesso].habilidades.forEach((valor) => {
        if (valor.subataques) {
            subhabilidadeHTML += `<p>${valor.nome} <br>`
            valor.subataques.forEach((sub) => {
                
                subhabilidadeHTML += 
                `
                <span class="divide-subhabilidade"><span class="subhabilidade">${sub.nome}</span> <span class="subataque-efeito">${sub.dano || sub.efeito}</span><br></span>
                `
            })
        } else {
            ataquesHTML += 
            `
            <p><span class="nome-habilidade">${valor.nome}</span>${valor.dano || ''}
            `
            valor.efeitos.forEach((valor) => {
            efeitosHTML += 
            `
            <span class="ataque-efeito">${valor || ''}</span>
            `;
    
            });
        }

        totalHTML += ataquesHTML + efeitosHTML + subhabilidadeHTML + '</p>';
        ataquesHTML = '';
        efeitosHTML = '';

        
    });
    
    elements.ataque.innerHTML = totalHTML
}

renderInfo();
renderStatus();
renderAtributo();
renderPericia();
renderSomaPontos();
renderHabilidade();
renderAtaques();


function formatBonus(num) {
    if (num > 0) {
        return `+${num}`
    } else if (num < 0) {
        return `${num}`
    }
}

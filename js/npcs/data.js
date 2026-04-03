const npcData = {

keshi: {
        info: {
            nome_data: 'keshi',
            nome: 'Keshi Kami Lapse',
            inspiracao: 0,
            nivel: 15,
            xp: 0,
            idade: '25',
            altura: 193,
            peso: 67,
            classe: 'Realeza',
            arquetipo: 'Feiticeiro',
            discord_id: '444832211401965568'
        },

        atributos: [
            { pv: 88, ps: 12 },
            { sigla: 'FOR', nome: 'Força', valor: 1 },
            { sigla: 'VIG', nome: 'Vigor', valor: 3 },
            { sigla: 'AGL', nome: 'Agilidade', valor: 5 },
            { sigla: 'INT', nome: 'Inteligência', valor: 10, bonus: 2, prestigio: 2 },
            { sigla: 'ESP', nome: 'Espírito', valor: 2 },
            { sigla: 'MAG', nome: 'Magia', valor: 10, bonus: 5, prestigio: 2 }
        ],

        pericias: [
            {
                atributo: 'MAG',
                pericia_valor: [
                    { nome: 'Grimório', valor: 15 },
                    { nome: 'Mana', valor: 15 },
                    { nome: 'Controle', valor: 1 },
                    { nome: 'Visão', valor: 5 },
                    { nome: 'Resistência', valor: 5 },
                    { nome: 'Intimidação', valor: 3 }
                ]
            },
            {
                atributo: 'INT',
                pericia_valor: [
                    { nome: 'História', valor: 2},
                    { nome: 'Intimidação', valor: 3 },
                    { nome: 'Persuasão', valor: 1 },
                    { nome: 'Percepção', valor: 2 }
                ]
            }
        ],

        habilidades: [
            {
                nome: 'Marca das Sombras',
                grimorio: 'Codex Lunar',
                nivel: 2,
                descricao: 'Marca o alvo e enfraquece suas resistências mágicas por 2 turnos.',
                dano: '1dMag + Mana',
                calculoDano: { atributo: 'MAG', pericia: 'Mana' },
                efeitos: ['[DEBUFF]']
            },
            {
                nome: 'Rasgo Astral',
                grimorio: 'Codex Lunar',
                nivel: 4,
                descricao: 'Concentra energia astral e abre um corte no espaço na direção do alvo.',
                dano: '1dMag + Controle',
                calculoDano: { atributo: 'MAG', pericia: 'Controle' },
                efeitos: ['[MAGIC] [BURST]']
            }
        ]
},

zerath: {
        info: {
            nome_data: 'zerath',
            nome: 'Zerath Vornak',
            inspiracao: 0,
            nivel: 16,
            xp: 0,
            idade: '45',
            altura: 190,
            peso: 80,
            classe: '-',
            arquetipo: 'Feiticeiro',
            discord_id: '405381448879702039'
        },

        atributos: [
            { pv: 88, ps: 15 },
            { sigla: 'FOR', nome: 'Força', valor: 2 },
            { sigla: 'VIG', nome: 'Vigor', valor: 10, prestigio: 2 },
            { sigla: 'AGL', nome: 'Agilidade', valor: 7 },
            { sigla: 'INT', nome: 'Inteligência', valor: 10 },
            { sigla: 'ESP', nome: 'Espírito', valor: 0 },
            { sigla: 'MAG', nome: 'Magia', valor: 5, prestigio: 4 }
        ],

        pericias: [
            {
                atributo: 'MAG',
                pericia_valor: [
                    { nome: 'Visão', valor: 10 },
                    { nome: 'Mana', valor: 15 },
                    { nome: 'Resistência', valor: 10 },
                ]
            },
        ],

        habilidades: [
            {
                nome: 'Armas de Sangue',
                grimorio: 'Mana',
                nivel: 1,
                descricao: 'O usuário cria formas de sangue, sejam armas ou projéteis que podem ser usados contra o alvo.',
                dano: '1dMag + Mana',
                calculoDano: { atributo: 'MAG', pericia: 'Mana' },
                efeitos: []
            },
            {
                nome: 'Poça de Sangue',
                grimorio: 'Mana',
                nivel: 2,
                descricao: 'O usuário cria uma poça de sangue no chão, que sobe lentamente e quando atinge um certo ponto da perna do(s) alvos o sangue enrijece e todos ficam presos.',
                dano: '',
                calculoDano: { atributo: '' },
                efeitos: ['[STUN]']
            },
            {
                nome: 'Envenenamento',
                grimorio: 'Mana',
                nivel: 2,
                descricao: 'O usuário cria uma tempestade brutal de sangue, podendo afetar quem ele quiser e deixar de afetar quem quiser também. A cada turno que se passa os alvos tomarão dano do sangue.',
                dano: '1dMag',
                calculoDano: { atributo: 'MAG'},
                efeitos: ['[POISON]']
            },
            {
                nome: 'Chuva de Sangue',
                grimorio: 'Mana',
                nivel: 3,
                descricao: ' O usuário cria uma tempestade brutal de sangue, podendo afetar quem ele quiser e deixar de afetar quem quiser também. A cada turno que se passa os alvos tomarão dano do sangue.',
                dano: '1dMag',
                calculoDano: { atributo: 'MAG'},
                efeitos: ['[SPEEDBLITZ] [AREA]']
            },
            {
                nome: 'Misericórdia',
                grimorio: 'Mana',
                nivel: 'Suprema',
                descricao: 'O usuário consegue reviver qualquer um desde que esteja ao ponto de morrer, ou morto há apenas alguns minutos. Qualquer um que seja revivido por ele estará marcado com seu sangue e irá inevitavelmente se tornar meio demônio.',
                dano: '',
                calculoDano: { atributo: ''},
                efeitos: ['[ESPECIAL] [REVIVE]']
            },
            {
                nome: 'Olho do Devorador',
                grimorio: 'Mana',
                nivel: 'Suprema',
                descricao: 'O usuário sacrifica sua própria vida para acabar com outra. O usuário tira todo o seu sangue de seu corpo e transfere para o alvo, o envenenando e matando-o instantaneamente.',
                dano: '',
                calculoDano: { atributo: ''},
                efeitos: ['[OUTRACING] [HITKILL]']
            },
            {
                nome: 'O Mundo Carmesin',
                grimorio: 'Zona de Mana',
                nivel: 'Zona de Mana',
                descricao: 'O usuário um território gigantesco de 1km quadrado onde tudo fica vermelho, árvores, vegetação, animais. Qualquer um dentro dessa área pode ser controlada pelo usuário, menos seres inteligentes, com excessão de sua sanidade estar muito baixa. Uma chuva de sangue toma por completo a região, inundando o chão de sangue também.',
                dano: '',
                calculoDano: { atributo: ''},
                efeitos: ['ZONA DE MANA']
            },
        ]
}

};

function normalizarArquetipo(arquetipo = '') {
    return arquetipo
        .toString()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .trim()
        .toLowerCase();
}

function calcularPvAutomatico(personagem) {
    const formulasPV = {
        tanque: { pvInicial: 15, pvPorNivel: 8 },
        lutador: { pvInicial: 13, pvPorNivel: 7 },
        cacador: { pvInicial: 10, pvPorNivel: 6 },
        feiticeiro: { pvInicial: 8, pvPorNivel: 4 },
        genio: { pvInicial: 7, pvPorNivel: 3 },
    };

    const arquetipoNormalizado = normalizarArquetipo(personagem?.info?.arquetipo);
    const formula = formulasPV[arquetipoNormalizado];

    if (!formula || !Array.isArray(personagem?.atributos) || !personagem.atributos[0]) {
        return;
    }

    const nivel = Number(personagem.info?.nivel) || 0;
    const atributoVigor = personagem.atributos.find((atributo) => atributo.sigla === 'VIG') || {};
    const vigor = Number(atributoVigor.valor) || 0;
    const prestigioVigor = Math.max(1, Number(atributoVigor.prestigio) || 1);
    const vidaPorPontoDeVigor = prestigioVigor;

    personagem.atributos[0].pv =
        formula.pvInicial +
        (formula.pvPorNivel * nivel) +
        (vigor * vidaPorPontoDeVigor);
}

Object.values(npcData).forEach(calcularPvAutomatico);

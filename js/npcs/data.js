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
    const bonusVidaPorPrestigio = (prestigioVigor - 1) * 10;

    personagem.atributos[0].pv =
        formula.pvInicial +
        (formula.pvPorNivel * nivel) +
        vigor +
        bonusVidaPorPrestigio;
}

Object.values(npcData).forEach(calcularPvAutomatico);

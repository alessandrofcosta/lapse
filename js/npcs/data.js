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
                get danoJS() {
                    const atributoSigla = 'MAG';
                    const periciaSigla = 'Mana';

                    const atributo = npcData.oraculo.atributos.find(attr => attr.sigla === atributoSigla);
                    const periciaBlock = npcData.oraculo.pericias.find(per => per.atributo === atributoSigla);
                    const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);

                    const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                    const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);

                    let dano = `1d${atributoValor}+${periciaValor}`;

                    if (atributo && typeof atributo.prestigio === 'number' && atributo.prestigio > 0) {
                        dano += `+${atributo.prestigio}d5`;
                    }

                    return dano;
                },
                efeitos: ['[DEBUFF]']
            },
            {
                nome: 'Rasgo Astral',
                grimorio: 'Codex Lunar',
                nivel: 4,
                descricao: 'Concentra energia astral e abre um corte no espaço na direção do alvo.',
                dano: '1dMag + Controle',
                get danoJS() {
                    const atributoSigla = 'MAG';
                    const periciaSigla = 'Controle';

                    const atributo = npcData.oraculo.atributos.find(attr => attr.sigla === atributoSigla);
                    const periciaBlock = npcData.oraculo.pericias.find(per => per.atributo === atributoSigla);
                    const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);

                    const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                    const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);

                    let dano = `1d${atributoValor}+${periciaValor}`;

                    if (atributo && typeof atributo.prestigio === 'number' && atributo.prestigio > 0) {
                        dano += `+${atributo.prestigio}d5`;
                    }

                    return dano;
                },
                efeitos: ['[MAGIC] [BURST]']
            }
        ]
}

};

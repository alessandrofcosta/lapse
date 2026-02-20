const npcData = {
    oraculo: {
        info: {
            nome_data: 'oraculo',
            nome: 'Oráculo do Eclipse',
            inspiracao: 0,
            nivel: 12,
            xp: 0,
            idade: 'Desconhecida',
            altura: 182,
            peso: 71,
            classe: 'Entidade',
            arquetipo: 'Controlador',
            discord_id: '1317246514535465010'
        },

        atributos: [
            { pv: 88, ps: 12 },
            { sigla: 'FOR', nome: 'Força', valor: 2 },
            { sigla: 'VIG', nome: 'Vigor', valor: 4 },
            { sigla: 'AGL', nome: 'Agilidade', valor: 3 },
            { sigla: 'INT', nome: 'Inteligência', valor: 7, bonus: 2 },
            { sigla: 'ESP', nome: 'Espírito', valor: 8, bonus: 2 },
            { sigla: 'MAG', nome: 'Magia', valor: 9, bonus: 3, prestigio: 2 }
        ],

        pericias: [
            {
                atributo: 'MAG',
                pericia_valor: [
                    { nome: 'Mana', valor: 9, bonus: 2 },
                    { nome: 'Controle', valor: 8, bonus: 2 },
                    { nome: 'Ritual', valor: 6 }
                ]
            },
            {
                atributo: 'ESP',
                pericia_valor: [
                    { nome: 'Intuição', valor: 8, bonus: 2 },
                    { nome: 'Presença', valor: 5 }
                ]
            },
            {
                atributo: 'INT',
                pericia_valor: [
                    { nome: 'Percepção', valor: 7, bonus: 1 },
                    { nome: 'Estratégia', valor: 6 }
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

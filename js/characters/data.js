const data = { 
    
indra: {
    info: { 
        nome_data: 'indra',
        nome: 'Indra Ashura',
        inspiracao: 1,
        nivel: 11,
        xp: 0,
        idade: 15,
        altura: 171,
        peso: 65,
        classe: 'Nobreza',
        arquetipo: 'Caçador',
        discord_id: '1317246514535465010'
    },
    
    atributos: [
        {pv: 79, ps: 6},
        {sigla: "FOR", nome: "Força", valor: 6},
        {sigla: "VIG", nome: "Vigor", valor: 3},
        {sigla: "AGL", nome: "Agilidade", valor: 4, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 3},
        {sigla: "MAG", nome: "Magia", valor: 8, bonus: 4, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 5, bonus: 2},
            {nome: "Visão", valor: 2},
            {nome: "Grimório", valor: 15, bonus: 2},
            {nome: "Controle", valor: 1},
        ]},
        {atributo: "AGL", pericia_valor: [
            {nome: "Reflexos", valor: 1},
            {nome: "Atletismo", valor: 0},
            {nome: "Esgrima", valor: 1},
            {nome: "Furtividade", valor: 0, bonus: -2},
        ]},
        {atributo: "ESP", pericia_valor: [
            {nome: "Persuasão", valor: 0, bonus: -2},
        ]},
        {atributo: "INT", pericia_valor: [
            {nome: "Persuasão", valor: 0, bonus: -2},
            {nome: "Percepção", valor: 1}
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Punho do Vazio',
            grimorio: 'Sem grimório',
            nivel: 2,
            descricao: 'Reveste seus punhos com energia sombria do abismo, os socos ignoram barreiras mágicas e armaduras, acertando diretamente o corpo do alvo, cada golpe bem-sucedido rouba uma pequena quantidade de mana do adversário, fortalecendo. Se um golpe conectar, ele pode roubar um pouco da mana do inimigo, recuperando sua própria mana.',
            dano: ' 1dMag + Mana',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Mana";
            
                const atributo = data.indra.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.indra.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
            efeitos: ['[BLOCK-BREAK]']
        },
        {
            nome: 'Ressurreição dos Derrotados',
            grimorio: 'Zwzl OꟻxᴙUvi',
            nivel: 'Zwzl OꟻxᴙUvi',
            descricao: 'Após derrotar um mago, Indra pode se comunicar com o resto de mana em seu corpo e caso o derrotado seja convencido, pode trazê-lo de volta a vida como seu servo leal. Todas as habilidades estarão disponíveis para o uso do monarca. Todo servo tem a capacidade diminuída pela metade. Servos não tem a capacidade de se comunicar, eles apenas obedecem ao monarca.',
            efeitos: ['[Zwzl OꟻxᴙUvi]'],
            subataques: [
                {nome: 'Lommie',
                descricao: '',
                efeitos: '[SUMMON]'},
                {nome: 'Chamado das Três Sombras',
                descricao: '',
                efeitos: '[SUMMON]'},
            ]
            
            
        },
        {
            nome: 'Correntes Espirituais Demoníacas ',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Invoca correntes espectrais que se conectam ao alvo e drenam sua mana lentamente, tornando-o mais fraco a cada segundo.',
            efeitos: ['[DEBUFF]'] 
        },
        {
            nome: 'Absorção Total',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Qualquer feitiço lançado contra ele é anulado e lançado com força total.',
            efeitos: ['[MIRROR]']
        },
        {
            nome: 'Cicatriz Arcana',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Após acertar três ataques no mesmo alvo, Indra marca a alma do inimigo com a Cicatriz de Arcana — uma ruptura espiritual que compromete o fluxo natural de energia mágica. Se o inimigo for mais fraco ou até do mesmo nível que Indra, ao tentar usar magia, o alvo sente dor espiritual intensa. Feitiços custam mais energia e têm chance de falhar.',
            efeitos: ['[DEBUFF] [PASSIVE]']
        },
        {
            nome: 'Devorada de mana',
            grimorio: 'Grimório',
            nivel: 3,
            descricao: 'Símbolos arcanos se acendem ao redor de Indra, formando um círculo suspenso. Cada marca desaba em uma explosão concentrada que atinge o inimigo com força física real, quebrando o corpo ao mesmo tempo em que suga sua mana no ponto de impacto. A magia drenada não desaparece: ela reforça os próximos ataques, criando uma sequência crescente de destruição.',
            efeitos: ['[DEBUFF]'],
            dano: ' 1dMag + Grimório',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Grimório";
            
                const atributo = data.indra.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.indra.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
        },
    ],
}, 

sombras: {
    info: { 
        nome_data: 'sombras',
        nome: 'Sombras',
        nivel: 13,
        xp: 0,
        idade: '∞',
        altura: '0',
        inspiracao: '',
        peso: '',
        classe: '',
        arquetipo: '',
        discord_id: '1317246514535465010'
    },
    
    atributos: [
        {pv: 79, ps: 6},
        {sigla: "FOR", nome: "Força", valor: 3},
        {sigla: "VIG", nome: "Vigor", valor: 2},
        {sigla: "AGL", nome: "Agilidade", valor: 8, bonus: 5, prestigio: 2},
        {sigla: "INT", nome: "Inteligência", valor: 0},
        {sigla: "ESP", nome: "Espírito", valor: 0},
        {sigla: "MAG", nome: "Magia", valor: 9, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 13},
            {nome: "Resistência", valor: 10, bonus: 5},
            {nome: "Esgrima", valor: 6, bonus: 5},
        ]},
        {atributo: "AGL", pericia_valor: [
            {nome: "Reflexos", valor: 5, bonus: 5},
            {nome: "Esgrima", valor: 6, bonus: 5},
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Chamado das Três Sombras',
            grimorio: 'Zwzl OꟻxᴙUvi',
            nivel: 'Zwzl OꟻxᴙUvi',
            descricao: 'Indra abre seu grimório e traça um único símbolo no ar. Uma única sombra é invocada e controlada por Indra enquanto ele quiser, essa sombra pode se transformar em Lancelot, Boei ou Aemond sem cobrança de turnos.',
            subataques: [
                {nome: 'Boei',
                descricao: `A presença de Boei distorce o conceito de ataque.
                Sempre que Indra é alvo de qualquer investida, Boei reage antes mesmo da intenção se tornar ação.
                O golpe é interceptado, absorvido ou simplesmente anulado.
                Para Boei, proteger Indra não é um ato consciente… é uma lei primordial do mundo.`,
                efeitos: '[BARRIER]'},
                {nome: 'Aemond',
                descricao: `A lâmina de Aemond corta primeiro, não o corpo, mas o vínculo entre carne e mana.
                No instante do acerto, o cajado desperta e abre um canal etéreo invisível.
                A mana do alvo, já instável, é sugada à força e drenada pelo cajado como um fluxo contínuo de sombras.

                O inimigo sente o corpo enfraquecer enquanto sua magia é arrancada gota por gota, incapaz de reagir ou se recompor.
                
                Aemond também pode absorver e cortar a mana de qualquer ataque que vier em sua direção usando seu cajado`,
                efeitos: '[DEBUFF]'},
            ]
            
            
        },
    ],
}, 

shiva: {
    info: { 
        nome_data: 'shiva',
        nome: 'Shiva Wyndell',
        nivel: 7,
        idade: 14,
        altura: 163,
        peso: 47,
        classe: 'Plebeu',
        arquetipo: 'Lutador',
        discord_id: '1213237748505251861'
    },
    
    atributos: [
        {pv: 47, ps: 8},
        {sigla: "FOR", nome: "Força", valor: 9, bonus: 3},
        {sigla: "VIG", nome: "Vigor", valor: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 0, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 0},
        {sigla: "MAG", nome: "Magia", valor: 3, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 3, bonus: 2},
            {nome: "Visão", valor: 0, bonus: -2},
            {nome: "Grimório", valor: 1, bonus: 2},
            {nome: "Controle", valor: 1},
        ]},
        {atributo: "FOR", pericia_valor: [
            {nome: "Luta", valor: 3},
        ]},
        {atributo: "AGL", pericia_valor: [
            {nome: "Atletismo", valor: 2},
            {nome: "Furtividade", valor: 0, bonus: -2},
        ]},
        {atributo: "ESP", pericia_valor: [
            {nome: "Intuição", valor: 0, bonus: -2},
        ]},
        {atributo: "INT", pericia_valor: [
            {nome: "Percepção", valor: 0, bonus: -2}
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Vácuo',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Cria um efeito em volta da cabeça do inimigo, impedindo-o de respirar, se mantido por muito tempo o inimigo pode até desmaiar por falta de ar.',
            efeitos: ['[DEBUFF]']
        },
        {
            nome: 'Esquiva do Vendaval',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Usa correntes de ar para desviar de um ataque.',
            efeitos: ['[BUFF]']
        },
        {
            nome: 'Vendaval',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Dispara uma sequência de socos e chutes potencializados por vento, fazendo inimigos atingidos serem arremessados para longe.',
            dano: ' 1dFor + Grimório',
            efeitos: []
        },
        {
            nome: 'Dança das Lâminas',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'O usuário controla o ar dentro do pulmão do adversário e cria várias lâminas minúsculas, cortando e ferindo o interior dos pulmões dele. O usuário pode utilizar essa habilidade uma vez por batalha, ao utilizar essa habilidade o usuário entra em exaustão e não conseguirá agir no seu próximo turno, além de ficar vulnerável a ataques.',
            dano: ' 2dMag + Grimório',
            efeitos: ['[OUTRACING]']
        },
    ],
}, 

saori: {
    info: { 
        nome_data: 'saori',
        nome: 'Saori Silva',
        nivel: 11,
        inspiracao: 1,
        xp: 0,
        idade: 15,
        altura: 151,
        peso: 45,
        classe: 'Realeza',
        arquetipo: 'Feiticeiro',
        discord_id: '522775874999943171'
    },
    
    atributos: [
        {pv: 56, ps: 6},
        {sigla: "FOR", nome: "Força", valor: 1},
        {sigla: "VIG", nome: "Vigor", valor: 4},
        {sigla: "AGL", nome: "Agilidade", valor: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1, bonus: 2},
        {sigla: "ESP", nome: "Espírito", valor: 3},
        {sigla: "MAG", nome: "Magia", valor: 2, bonus: 5, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 2, bonus: 2},
            {nome: "Visão", valor: 1},
            {nome: "Grimório", valor: 15, bonus: 2},
            {nome: "Controle", valor: 1},
        ]},
        {atributo: "AGL", pericia_valor: [
            {nome: "Reflexos", valor: 1},
        ]},
        {atributo: "ESP", pericia_valor: [
            {nome: "Persuasão", valor: 0, bonus: -2},
        ]},
        {atributo: "INT", pericia_valor: [
            {nome: "História", valor: 1, bonus: -2},
            {nome: "Persuasão", valor: 0, bonus: -2}
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Pressão Real (王者の圧 – Ōja no Atsu)',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Sua mera presença impõe uma força gravitacional intensa ao seu redor, tornando difícil para inimigos de menor resistência se moverem ou atacarem corretamente. Qualquer um abaixo de certo nível de poder sente seus corpos ficarem pesados na presença de Saori.',
            efeitos: ['[DEBUFF]']
        },
        {
            nome: 'Manto Gravitacional (重装の衣 – Jūsō no Koromo)',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Envolve seu corpo com uma aura gravitacional que reduz a força dos ataques inimigos e repele golpes físicos de forma automática.',
            efeitos: ['[BARRIER]']
        },
        {
            nome: 'Impacto Celestial (天衝 – Tenshō)',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Saori aponta para um alvo e aumenta abruptamente a gravidade em um ponto específico, fazendo com que o oponente seja esmagado contra o chão com uma força avassaladora. Quanto maior a diferença de poder, mais devastador o impacto.',
            dano: '1dMag + Grimório',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Grimório";
            
                const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
            efeitos: []
        },
        {
            nome: 'Estrela da Devastação (荒廃の星 - Kōhai no hoshi)',
            grimorio: 'Grimório ',
            nivel: 1,
            descricao: 'Acumula gravidade em um único ponto, formando uma singularidade. Essa singularidade absorve tudo ao ser redor e pode ser lançada aos inimigos causando dano em área.',
            dano: ' 1dMag',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Esgrima";
            
                const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
            efeitos: ['[AREA]']
        },
        {
            nome: 'Colapso Estelar (星墜 – Hōchitsu)',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Concentra uma grande massa gravitacional em um único ponto no ar, criando uma esfera compacta que atrai tudo ao seu redor. Após um tempo, a esfera implode, liberando uma explosão que distorce o espaço ao redor. ',
            dano: ' 1dMag + Grimório',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Grimório";
            
                const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
            efeitos: ['[AREA]']
        },
        {
            nome: 'Lança de Densidade Gravitacional (重槍 – Jūsō)',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Saori concentra a gravidade em um único ponto e molda essa força invisível em forma de uma lança negra translúcida, feita inteiramente de energia gravitacional condensada. Ao ser lançada, a lança atravessa o ar distorcendo o espaço ao redor, criando um som abafado e arrastado, como se a própria realidade estivesse sendo perfurada.',
            dano: ' 1dMag + Grimório',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Grimório";
            
                const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
            efeitos: ['[SPEEDBLITZ]']
        },
        {
            nome: 'Avatar Gravitacional: Acier Silva (重力の化身 – Jūryoku no Keshin)',
            grimorio: 'Grimório',
            nivel: 'Suprema',
            descricao: 'Essa é a habilidade suprema de Saori. Consiste em um avatar gigante no formato de sua mãe que vai se formando aos poucos. Os estágios do Avatar não podem ser pulados, todo estágio deve existir antes de seu sucessor.',
            subataques: [
                {
                    nome: '1º Estágio — Manifestação Esquelética (O Esqueleto da Gravidade)',
                    descricao: `Saori manifesta apenas a estrutura básica do avatar: 
                    Braços gigantes e uma silhueta incompleta formada por pressão gravitacional. Esses braços podem ser usados para atacar. 
                    Simbolismo: Orgulho sem controle emocional.`,
                    dano: '1dMag + Grimório',
                    efeitos: '[BLOCK-BREAK] [AREA]',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Grimório";
                    
                        const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `1d${atributoValor}+${periciaValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    },
                }, 
                
                {
                    nome: '2º Estágio — Avatar Parcial (A Guardiã de Prata)',
                    descricao: `O avatar ganha um tronco completo e um rosto nebuloso que lembra Acier Silva.
                                A gravidade agora começa a ter efeitos a todos em sua volta, qualquer um que estiver ao seu redor terão que fazer testes de resistência. 

                                Simbolismo: Aceitação gradual do legado.`,
                    dano: '2dMag + Grimório',
                    efeitos: '[DEBUFF]',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Grimório";
                    
                        const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `2d${atributoValor}+${periciaValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    },
                }, 

                {
                    nome: '3º Estágio — Avatar Completo (A Imperatriz Gravitacional)',
                    descricao: `Um gigante completo revestido por uma armadura de gravidade sólida. 
                                O usuário agora ganha uma espada gravitacional, além de uma defesa impenetrável. Seus movimentos agora são rápidos e precisos, fazendo o usuário se movimentar em alta velocidade usando sua mana como energia. Todo ataque desferido por Saori agora pode ser usado com magia.

                                Simbolismo: Honra plena ao nome Silva.`,
                    dano: '3dMag + Grimório',
                    efeitos: '[DEBUFF]',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Grimório";
                    
                        const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `3d${atributoValor}+${periciaValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    },
                }, 

                {
                    nome: 'Último Estágio — Forma Proibida (Colapso Estelar — A Gravidade do Luto)',
                    descricao: `Uma forma extremamente instável, ativada por dor emocional extrema ou ódio absoluto.
                                Saori não consegue chegar naturalmente à esse estágio, esse estágio é ativado apenas por sentimentos fortes. Toda a dor de Saori é convertida em mana pura, e, utilizando sua mana e seu grimório ao mesmo tempo, Saori se torna um ser divino.
                                Saori agora controla completamente a gravidade ao seu redor, podendo rodar qualquer dado com vantagem. A gravidade esmagará toda e qualquer pessoa ao seu redor, não conseguindo direcioná-la, portanto, todo e qualquer ataque desferido por Saori acertará o alvo. Essa forma terá uma duração de MAG/9 (Prestígio conta como 10).

                                Simbolismo: O colapso emocional de Saori.`,
                    dano: '4dMag + Grimório + Mana',
                    efeitos: '[BUFF] [OUTRACING]',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Grimório";
                        const periciaSigla2 = "Mana";
                    
                        const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                        const pericia2 = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla2);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                        const pericia2Valor = (pericia2?.valor || 0) + (pericia2?.bonus || 0);
                    
                        let dano = `4d${atributoValor}+${periciaValor}+${pericia2Valor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    },

                    
                }, 
            ]
        },

        {
            nome: 'Realidade Distorcida (歪んだ現実 – Yuganda Genjitsu)',
            grimorio: 'Grimório',
            nivel: 3,
            descricao: 'Saori molda uma caneta tinteiro gravitacional, a gravidade toma forma de uma folha, onde o mundo vira uma página abstrata. Saori pode fazer o que quiser com página desde que esteja com a caneta, desenhar, afundar rasgar. Quando essa folha é amassada, Saori comprime a gravidade ambiente, quando ela é riscada a caneta, cria um vão que a gravidade também gera acompanhando a linha, de riscar forte demais, é normal que você afunde o papel, e por isso ele criaria um aprofundamento da gravidade, se rasgar, quebra.',
            dano: ' 3dMag + Grimório',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Grimório";
            
                const atributo = data.saori.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.saori.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `3d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
            efeitos: ['[SPEEDBLITZ]']
        },

    ],
}, 

yuka: {
    info: { 
        nome_data: 'yuka',
        nome: 'Yuka Kisha',
        nivel: 11,
        inspiracao: 2,
        xp: 10,
        idade: 18,
        altura: 201,
        peso: 100,
        classe: 'Plebeu',
        arquetipo: 'Caçador',
        discord_id: '848993151128436796'
    },
    
    atributos: [
        {pv: 80, ps: 8},
        {sigla: "FOR", nome: "Força", valor: 3, bonus: 2},
        {sigla: "VIG", nome: "Vigor", valor: 4},
        {sigla: "AGL", nome: "Agilidade", valor: 2, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 2},
        {sigla: "ESP", nome: "Espírito", valor: 1},
        {sigla: "MAG", nome: "Magia", valor: 8, bonus: 2, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 8, bonus: 2},
            {nome: "Grimório", valor: 7, bonus: 2},
            {nome: "Controle", valor: 10},
        ]},
        {atributo: "VIG", pericia_valor: [
            {nome: "Resistência", valor: 1},
        ]},
        {atributo: "FOR", pericia_valor: [
            {nome: "Esgrima", valor: 2, bonus: 2},
            {nome: "Luta", valor: 2}
        ]},
        {atributo: "AGL", pericia_valor: [
            {nome: "Furtividade", valor: 2, bonus: -2},
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Temperatus Imperium',
            grimorio: 'Sem Grimório',
            nivel: 3,
            descricao: 'Ao Yuka falar o nome da habilidade "Temperatus Imperium" ele quebra a sua lança principal ao meio e divide ela em dois, após isso a parte esquerda começa a queimar em chamas laranjas e vermelhas subindo um pouco em seu braço,  e o lado direito começa a congelar e esse efeito pega um pouco em seu braço também. Agora Yuka tem duas lanças com seus respectivos Desastres (Climas absurdamente quentes e gelados).',
            subataques: [
                {
                    nome: 'Gefroren - Gelo', 
                    descricao: 'Essa parte é o lado defensivo de sua habilidade, com ela Yuka pode estancar sangramentos internos e até mesmo criar um escudo/barreira com esse poder. Mas mesmo sendo uma defesa ele ainda pode atacar com ela tendo o benefício de poder congelar um pouco o seu oponente.',
                    efeitos: '[DEBUFF] [BUFF]',
                    dano: '3dMag',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Controle";
                    
                        const atributo = data.yuka.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.yuka.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `3d${atributoValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    }
                },
                {
                    nome: 'Flammen - Fogo', 
                    descricao: 'É o lado ofensivo de sua habilidade, conseguindo executar estocadas rápidas e que queimam só de chegar perto no  oponente. Com a sua lança de fogo ele pode fazer uma estocada/golpe estendido de até 3 metros a partir da sua lança, ganhando  uma área de ataque bem maior do que antes.',
                    efeitos: '[BURNING]',
                    dano: '3dMag',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Esgrima";
                    
                        const atributo = data.yuka.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.yuka.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `3d${atributoValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    }
                }
            ]
        },
        {
            nome: 'Trovão que Persegue as Nuvens',
            grimorio: 'Grimório',
            nivel: 3,
            descricao: 
            `O grimorio de Yuka, que é de uma cor escura, começa a levitar e sobe até ficar na altura de seu ombro. Yuka então abre o seu grimorio com um movimento de seu punho, as páginas começam a virar e então ele toma uma cor branca azulada, coberto por eletricidade e pequenos raios.

            A ponta de uma lança começa a sair do grimorio, mas contrário ao usual vermelho, ela é branca. A nova lança de Yuka mais parece um relâmpago do que uma lança, sua forma tremendo com a força guardada dentro de si mesma. 

            Yuka empunha sua nova lança e fecha o grimorio. O ambiente fica mais carregado, como se os cabelos de todos fossem subir só pela presença da lança. É possível até mesmo ver que os raios saindo do cabo da lança pegam um pouco no braço de Yuka.`,
            subataques: [
                {
                    nome: 'Ataque Único', 
                    descricao: 'Usa seu poder de uma só vez. A primeira forma é simples, Yuka aponta sua lança para o alvo e então uma grande rajada de relâmpagos é lançada em direção ao alvo, é até mesmo possível escutar um "rugido".',
                    efeitos: '[OUTRACING]',
                    dano: '1dMag + Controle',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Controle";
                    
                        const atributo = data.yuka.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.yuka.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `1d${atributoValor}+${periciaValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    }
                },
                {
                    nome: 'Ataque Múltiplo', 
                    descricao: 'Yuka usando de seu controle sobre sua própria magia, algo que é tal como um canhão que pode ser usado de forma rápida. Yuka finca sua lança no chão e diversas lanças iguais a principal são invocadas, e então lançadas em direção ao alvo.',
                    efeitos: '[OUTRACING]',
                    dano: '1dMag',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Controle";
                    
                        const atributo = data.yuka.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.yuka.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `1d${atributoValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    }
                },
            ]
        },

        {
            nome: 'Tremor que estremece a terra',
            grimorio: 'Sem Grimório',
            nivel: 2,
            descricao: 'O usuário consegue fazer o próprio ar tremer frente o poder, ele consegue causar terremotos ou fazer o espaço em volta dele tremer. Se ele imbuir em sua lança esse feitiço ele conseguirá usar de forma mais controlada, se alguem for atingido pela lança com o poder do tremor a vítima ficará atordoada.',
            dano: ['1dMag + Mana'], 
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Mana";
            
                const atributo = data.yuka.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.yuka.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
            efeitos: ['[STUN]']
        },      
        {
            nome: 'Caminho do Vento',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Após ver Shiva usar a sua magia de vento Yuka aprendeu a fazer algo parecido, ele consegue aprimorar a velocidade do seu corpo com o Vento. Mas essa habilidade não é só um simples vento é algo mais agressivo que isso só que Yuka ainda não consegue tirar o máximo potencial dessa parte de sua Magia. Enquanto essa habilidade estiver ativa o jogador poderá girar com um dado de vantagem em qualquer teste que envolva movimentação. Em caso de combate será girado 1d3 para determinar quantos turnos a habilidade ficará ativa. Após usá-la em combate, ela ficará em exaustão por outros 2 turnos.',
            efeitos: ['[BUFF]']
        },   
    ],
},

yang: {
    info: { 
        nome_data: 'yang',
        nome: 'Yang Kami Lapse',
        nivel: 11,
        inspiracao: 0,
        xp: 10,
        idade: 15,
        altura: 173,
        peso: 61,
        classe: 'Realeza',
        arquetipo: 'Feiticeiro',
        discord_id: '423067939495739392'
    },
    
    atributos: [
        {pv: 52, ps: 7},
        {sigla: "FOR", nome: "Força", valor: 0, bonus: -2},
        {sigla: "VIG", nome: "Vigor", valor: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 2},
        {sigla: "INT", nome: "Inteligência", valor: 4, bonus: 2},
        {sigla: "ESP", nome: "Espírito", valor: 1},
        {sigla: "MAG", nome: "Magia", valor: 10, bonus: 5, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 15, bonus: 2},
            {nome: "Grimório", valor: 10, bonus: 2},
            {nome: "Visão", valor: 2},
            {nome: "Resistência", valor: 1},
        ]},
        {atributo: "INT", pericia_valor: [
            {nome: "Percepção", valor: 1},
            {nome: "Persuasão", valor: 2, bonus: -2}
        ]},
        {atributo: "ESP", pericia_valor: [
            {nome: "Persuasão", valor: 2, bonus: -2}
        ]},
        {atributo: "AGL", pericia_valor: [
            {nome: "Furtividade", valor: 1},
            {nome: "Reflexos", valor: 1}
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Intagibilidade',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'O usuário nulifica a presença do seu corpo e da sua mana, tornando-se vazio no espaço.',
            efeitos: ['[BUFF]']
        },
        {
            nome: 'Olhos do Interlúnio',
            grimorio: 'Sem Grimório',
            nivel: 3,
            descricao: 'O olho que contempla o intervalo entre existência e inexistência — o interlúnio, o não-dito, o instante que se perdeu entre o antes e o depois. Os olhos ameaçam a visão real do usuário, e são ativados e desativados manualmente.',
            subataques: [
                {nome: 'Fenda de Maigetsu', 
                 descricao: 'O usuário projeta um vácuo no espaço que se expande e abre um portal para um outro ponto pré-estabelecido e conhecido por ele. O portal é indiferente a magia transporta objetos, pessoas e mana que com ele interagirem. O portal é desfeito e refeito sob a vontade do usuário.', 
                 efeitos: '[ESPECIAL]'}, 
            ]
        },
        {
            nome: 'Inrelicário Vazio',
            grimorio: 'Grimório',
            nivel: 3,
            descricao: 'O usuário invoca relíquias de armas convertidas no vazio por portais específicos. Apenas um inrelicário pode ser invocado por vez.',
            efeitos: ['[BUFF]'],
            subataques: [
                {
                    nome: 'Adagas (Pugiones Liminales)',
                    descricao: 'Adagas que causam dano físico e desintegram a matéria e armaduras mágicas.',
                    dano: '1dMag',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Grimório";
                    
                        const atributo = data.yang.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.yang.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `1d${atributoValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    },
                    efeitos: '[ESPECIAL]'
                }, 

                {nome: 'Correntes (Fasciae Vacuae)', 
                descricao: 'Correntes que impedem movimento físico. Se prendem em múltiplos alvos se canalizadas.',
                efeitos: '[IMMOBILIZED]'},

                {nome: 'Vinhas (Lora Inania)',
                descricao: 'Vinhas que absorvem mana passivamente do alvo, e dificultam a liberação dela em testes mágicos.',
                efeitos: '[DEBUFF]'},

                {nome: 'Cruz (Negacrux Finalis)',
                descricao: 'Uma cruz que se posiciona como uma barreira unidirecional, tornando como "não reconhecível" qualquer ataque mágico que tente intervir nela.',
                efeitos: '[BARRIER]'},

                {
                    nome: 'Lança (Hasta Nihilum)',
                    descricao: 'Uma lança que causa dano físico e se move em altíssima velocidade. O usuário seleciona o alvo desejado, e a lança será guiada constantemente para ele como um imã até acertar.',
                    dano: '1dMag',
                    get danoJS() {
                        const atributoSigla = "MAG";
                        const periciaSigla = "Grimório";
                    
                        const atributo = data.yang.atributos.find(attr => attr.sigla === atributoSigla);
                        const periciaBlock = data.yang.pericias.find(per => per.atributo === atributoSigla);
                        const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
                    
                        const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                        const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
                    
                        let dano = `1d${atributoValor}`;
                    
                        if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                            const dadosExtras = atributo.prestigio;
                            dano += `+${dadosExtras}d5`;
                        }
                    
                        return dano;
                    },
                    efeitos: '[ESPECIAL]'
                }, 
            ]
        },
        {
            nome: 'Eternova',
            grimorio: 'Zona de Mana',
            nivel: 'Zona de Mana',
            descricao: `A dimensão do vazio, provedora de todo o poder e interações do grimório de Yang Kami Lapse. Dentro dela, o espaço é irrelevante e mutável, podendo ser alterado passivamente como o usuário bem entender. A única coisa de sua aparência que não pode ser alterada é a Estrela de Eternova, também sendo essa a entidade que comanda a dimensão do vazio.
            A estrela, por sua vez, tem vontade própria e princípios rígidos que devem ser respeitados mesmo pelo próprio usuário. Caso qualquer um em Eternova desrespeite o regulamento imposto pela estrela, será executada a Penitência de Eternova, que aprisionará com correntes o condenado e selará o mesmo na dimensão pela eternidade.
            Princípio da Hospitalidade
            O usuário que invocou a dimensão tem a obrigação de explicar a todos ali dentro as regras da zona. A principal regra de Eternova é mutável, e será sempre definida pelo usuário assim que a zona de mana for invocada. Qualquer um que desrespeite a regra do usuário estará sujeito a penitência. O usuário também será sujeito a regra.
            Princípio da Aplicabilidade
            Todas as regras ditas pelo usuário dentro de Eternova devem ser aplicáveis para todos que estejam dentro da zona, inclusive o próprio usuário. A regra dita pelo usuário na invocação da zona de mana não pode ser alterada durante a zona, tampouco anulada. Não é possível ditar mais de uma regra, mas é possível adicionar quantas cláusulas forem necessárias.
            Beneficiamento sob Dívida
            O usuário, que invocou Eternova ao mundo físico, desfrutará de uma quantidade ilimitada de mana e possibilidade de ações em Eternova, desde que respeite suas leis; Todos em Eternova, com exceção do usuário, irão ter a mana reduzida ao mínimo possível dentro da zona. Adicionalmente, a Estrela é responsável por ter o usuário ciente de todas as leis e regulamentos da dimensão. Contudo, sempre que a zona de mana for utilizada e acabar, uma parte do usuário ficará em Eternova. Eternova quer que o usuário faça parte da dimensão, e vai conseguir.`,
            efeitos: ['[ZONA DE MANA]']
        },
    ],
},

lommie: {
    info: { 
        nome_data: 'lommie',
        nome: 'Lommie Yuta',
        nivel: 9,
        xp: 0,
        idade: 19,
        altura: 176,
        peso: 61,
        classe: '-',
        arquetipo: 'Lutador',
        discord_id: '1317246514535465010'
    },
    
    atributos: [
        {pv: 55, ps: 9},
        {sigla: "FOR", nome: "Força", valor: 3, bonus: 4, prestigio: 2},
        {sigla: "VIG", nome: "Vigor", valor: 1, bonus: 2},
        {sigla: "AGL", nome: "Agilidade", valor: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 0},
        {sigla: "MAG", nome: "Magia", valor: 5},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 5}
        ]},
        {atributo: "INT", pericia_valor: [
            {nome: "Percepção", valor: 1},
        ]},
        {atributo: "FOR", pericia_valor: [
            {nome: "Luta", valor: 8},
            {nome: "Atletismo", valor: 5},
        ]},
        {atributo: "VIG", pericia_valor: [
            {nome: "Resistência", valor: 1},
            {nome: "Intimidação", valor: 3},
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Soco retardado',
            grimorio: 'Sem Grimório',
            nivel: 3,
            descricao: 'Os golpes não causam dano imediatamente. Em vez disso, o impacto é "acumulado" e liberado depois — tudo de uma vez.',
            efeitos: ['[BLOCK-BREAK]'],
            dano: '2dFor + Luta',
            get danoJS() {
                const atributoSigla = "FOR";
                const periciaSigla = "Luta";
            
                const atributo = data.lommie.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.lommie.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `2d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
        },
        {
            nome: 'Acelerador',
            grimorio: 'Sem Grimório',
            nivel: 3,
            descricao: 'Acelera tudo dentro de si, fazendo seus sentidos e habilidades fisicas ficarem mais precisas e rápidas, enquanto estiver nesse modo, ganha vantagem em todos os dados que usam sua velocidade.',
            efeitos: ['[BUFF]']
        },
    ],
}, 

alice: {
    info: { 
        nome_data: 'alice',
        nome: 'Shiva Wyndell',
        nivel: 10,
        inspiracao: 1,
        xp: 75,
        idade: 14,
        altura: 167,
        peso: 55,
        classe: '-',
        arquetipo: 'Lutador',
        discord_id: '1213237748505251861'
    },
    
    atributos: [
        {pv: 88, ps: 7},
        {sigla: "FOR", nome: "Força", valor: 0, bonus: 4, prestigio: 2},
        {sigla: "VIG", nome: "Vigor", valor: 5, bonus: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 6, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 0},
        {sigla: "ESP", nome: "Espírito", valor: 2},
        {sigla: "MAG", nome: "Magia", valor: 8},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 6},
            {nome: "Grimório", valor: 1}
        ]},
        {atributo: "FOR", pericia_valor: [
            {nome: "Luta", valor: 9},
        ]},
        {atributo: "VIG", pericia_valor: [
            {nome: "Resistência", valor: 3},
        ]},
            {atributo: "AGL", pericia_valor: [
            {nome: "Reflexos", valor: 2, bonus: 2},
            {nome: "Atletismo", valor: 0, bonus: 2},
        ]},
            {atributo: "INT", pericia_valor: [
            {nome: "Intuição", valor: 0, bonus: -2},
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Alento',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Um sopro sobre a ferida do aliado; o vento pressurizado fecha cortes superficiais e reorganiza músculos e pele o suficiente para estancar o sangramento e acelerar a dor. É mais primeiro-socorro do que milagre.',
            efeitos: ['HEAL'],
            dano: '1dMag + Mana',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Mana";
            
                const atributo = data.alice.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.alice.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
        },
        {
            nome: 'Impacto',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Reúne todo o “elemento” presente ao redor de seu punho ou perna e desfere um golpe único capaz de destruir defesas, romper mana ou causar dano.',
            efeitos: ['BLOCKBREAK'],
            dano: '1dMag + Luta',
            get danoJS() {
                const atributoSigla = "MAG";
                const periciaSigla = "Luta";
            
                const atributo = data.alice.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.alice.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
        },
        {
            nome: 'Murmúrio Cortante',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Um movimento rápido com o leque que lança uma lâmina de vento quase invisível. Parece apenas um sopro, mas corta como aço.',
            efeitos: ['BLEEDING'],
            dano: '1dFor',
            get danoJS() {
                const atributoSigla = "FOR";
                const periciaSigla = "Mana";
            
                const atributo = data.alice.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.alice.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
        },
        {
            nome: 'Dança dos Mil Ventos',
            grimorio: 'Sem Grimório',
            nivel: 2,
            descricao: 'Uma rajada em espiral que avança como um furacão em miniatura, cortando e desequilibrando quem for atingido.',
            dano: '1dFor + Mana',
            efeitos: ['STUN'],
            get danoJS() {
                const atributoSigla = "FOR";
                const periciaSigla = "Mana";
            
                const atributo = data.alice.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.alice.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            },
        },
    ],
}, 

saint: {
    info: { 
        nome_data: 'saint',
        nome: 'Saint Valac',
        nivel: 10,
        inspiracao: 0,
        xp: 75,
        idade: 16,
        altura: 180,
        peso:70,
        classe: '-',
        arquetipo: 'Caçador',
        discord_id: '1317263900512751746'
    },
    
    atributos: [
        {pv: 76, ps: 5},
        {sigla: "FOR", nome: "Força", valor: 7, bonus: 2},
        {sigla: "VIG", nome: "Vigor", valor: 6, bonus: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 1, bonus: 2, prestigio: 3},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 2, bonus: -2},
        {sigla: "MAG", nome: "Magia", valor: 7, bonus: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Controle", valor: 1},
            {nome: "Grimório", valor: 1}
        ]},
            {atributo: "AGL", pericia_valor: [
            {nome: "Reflexos", valor: 0, bonus: 2},
            {nome: "Atletismo", valor: 0, bonus: 2},
            {nome: "Furtividade", valor: 0, bonus: -2},
            {nome: "Esgrima", valor: 5, bonus: 0},
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Ataque Múltiplo Ilusionista',
            grimorio: 'Sem Grimório',
            nivel: 2,
            descricao: 'Ao atacar um inimigo cria ilusões de vários de si mesmo, para ludibriar o inimigo.',
            efeitos: ['[DEBUFF]'],
            dano: '1dAgl + Esgrima',
            get danoJS() {
                const atributoSigla = "AGL";
                const periciaSigla = "Esgrima";
            
                const atributo = data.saint.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.saint.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            }
        },
        {
            nome: 'Passo fantasma',
            grimorio: 'Sem Grimório',
            nivel: 2,
            descricao: 'Cria ilusões de si mesmo em diversos locais para enganar os inimigos quando for atacado.',
            efeitos: ['DEBUFF'],
            dano: ''
        },
        {
            nome: 'Distorção de Combate',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: `Valac desfere um golpe que distorce, por um instante, os próprios conceitos do mundo.
                    A lógica do combate se inverte: errar não significa falhar, e defender não significa estar seguro.

                    Se o ataque de Valac for errado ou defendido, a ilusão se fecha sobre o oponente e o efeito ocorre de forma contrária ao esperado, pegando-o completamente desprevenido.

                    No Combate Ilusório, o erro é apenas outra forma de acertar.`,
            efeitos: ['ESPECIAL'],
            dano: '1dAgl + Esgrima',
                get danoJS() {
                const atributoSigla = "AGL";
                const periciaSigla = "Esgrima";
            
                const atributo = data.saint.atributos.find(attr => attr.sigla === atributoSigla);
                const periciaBlock = data.saint.pericias.find(per => per.atributo === atributoSigla);
                const pericia = periciaBlock?.pericia_valor.find(val => val.nome === periciaSigla);
            
                const atributoValor = (atributo?.valor || 0) + (atributo?.bonus || 0);
                const periciaValor = (pericia?.valor || 0) + (pericia?.bonus || 0);
            
                let dano = `1d${atributoValor}+${periciaValor}`;
            
                if (atributo && typeof atributo.prestigio === "number" && atributo.prestigio > 0) {
                    const dadosExtras = atributo.prestigio;
                    dano += `+${dadosExtras}d5`;
                }
            
                return dano;
            }
        },
    ],
}, 
}

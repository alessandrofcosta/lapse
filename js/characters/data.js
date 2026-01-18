const data = { 
    
indra: {
    info: { 
        nome_data: 'indra',
        nome: 'Indra Ashura',
        inspiracao: 1,
        nivel: 9,
        xp: 25,
        idade: 15,
        altura: 171,
        peso: 65,
        classe: 'Nobreza',
        arquetipo: 'Caçador',
        discord_id: '1317246514535465010'
    },
    
    atributos: [
        {pv: 53, ps: 6},
        {sigla: "FOR", nome: "Força", valor: 6},
        {sigla: "VIG", nome: "Vigor", valor: 3},
        {sigla: "AGL", nome: "Agilidade", valor: 4, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 3},
        {sigla: "MAG", nome: "Magia", valor: 4, bonus: 4, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 1, bonus: 2},
            {nome: "Visão", valor: 2},
            {nome: "Grimório", valor: 7, bonus: 2},
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
                const nivel = data.indra.habilidades[0].nivel
                const mag = data.indra.atributos[6].valor + data.indra.atributos[6].bonus || 0;
                const mana = data.indra.pericias[0].pericia_valor[0].valor + data.indra.pericias[0].pericia_valor[0].bonus || 0;
                return `1d${mag}+${mana}`;
            },
            efeitos: ['[BLOCK-BREAK]']
        },
        {
            nome: 'Ressurreição dos Derrotados',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Após derrotar um mago, Indra pode se comunicar com o resto de mana em seu corpo e caso o derrotado seja convencido, pode trazê-lo de volta a vida como seu servo leal. Todas as habilidades estarão disponíveis para o uso do monarca. Todo servo tem a capacidade diminuída pela metade. Servos não tem a capacidade de se comunicar, eles apenas obedecem ao monarca.',
            efeitos: ['[ESPECIAL]'],
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
        nivel: 9,
        inspiracao: 1,
        xp: 25,
        idade: 15,
        altura: 151,
        peso: 45,
        classe: 'Realeza',
        arquetipo: 'Feiticeiro',
        discord_id: '522775874999943171'
    },
    
    atributos: [
        {pv: 42, ps: 6},
        {sigla: "FOR", nome: "Força", valor: 1},
        {sigla: "VIG", nome: "Vigor", valor: 2},
        {sigla: "AGL", nome: "Agilidade", valor: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1, bonus: 2},
        {sigla: "ESP", nome: "Espírito", valor: 3},
        {sigla: "MAG", nome: "Magia", valor: 1, bonus: 5, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 2, bonus: 2},
            {nome: "Visão", valor: 1},
            {nome: "Grimório", valor: 13, bonus: 2},
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
                const nivel = data.saori.habilidades[0].nivel
                const hab1 = data.saori.atributos[6].valor + data.saori.atributos[6].bonus || 0;
                const hab2 = data.saori.pericias[0].pericia_valor[2].valor + data.saori.pericias[0].pericia_valor[2].bonus || 0;
                return `${nivel}d${hab1}+${hab2}`;
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
                const nivel = data.saori.habilidades[0].nivel
                const hab1 = data.saori.atributos[6].valor + data.saori.atributos[6].bonus || 0;
                const hab2 = data.saori.pericias[0].pericia_valor[2].valor + data.saori.pericias[0].pericia_valor[2].bonus || 0;
                return `${nivel}d${hab1}`;
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
                const nivel = data.saori.habilidades[0].nivel
                const hab1 = data.saori.atributos[6].valor + data.saori.atributos[6].bonus || 0;
                const hab2 = data.saori.pericias[0].pericia_valor[2].valor + data.saori.pericias[0].pericia_valor[2].bonus || 0;
                return `1d${hab1}+${hab2}`;
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
                const nivel = data.saori.habilidades[0].nivel
                const hab1 = data.saori.atributos[6].valor + data.saori.atributos[6].bonus || 0;
                const hab2 = data.saori.pericias[0].pericia_valor[2].valor + data.saori.pericias[0].pericia_valor[2].bonus || 0;
                return `1d${hab1}+${hab2}`;
            },
            efeitos: ['[SPEEDBLITZ]']
        },

    ],
}, 

yuka: {
    info: { 
        nome_data: 'yuka',
        nome: 'Yuka Kisha',
        nivel: 9,
        inspiracao: 1,
        xp: 35,
        idade: 18,
        altura: 201,
        peso: 100,
        classe: 'Plebeu',
        arquetipo: 'Caçador',
        discord_id: '848993151128436796'
    },
    
    atributos: [
        {pv: 54, ps: 8},
        {sigla: "FOR", nome: "Força", valor: 3, bonus: 2},
        {sigla: "VIG", nome: "Vigor", valor: 4},
        {sigla: "AGL", nome: "Agilidade", valor: 2, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 2},
        {sigla: "ESP", nome: "Espírito", valor: 1},
        {sigla: "MAG", nome: "Magia", valor: 0, bonus: 2, prestigio: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 5, bonus: 2},
            {nome: "Grimório", valor: 2, bonus: 2},
            {nome: "Controle", valor: 4},
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
            nivel: 2,
            descricao: 'Ao Yuka falar o nome da habilidade "Temperatus Imperium" ele quebra a sua lança principal ao meio e divide ela em dois, após isso a parte esquerda começa a queimar em chamas laranjas e vermelhas subindo um pouco em seu braço,  e o lado direito começa a congelar e esse efeito pega um pouco em seu braço também. Agora Yuka tem duas lanças com seus respectivos Desastres (Climas absurdamente quentes e gelados).',
            subataques: [
                {
                    nome: 'Gefroren - Gelo', 
                    descricao: 'Essa parte é o lado defensivo de sua habilidade, com ela Yuka pode estancar sangramentos internos e até mesmo criar um escudo/barreira com esse poder. Mas mesmo sendo uma defesa ele ainda pode atacar com ela tendo o benefício de poder congelar um pouco o seu oponente.',
                    efeitos: '[DEBUFF] [BUFF]',
                    dano: '1dMag',
                    get danoJS() {
                        const nivel = data.yuka.habilidades[0].nivel;
                        const atributo = data.yuka.atributos[6].valor || 0;
                        const atributoBonus = data.yuka.atributos[6].bonus || 0;
                        const pericia = data.yuka.pericias[0].pericia_valor[2].valor || 0;
                        const periciaBonus = data.yuka.pericias[0].pericia_valor[2].bonus || 0;
                        
                        const hab1 = atributo + atributoBonus;
                        const hab2 = pericia + periciaBonus;
                        return `1d${hab1}`;
                    },
                },
                {
                    nome: 'Flammen - Fogo', 
                    descricao: 'É o lado ofensivo de sua habilidade, conseguindo executar estocadas rápidas e que queimam só de chegar perto no  oponente. Com a sua lança de fogo ele pode fazer uma estocada/golpe estendido de até 3 metros a partir da sua lança, ganhando  uma área de ataque bem maior do que antes.',
                    efeitos: '[BURNING]',
                    dano: '1dMag',
                    get danoJS() {
                        const nivel = data.yuka.habilidades[0].nivel;
                        const atributo = data.yuka.atributos[6].valor || 0;
                        const atributoBonus = data.yuka.atributos[6].bonus || 0;
                        const pericia = data.yuka.pericias[0].pericia_valor[2].valor || 0;
                        const periciaBonus = data.yuka.pericias[0].pericia_valor[2].bonus || 0;
                        
                        const hab1 = atributo + atributoBonus;
                        const hab2 = pericia + periciaBonus;
                        return `1d${hab1}`;
                    },
                }
            ]
        },
        {
            nome: 'Raijin no Kaminari',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Imbui a sua lança com a força de uma grande tempestade. Ao fazer uma estocada ou balançar a sua lança Yuka consegue desferir ataques elétricos de longo/médio alcance.',
            dano: '1dMag + Controle',
            get danoJS() {
                const nivel = data.yuka.habilidades[0].nivel;
                const atributo = data.yuka.atributos[6].valor || 0;
                const atributoBonus = data.yuka.atributos[6].bonus || 0;
                const pericia = data.yuka.pericias[0].pericia_valor[2].valor || 0;
                const periciaBonus = data.yuka.pericias[0].pericia_valor[2].bonus || 0;
                
                const hab1 = atributo + atributoBonus;
                const hab2 = pericia + periciaBonus;
                return `1d${hab1}+${hab2}`;
            },
            efeitos: ['[SPEEDBLITZ]']
        },
        {
            nome: 'Gekishin',
            grimorio: 'Sem Grimório',
            nivel: 2,
            descricao: 'O usuário consegue fazer o próprio ar tremer frente o poder, ele consegue causar terremotos ou fazer o espaço em volta dele tremer. Se ele imbuir em sua lança esse feitiço ele conseguirá usar de forma mais controlada, se alguem for atingido pela lança com o poder do tremor a vítima ficará atordoada.',
            dano: ['1dMag + Mana'], 
            get danoJS() {
                const nivel = data.yuka.habilidades[0].nivel;
                const atributo = data.yuka.atributos[6].valor || 0;
                const atributoBonus = data.yuka.atributos[6].bonus || 0;
                const pericia = data.yuka.pericias[0].pericia_valor[0].valor || 0;
                const periciaBonus = data.yuka.pericias[0].pericia_valor[0].bonus || 0;
                
                const hab1 = atributo + atributoBonus;
                const hab2 = pericia + periciaBonus;
                return `${nivel}d${hab1}+${hab2}`;
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
        nivel: 9,
        inspiracao: 1,
        xp: 35,
        idade: 15,
        altura: 173,
        peso: 61,
        classe: 'Realeza',
        arquetipo: 'Feiticeiro',
        discord_id: '423067939495739392'
    },
    
    atributos: [
        {pv: 40, ps: 7},
        {sigla: "FOR", nome: "Força", valor: 0, bonus: -2},
        {sigla: "VIG", nome: "Vigor", valor: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 2},
        {sigla: "INT", nome: "Inteligência", valor: 2, bonus: 2},
        {sigla: "ESP", nome: "Espírito", valor: 1},
        {sigla: "MAG", nome: "Magia", valor: 10, bonus: 5},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 15, bonus: 2},
            {nome: "Grimório", valor: 8, bonus: 2},
            {nome: "Visão", valor: 2},
        ]},
        {atributo: "INT", pericia_valor: [
            {nome: "Percepção", valor: 1},
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
            nivel: 2,
            descricao: 'O olho que contempla o intervalo entre existência e inexistência — o interlúnio, o não-dito, o instante que se perdeu entre o antes e o depois. Os olhos ameaçam a visão real do usuário, e são ativados e desativados manualmente.',
            subataques: [
                {nome: 'Fenda de Maigetsu', descricao: 'O usuário projeta um vácuo no espaço que se expande e abre um portal para um outro ponto pré-estabelecido e conhecido por ele. O portal é indiferente a magia transporta objetos, pessoas e mana que com ele interagirem. O portal é desfeito e refeito sob a vontade do usuário. O portal pode ser feito a partir de locais vistos em até uma semana pelo usuário, sobre uma grande quantidade de mana o portal sobrecarrega e implode.', dano: '[ESPECIAL]'}, 
            ]
        },
        {
            nome: 'Inrelicário Vazio',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'O usuário invoca relíquias de armas convertidas no vazio por portais específicos. Apenas um inrelicário pode ser invocado por vez.',
            efeitos: ['[BUFF]'],
            subataques: [
                {
                    nome: 'Adagas (Pugiones Liminales)',
                    descricao: 'Adagas que causam dano físico e desintegram a matéria e armaduras mágicas.',
                    dano: '1dMag',
                    get danoJS() 
                    {
                        const nivel = data.yang.habilidades[0].nivel;
                        const atributo = data.yang.atributos[6].valor || 0;
                        const atributoBonus = data.yang.atributos[6].bonus || 0;
                        const pericia = data.yang.pericias[0].pericia_valor[2].valor || 0;
                        const periciaBonus = data.yang.pericias[0].pericia_valor[2].bonus || 0;
                        
                        const hab1 = atributo + atributoBonus;
                        const hab2 = pericia + periciaBonus;
                        return `1d${hab1}`;
                    },
                    efeitos: '[ESPECIAL]'
                }, 
                {nome: 'Correntes (Fasciae Vacuae)', descricao: 'Correntes que impedem movimento físico. Se prendem em múltiplos alvos se canalizadas.',efeitos: '[IMMOBILIZED]'}, 
                {nome: 'Vinhas (Lora Inania)', descricao: 'Vinhas que absorvem mana passivamente do alvo, e dificultam a liberação dela em testes mágicos.',efeitos: '[DEBUFF]'},
                {nome: 'Cruz (Negacrux Finalis)', descricao: 'Uma cruz que se posiciona como uma barreira unidirecional, tornando como "não reconhecível" qualquer ataque mágico que tente intervir nela.',efeitos: '[BARRIER]'}
            ]
        },
    ],
},

lommie: {
    info: { 
        nome_data: 'lommie',
        nome: 'Lommie Yuta',
        nivel: 7,
        xp: 0,
        idade: 19,
        altura: 176,
        peso: 61,
        classe: '-',
        arquetipo: 'Lutador',
        discord_id: '1317246514535465010'
    },
    
    atributos: [
        {pv: 50, ps: 9},
        {sigla: "FOR", nome: "Força", valor: 6, bonus: 4},
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
            {nome: "Luta", valor: 5},
            {nome: "Atletismo", valor: 3},
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
            nivel: 2,
            descricao: 'Os golpes não causam dano imediatamente. Em vez disso, o impacto é "acumulado" e liberado depois — tudo de uma vez.',
            efeitos: ['[BLOCK-BREAK]'],
            dano: '1dFor + Luta',
            get danoJS() {
                const nivel = data.lommie.habilidades[0].nivel;
                const atributo = data.lommie.atributos[1].valor || 0;
                const atributoBonus = data.lommie.atributos[1].bonus || 0;
                const pericia = data.lommie.pericias[2].pericia_valor[0].valor || 0;
                const periciaBonus = data.lommie.pericias[2].pericia_valor[0].bonus || 0;
                
                const hab1 = atributo + atributoBonus;
                const hab2 = pericia + periciaBonus;
                return `1d${hab1}+${hab2}`;
            }
        },
        {
            nome: 'Acelerador',
            grimorio: 'Sem Grimório',
            nivel: 2,
            descricao: 'Acelera tudo dentro de si, fazendo seus sentidos e habilidades fisicas ficarem mais precisas e rápidas, enquanto estiver nesse modo, ganha um buff de +2 em todos os dados.',
            efeitos: ['[BUFF]']
        },
    ],
}, 

alice: {
    info: { 
        nome_data: 'alice',
        nome: 'Shiva Wyndell',
        nivel: 9,
        inspiracao: 1,
        xp: 25,
        idade: 14,
        altura: 167,
        peso: 55,
        classe: '-',
        arquetipo: 'Lutador',
        discord_id: '1213237748505251861'
    },
    
    atributos: [
        {pv: 53, ps: 7},
        {sigla: "FOR", nome: "Força", valor: 0, bonus: 4, prestigio: 2},
        {sigla: "VIG", nome: "Vigor", valor: 5, bonus: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 6, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 0},
        {sigla: "ESP", nome: "Espírito", valor: 2},
        {sigla: "MAG", nome: "Magia", valor: 3},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 3},
            {nome: "Grimório", valor: 1}
        ]},
        {atributo: "FOR", pericia_valor: [
            {nome: "Luta", valor: 5},
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
                const nivel = data.alice.habilidades[1].nivel
                const hab1 = (data.alice.atributos[6].valor || 0) + (data.alice.atributos[6].bonus || 0);
                const hab2 = (data.alice.pericias[0].pericia_valor[0].valor) || 0 + (data.alice.pericias[0].pericia_valor[0].bonus || 0);
                return `1d${hab1}+${hab2}`;
            }
        },
        {
            nome: 'Impacto',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Reúne todo o “elemento” presente ao redor de seu punho ou perna e desfere um golpe único capaz de destruir defesas, romper mana ou causar dano.',
            efeitos: ['BLOCKBREAK'],
            dano: '1dMag + Luta',
            get danoJS() {
                const nivel = data.alice.habilidades[1].nivel
                const hab1 = (data.alice.atributos[6].valor || 0) + (data.alice.atributos[6].bonus || 0);
                const hab2 = (data.alice.pericias[1].pericia_valor[0].valor) || 0 + (data.alice.pericias[1].pericia_valor[0].bonus || 0);
                return `1d${hab1}+${hab2}`;
            }
        },
        {
            nome: 'Murmúrio Cortante',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Um movimento rápido com o leque que lança uma lâmina de vento quase invisível. Parece apenas um sopro, mas corta como aço.',
            efeitos: ['BLEEDING'],
            dano: '1dAgl',
            get danoJS() {
                const nivel = data.alice.habilidades[1].nivel
                const hab1 = (data.alice.atributos[3].valor || 0) + (data.alice.atributos[3].bonus || 0);
                const hab2 = (data.alice.pericias[1].pericia_valor[0].valor || 0) + (data.alice.pericias[1].pericia_valor[0].bonus || 0);
                return `1d${hab1}`;
            }
        },
        {
            nome: 'Dança dos Mil Ventos',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Uma rajada em espiral que avança como um furacão em miniatura, cortando e desequilibrando quem for atingido.',
            dano: '1dFor + Mana',
            efeitos: '',
            get danoJS() {
                const nivel = data.alice.habilidades[1].nivel
                const hab1 = (data.alice.atributos[1].valor || 0) + (data.alice.atributos[1].bonus || 0);
                const hab2 = (data.alice.pericias[0].pericia_valor[0].valor || 0) + (data.alice.pericias[0].pericia_valor[0].bonus || 0);
                return `1d${hab1}+${hab2}`;
            }
        },
    ],
}, 

saint: {
    info: { 
        nome_data: 'saint',
        nome: 'Saint Valac',
        nivel: 9,
        inspiracao: 1,
        xp: 0,
        idade: 16,
        altura: 180,
        peso:70,
        classe: '-',
        arquetipo: 'Caçador',
        discord_id: '1317263900512751746'
    },
    
    atributos: [
        {pv: 56, ps: 5},
        {sigla: "FOR", nome: "Força", valor: 7, bonus: 2},
        {sigla: "VIG", nome: "Vigor", valor: 6, bonus: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 5, bonus: 2, prestigio: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 2, bonus: -2},
        {sigla: "MAG", nome: "Magia", valor: 4, bonus: 2},
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
                const forca = data.saint.atributos.find(attr => attr.sigla === "AGL");
                const lutaPericiaBlock = data.saint.pericias.find(per => per.atributo === "AGL");
                const luta = lutaPericiaBlock.pericia_valor.find(val => val.nome === "Esgrima");

                const hab1 = (forca.valor || 0) + (forca.bonus || 0);
                const hab2 = (luta.valor || 0) + (luta.bonus || 0);

                return `1d${hab1}+${hab2}`;
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
    ],
}, 
}

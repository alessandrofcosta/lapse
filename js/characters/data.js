const data = { 
    
indra: {
    info: { 
        nome_data: 'indra',
        nome: 'Indra Ashura',
        nivel: 6,
        idade: 15,
        altura: 171,
        peso: 65,
        classe: 'Nobreza',
        arquetipo: 'Caçador',
    },
    
    atributos: [
        {pv: 40, ps: 6},
        {sigla: "FOR", nome: "Força", valor: 6},
        {sigla: "VIG", nome: "Vigor", valor: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 4, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 1},
        {sigla: "MAG", nome: "Magia", valor: 6, bonus: 4},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 1, bonus: 2},
            {nome: "Visão", valor: 2},
            {nome: "Grimório", valor: 3, bonus: 2},
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
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Punho do Vazio',
            grimorio: 'Sem grimório',
            nivel: 2,
            descricao: 'Reveste seus punhos com energia sombria do abismo, os socos ignoram barreiras mágicas e armaduras, acertando diretamente o corpo do alvo, cada golpe bem-sucedido rouba uma pequena quantidade de mana do adversário, fortalecendo. Se um golpe conectar, ele pode roubar um pouco da mana do inimigo, recuperando sua própria mana.',
            dano: ' 2dMag + Mana',
            efeitos: ['[BLOCK-BREAK]']
        },
        {
            nome: 'Ressurreição dos Derrotados',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Após derrotar um mago, Indra pode se comunicar com o resto de mana em seu corpo e caso o derrotado seja convencido, pode trazê-lo de volta a vida como seu servo leal. Todas as habilidades estarão disponíveis para o uso do monarca. Todo servo tem a capacidade diminuída pela metade. Servos não tem a capacidade de se comunicar, eles apenas obedecem ao monarca.',
            efeitos: ['[DEBUFF]']
        },
        {
            nome: 'Correntes Espirituais Demoníacas ',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Invoca correntes espectrais que se conectam ao alvo e drenam sua mana lentamente, tornando-o mais fraco a cada segundo.',
            efeitos: ['DEBUFF'] 
        },
        {
            nome: 'Absorção Total',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Qualquer feitiço lançado contra ele é anulado e relançado com metade de sua força.',
            efeitos: ['[ESPECIAL]']
        },
    ],
}, 

shiva: {
    info: { 
        nome_data: 'shiva',
        nome: 'Shiva Wyndell',
        nivel: 6,
        idade: 14,
        altura: 163,
        peso: 47,
        classe: 'Plebeu',
        arquetipo: 'Lutador',
    },
    
    atributos: [
        {pv: 42, ps: 8},
        {sigla: "FOR", nome: "Força", valor: 8, bonus: 3},
        {sigla: "VIG", nome: "Vigor", valor: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 0, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1},
        {sigla: "ESP", nome: "Espírito", valor: 0},
        {sigla: "MAG", nome: "Magia", valor: 8},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 2, bonus: 2},
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
    ],
}, 

saori: {
    info: { 
        nome_data: 'saori',
        nome: 'Saori Silva',
        nivel: 6,
        idade: 15,
        altura: 151,
        peso: 45,
        classe: 'Realeza',
        arquetipo: 'Feiticeiro',
    },
    
    atributos: [
        {pv: 39, ps: 6},
        {sigla: "FOR", nome: "Força", valor: 1},
        {sigla: "VIG", nome: "Vigor", valor: 1},
        {sigla: "AGL", nome: "Agilidade", valor: 2},
        {sigla: "INT", nome: "Inteligência", valor: 2, bonus: 2},
        {sigla: "ESP", nome: "Espírito", valor: 1},
        {sigla: "MAG", nome: "Magia", valor: 10, bonus: 5},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 2, bonus: 2},
            {nome: "Visão", valor: 1},
            {nome: "Grimório", valor: 1, bonus: 2},
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
            descricao: 'Acumula gravidade em um único ponto, formando uma singularidade. Essa singularidade absorve tudo ao ser redor e pode ser lançada aos inimigos causando dano em área.',
            efeitos: ['[BARRIER]']
        },
        {
            nome: 'Impacto Celestial (天衝 – Tenshō)',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Saori aponta para um alvo e aumenta abruptamente a gravidade em um ponto específico, fazendo com que o oponente seja esmagado contra o chão com uma força avassaladora. Quanto maior a diferença de poder, mais devastador o impacto.',
            dano: ' 1dMag + Grimório',
            efeitos: []
        },
        {
            nome: 'Estrela da Devastação (荒廃の星 - Kōhai no hoshi)',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'Acumula gravidade em um único ponto, formando uma singularidade. Essa singularidade absorve tudo ao ser redor e pode ser lançada aos inimigos causando dano em área.',
            dano: ' 1dMag + Grimório',
            efeitos: ['[AREA]']
        },
        

    ],
}, 



yuka: {
    info: { 
        nome_data: 'yuka',
        nome: 'Yuka Kisha',
        nivel: 6,
        idade: 18,
        altura: 201,
        peso: 100,
        classe: 'Plebeu',
        arquetipo: 'Caçador',
    },
    
    atributos: [
        {pv: 45, ps: 8},
        {sigla: "FOR", nome: "Força", valor: 3, bonus: 2},
        {sigla: "VIG", nome: "Vigor", valor: 4},
        {sigla: "AGL", nome: "Agilidade", valor: 2, bonus: 2},
        {sigla: "INT", nome: "Inteligência", valor: 2},
        {sigla: "ESP", nome: "Espírito", valor: 1},
        {sigla: "MAG", nome: "Magia", valor: 4, bonus: 2},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 3, bonus: 2},
            {nome: "Grimório", valor: 2, bonus: 2},
            {nome: "Controle", valor: 1},
        ]},
        {atributo: "VIG", pericia_valor: [
            {nome: "Resistência", valor: 1},
        ]},
        {atributo: "FOR", pericia_valor: [
            {nome: "Persuasão", valor: 2},
            {nome: "Persuasão", valor: 2},
        ]},
        {atributo: "AGL", pericia_valor: [
            {nome: "Furtividade", valor: 2, bonus: -2},
        ]},
    ],
    
    habilidades: [
        {
            nome: 'Percepção aumentada',
            grimorio: 'Sem Grimório',
            nivel: 2,
            descricao: 'Tempo de reação drasticamente aumentado por causa da sua visão e percepção no ambiente. Agora ele enxerga a mana no campo de batalha.',
            efeitos: ['[BUFF]']
        },
        {
            nome: 'Além da capa',
            grimorio: 'Sem Grimório',
            nivel: 1,
            descricao: 'Ele consegue ver o fluxo de mana do mago e com isso ele pode antecipar o movimento dele ou danificar o fluxo de mana dele. Deixa o magia do inimigo desativada/ineficiente por um tempo.',
            efeitos: ['[BUFF]']
        },
        {
            nome: 'Mundo transparente',
            grimorio: 'Grimório',
            nivel: 2,
            descricao: 'Se o inimigo usar o mesmo ataque uma segunda vez Yuka é capaz de desviar ou bloquear.',
            efeitos: ['[BUFF]']
        },      

    ],
}, 

yang: {
    info: { 
        nome_data: 'yang',
        nome: 'Yang Kami Lapse',
        nivel: 6,
        idade: 15,
        altura: 173,
        peso: 61,
        classe: 'Realeza',
        arquetipo: 'Feiticeiro',
    },
    
    atributos: [
        {pv: 38, ps: 7},
        {sigla: "FOR", nome: "Força", valor: 0, bonus: -2},
        {sigla: "VIG", nome: "Vigor", valor: 0},
        {sigla: "AGL", nome: "Agilidade", valor: 2},
        {sigla: "INT", nome: "Inteligência", valor: 1, bonus: 2},
        {sigla: "ESP", nome: "Espírito", valor: 0},
        {sigla: "MAG", nome: "Magia", valor: 3, bonus: 5},
    ],

    pericias: [
        {atributo: "MAG", pericia_valor: [
            {nome: "Mana", valor: 2, bonus: 2},
            {nome: "Grimório", valor: 5, bonus: 2},
            {nome: "Visão", valor: 1},
        ]},
        {atributo: "INT", pericia_valor: [
            {nome: "Percepção", valor: 1},
            {nome: "Percepção", valor: 0, bonus: -2},
        ]},
        {atributo: "ESP", pericia_valor: [
            {nome: "Persuasão", valor: 0, bonus: -2}
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
            nome: 'Inrelicário Vazio',
            grimorio: 'Grimório',
            nivel: 1,
            descricao: 'O usuário invoca relíquias de armas convertidas no vazio por portais específicos. Apenas um inrelicário pode ser invocado por vez.',
            subdescricao: ['Adagas | Cortam o oponente e causam dano físico a matéria.', 'Correntes | Prendem o oponente, restringindo movimentos físicos.', 'Vinhas | Se prendem no alvo, dificultando a liberação e controle de mana dele, dando desvantagem em testes mágicos. O alvo deve usar o turno caso queira desfazer as vinhas de si.'],
            efeitos: ['[BUFF]'],
            subataques: [
                {nome: 'Adagas', descricao: 'Cortam o oponente e causam dano físico a matéria.', dano: '1dMag + Grimorio'}, 
                {nome: 'Correntes', descricao: 'Prendem o oponente, restringindo movimentos físicos.',efeito: '[IMMOBILIZED]'}, 
                {nome: 'Vinhas', descricao: 'e prendem no alvo, dificultando a liberação e controle de mana dele, dando desvantagem em testes mágicos. O alvo deve usar o turno caso queira desfazer as vinhas de si.',efeito: '[DEBUFF]'}
            ]
        },

    ],
}, 


}

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
            arquetipo: 'Caçador',
            discord_id: '405381448879702039'
        },

        atributos: [
            { pv: 88, ps: 15 },
            { sigla: 'FOR', nome: 'Força', valor: 2 },
            { sigla: 'VIG', nome: 'Vigor', valor: 10, prestigio: 2 },
            { sigla: 'AGL', nome: 'Agilidade', valor: 7 },
            { sigla: 'INT', nome: 'Inteligência', valor: 10 },
            { sigla: 'ESP', nome: 'Espírito', valor: 0 },
            { sigla: 'MAG', nome: 'Magia', valor: 6, prestigio: 3 }
        ],

        pericias: [
            {
                atributo: 'MAG',
                pericia_valor: [
                    { nome: 'Visão', valor: 15 },
                    { nome: 'Mana', valor: 15 },
                    { nome: 'Resistência', valor: 15 },
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
},

ami: {
        info: {
            nome_data: 'ami',
            nome: 'Ami Akiami',
            inspiracao: 0,
            nivel: 13,
            xp: 0,
            idade: '14',
            altura: 158,
            peso: 61,
            classe: '-',
            arquetipo: 'Feiticeiro',
            discord_id: '373606886114721802'
        },

        atributos: [
            { pv: 88, ps: 10 },
            { sigla: 'FOR', nome: 'Força', valor: 2 },
            { sigla: 'VIG', nome: 'Vigor', valor: 2},
            { sigla: 'AGL', nome: 'Agilidade', valor: 2 },
            { sigla: 'INT', nome: 'Inteligência', valor: 7 },
            { sigla: 'ESP', nome: 'Espírito', valor: 3 },
            { sigla: 'MAG', nome: 'Magia', valor: 8, prestigio: 3 }
        ],

        pericias: [
            {
                atributo: 'MAG',
                pericia_valor: [
                    { nome: 'Visão', valor: 10 },
                    { nome: 'Mana', valor: 8 },
                    { nome: 'Controle', valor: 15 },
                ]
            },
            {
                atributo: 'INT',
                pericia_valor: [
                    { nome: 'Percepção', valor: 5 },
                ]
            },
        ],

        habilidades: [
            {
                nome: 'Lobo (Caim Vorthal)',
                grimorio: 'Runas',
                nivel: 3,
                descricao: 'O lobo converte a mana ao redor em uma única garra poderosa. Imediatamente rouba mana de todos em um campo. Para cada indivíduo que tenha sua mana roubada desta forma, garras de lobo aparecem para golpear a área, causando dano proporcional a mana roubada. Se mais de 3 pessoas forem roubadas desta forma, o ataque do Lobo se torna uma mordida poderosa. A quantidade de mana roubada varia conforme quantos indivíduos são afetados; reduzindo seu roubo para cada indivíduo presente.',
                subataques: [
                {
                    nome: 'Garras',
                    descricao: 'Garras de lobo aparecem para golpear a área, causando dano proporcional a mana roubada.',
                    dano: '1dMag',
                    calculoDano: { atributo: 'MAG'},
                    efeitos: '[AREA]'
                },
                {
                    nome: 'Mordida',
                    descricao: 'A mordida do lobo é uma técnica poderosa que causa dano significativo.',
                    dano: '2dMag',
                    calculoDano: { atributo: 'MAG'},
                    efeitos: '[AREA]'
                }, 
            ]
            },
            {
                nome: 'Pégasus (Ami Akiami)',
                grimorio: 'Runas',
                nivel: 1,
                descricao: 'O pégasus voa ao céu, recebendo visão ampla e ganhando vantagens específicas por estar voando.'
            },
            {
                nome: 'Pavão (Nyra Solthar)',
                grimorio: 'Runas',
                nivel: 1,
                descricao: 'O pavão obtém informação parcial da Ânima alheia ao observar os olhos de um indivíduo. Isso permite vantagens contra tal Ânima, onde o pavão nunca será surpreendido por seus efeitos.'
            },
            {
                nome: 'Mariposa (Selkha Ihn)',
                grimorio: 'Runas',
                nivel: 3,
                descricao: 'A mariposa implanta a zona "Asas da Morte" em campo por Mag/3 turnos. Dentro dela, qualquer portador que utilize mana, receba mana ou tenha sua mana roubada, imediatamente recebe 1dMag de dano. Este dano é armazenado em até 3 dados. Quando a zona se encerra, ou quando a mariposa decidir que a zona se encerra, o dano armazenado é transformado em uma explosão rósea de mana, que causa dano. O dano da explosão é proporcional ao dano armazenado, e é causado a todos dentro da zona, incluindo o portador da mariposa.',
                subataques: [
                {
                    nome: 'Baixo',
                    descricao: '1dMag de dano armazenado.',
                    dano: '1dMag',
                    calculoDano: { atributo: 'MAG'}
                },
                {
                    nome: 'Médio',
                    descricao: '2dMag de dano armazenado.',
                    dano: '2dMag',
                    calculoDano: { atributo: 'MAG'}
                },
                {
                    nome: 'Alto',
                    descricao: '3dMag de dano armazenado.',
                    dano: '3dMag',
                    calculoDano: { atributo: 'MAG'}
                }
            ]
            },
            {
                nome: 'Dragão (Zerath Vornak)',
                grimorio: 'Runas',
                nivel: 'Suprema',
                descricao: `- (AÇÃO) Abre uma fenda no ar. Da fenda, o "Dragão Sanguinário" aparece. O "Dragão Sanguinário" imediatamente cospe "Sangue Fervente" em uma área, e então, obtém 3 reutilizações de "Sangue Fervente". 
                
                - (DRAGÃO SANGUINÁRIO): "Dragão Sanguinário" é uma forma de dragão imbuída em sangue. Suas asas são despedaçadas, e partes do seu corpo são deformadas, pelo esforço que o usuário da runa está impondo. "Dragão Sanguinário" dura Mag/3 turnos. 
                
                - (SANGUE FERVENTE: 3 REUTILIZAÇÕES): Causa 2dMag + Controle de dano e consegue derreter matérias frágeis. O usuário pode usar uma ação para fazer o "Dragão Sanguinário" cuspir "Sangue Fervente". Isto gasta 1 reutilização de "Sangue Fervente". O usuário pode realizar esta ação após o turno de qualquer indivíduo além de seu próprio. 
                
                - (HABILIDADE: "Até a Próxima, Primeira Lâmina"): Quando o "Dragão Sanguinário" sair de campo de qualquer maneira, ele explode em sangue, causando 3dMag + Controle de dano em área.`,
                subataques: [
                {
                    nome: 'Sangue Fervente',
                    descricao: 'O Dragão dispara uma rajada de sangue fervente em um alvo, causando dano significativo.',
                    dano: '2dMag + Controle',
                    calculoDano: { atributo: 'MAG', pericia: 'Controle' },
                },
                {
                    nome: 'Até a Próxima, Primeira Lâmina',
                    descricao: 'Quando o Dragão Sanguinário desaparece, ele explode em sangue, causando 3dMag + Controle de dano em área.',
                    dano: '3dMag + Controle',
                    calculoDano: { atributo: 'MAG', pericia: 'Controle' },
                    efeitos: '[AREA]'
                }
            ]
            }
        ]
},

mordrek: {
        info: {
            nome_data: 'mordrek',
            nome: 'Mordrek Ashveil - Veilash Kredmor',
            inspiracao: 0,
            nivel: 15,
            xp: 0,
            idade: '30',
            altura: 175,
            peso: 90,
            classe: '-',
            arquetipo: 'Feiticeiro',
            discord_id: '698345882428506242'
        },

        atributos: [
            { pv: 88, ps: 12 },
            { sigla: 'FOR', nome: 'Força', valor: 0 },
            { sigla: 'VIG', nome: 'Vigor', valor: 10},
            { sigla: 'AGL', nome: 'Agilidade', valor: 3 },
            { sigla: 'INT', nome: 'Inteligência', valor: 10 },
            { sigla: 'ESP', nome: 'Espírito', valor: 0 },
            { sigla: 'MAG', nome: 'Magia', valor: 10, prestigio: 3 }
        ],

        pericias: [
            {
                atributo: 'MAG',
                pericia_valor: [
                    { nome: 'Visão', valor: 15 },
                    { nome: 'Mana', valor: 15 },
                    { nome: 'Intimidação', valor: 15 },
                ]
            },
        ],

        habilidades: [
            {
                nome: 'Guerra',
                grimorio: 'Mana',
                nivel: 'Suprema',
                descricao: 'Guerra. O destruidor de mundos, ganha uma espada feita de mana capaz de corromper a mente de seus alvos com um único toque. Ao corrompê-los o alvo fica descontrolado e começa a atacar tudo pela sua frente.',
                dano: '1dMag + Mana',
                calculoDano: { atributo: 'MAG', pericia: 'Mana' },
                efeitos: ['[ESPECIAL]']
            },
            {
                nome: 'Peste',
                grimorio: 'Mana',
                nivel: 'Suprema',
                descricao: 'Peste. A Peste é capaz de intimidar qualquer um. Qualquer um que sinta sua presente enquanto a peste está ativa tem a sensação de que algo terrível irá acontecer, e que a morte está próxima. A Peste é tão poderosa que pode até mesmo causar a morte de indivíduos mais fracos, ou com a sanidade baixa, apenas por estar ativa.',
                efeitos: ['[DEBUFF]']
            },
            {
                nome: 'Fome',
                grimorio: 'Mana',
                nivel: 'Suprema',
                descricao: 'Fome. Quando a fome está ativa, o usuário enfraquece seus alvos. Sua mana fica enfraquecida, seus movimentos ficam lentos, e suas ações ficam mais difíceis de serem realizadas.',
                efeitos: ['[DEBUFF]']
            },
            {
                nome: 'Morte',
                grimorio: 'Mana',
                nivel: 'Suprema',
                descricao: 'Morte. Ataques com a morte determinam a morte do alvo. Não de uma vez, mas lentamente ele vai sumindo da realidade, não sobrando se quer uma gota. A cada turno com a morte ativa o alvo perde mais sua vida aos poucos.',
                dano: '2dMag + Mana',
                efeitos: ['[ESPECIAL]']
            }
        ]
},

caim: {
        info: {
            nome_data: 'caim',
            nome: 'Caim Vorthal',
            inspiracao: 0,
            nivel: 14,
            xp: 0,
            idade: '37',
            altura: 180,
            peso: 76,
            classe: '-',
            arquetipo: 'Lutador',
            discord_id: '726667619729539132'
        },

        atributos: [
            { pv: 88, ps: 10 },
            { sigla: 'FOR', nome: 'Força', valor: 5, prestigio: 3 },
            { sigla: 'VIG', nome: 'Vigor', valor: 8},
            { sigla: 'AGL', nome: 'Agilidade', valor: 0 },
            { sigla: 'INT', nome: 'Inteligência', valor: 5 },
            { sigla: 'ESP', nome: 'Espírito', valor: 0 },
            { sigla: 'MAG', nome: 'Magia', valor: 10 }
        ],

        pericias: [
            {
                atributo: 'FOR',
                pericia_valor: [
                    { nome: 'Luta', valor: 15 },
                    { nome: 'Resistência', valor: 15 },
                ]
            },
            {
                atributo: 'FOR',
                pericia_valor: [
                    { nome: 'Mana', valor: 15 },
                ]
            },
        ],

        habilidades: [
            {
                nome: 'Passo Estrondo',
                grimorio: 'Mana',
                nivel: 2,
                descricao: 'O usuário libera toda a energia cinética armazenada nas pernas, o que elevaria absurdamente a sua velocidade e quanto mais passos desse, mais energia seria acumulada. Ao chegar perto do alvo, seria desferido uma voadora descarregando toda a energia acumulada.',
                efeitos: ['[BUFF]']
            },
        ]
},

mercy: {
        info: {
            nome_data: 'mercy',
            nome: 'Mercy Vornak',
            inspiracao: 0,
            nivel: 13,
            xp: 0,
            idade: '19',
            altura: 171,
            peso: 65,
            classe: '-',
            arquetipo: 'Feiticeiro',
            discord_id: '898633326854823938'
        },

        atributos: [
            { pv: 88, ps: 10 },
            { sigla: 'FOR', nome: 'Força', valor: 3 },
            { sigla: 'VIG', nome: 'Vigor', valor: 6},
            { sigla: 'AGL', nome: 'Agilidade', valor: 8, prestigio: 2 },
            { sigla: 'INT', nome: 'Inteligência', valor: 6 },
            { sigla: 'ESP', nome: 'Espírito', valor: 0 },
            { sigla: 'MAG', nome: 'Magia', valor: 8 }
        ],

        pericias: [
            {
                atributo: 'AGL',
                pericia_valor: [
                    { nome: 'Reflexos', valor: 15 },
                    { nome: 'Esgrima', valor: 10 },
                ]
            },
            {
                atributo: 'MAG',
                pericia_valor: [
                   { nome: 'Mana', valor: 15 },
                ]
            },
        ],

        habilidades: [
            {
                nome: 'Metamorfose',
                grimorio: 'Mana',
                nivel: 3,
                descricao: 'O usuário pode se moldar em qualquer forma que desejar, seja para se disfarçar ou para ganhar vantagens específicas. Ele pode se transformar em um animal, em uma pessoa, ou até mesmo em um objeto. Ele pode manter a forma por um tempo limitado, e pode mudar de forma quantas vezes quiser dentro desse tempo.',
                efeitos: ['[BUFF]']
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
    const bonusVidaPorPrestigio = (prestigioVigor) * 10;

    personagem.atributos[0].pv =
        formula.pvInicial +
        (formula.pvPorNivel * nivel) +
        vigor +
        bonusVidaPorPrestigio;
}

Object.values(npcData).forEach(calcularPvAutomatico);

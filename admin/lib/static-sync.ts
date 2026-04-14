import type { Tables } from '@/types/supabase'

type CharacterBundle = {
  character: Tables<'characters'>
  attributes: Tables<'attributes'>[]
  skills: Tables<'skills'>[]
  abilities: Tables<'abilities'>[]
  subAttacksByAbilityId: Map<string, Tables<'sub_attacks'>[]>
  story?: Tables<'stories'> | null
}

const ARQUETIPO_TO_ENUM: Record<string, Tables<'characters'>['arquetipo']> = {
  tanque: 'tanque',
  lutador: 'lutador',
  cacador: 'cacador',
  caçador: 'cacador',
  feiticeiro: 'feiticeiro',
  genio: 'genio',
  gênio: 'genio',
}

const ENUM_TO_ARQUETIPO: Record<Tables<'characters'>['arquetipo'], string> = {
  tanque: 'Tanque',
  lutador: 'Lutador',
  cacador: 'Caçador',
  feiticeiro: 'Feiticeiro',
  genio: 'Gênio',
}

export function toArchetypeEnum(value: unknown): Tables<'characters'>['arquetipo'] {
  if (typeof value !== 'string') return 'genio'
  return ARQUETIPO_TO_ENUM[value.trim().toLowerCase()] ?? 'genio'
}

function toLegacyCharacter(bundle: CharacterBundle) {
  const { character, attributes, skills, abilities, subAttacksByAbilityId } = bundle
  const attrRows = [...attributes].sort((a, b) => a.sort_order - b.sort_order)
  const skillRows = [...skills].sort((a, b) => a.sort_order - b.sort_order)
  const abilityRows = [...abilities].sort((a, b) => a.sort_order - b.sort_order)

  const atributos = [
    { pv: character.pv_max, ps: character.ps_max },
    ...attrRows.map((attr) => ({
      sigla: attr.sigla,
      nome: attr.nome,
      valor: attr.valor,
      ...(attr.bonus ? { bonus: attr.bonus } : {}),
      ...(attr.prestigio ? { prestigio: attr.prestigio } : {}),
    })),
  ]

  const skillGroups = new Map<string, { atributo: string; pericia_valor: unknown[] }>()
  for (const skill of skillRows) {
    const key = skill.atributo_sigla
    const group = skillGroups.get(key) ?? { atributo: key, pericia_valor: [] }
    group.pericia_valor.push({
      nome: skill.nome,
      valor: skill.valor,
      ...(skill.bonus ? { bonus: skill.bonus } : {}),
    })
    skillGroups.set(key, group)
  }

  const habilidades = abilityRows.map((ability) => {
    const subataques = (subAttacksByAbilityId.get(ability.id) ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((sub) => ({
        nome: sub.nome,
        descricao: sub.descricao ?? '',
        ...(sub.dano ? { dano: sub.dano } : {}),
        ...(sub.calculo_dano && typeof sub.calculo_dano === 'object'
          ? { calculoDano: sub.calculo_dano }
          : {}),
        ...(sub.efeitos ? { efeitos: sub.efeitos } : {}),
      }))

    return {
      nome: ability.nome,
      ...(ability.grimorio ? { grimorio: ability.grimorio } : {}),
      nivel: ability.nivel,
      ...(ability.descricao ? { descricao: ability.descricao } : {}),
      ...(ability.dano ? { dano: ability.dano } : {}),
      ...(ability.calculo_dano && typeof ability.calculo_dano === 'object'
        ? { calculoDano: ability.calculo_dano }
        : {}),
      efeitos: ability.efeitos,
      ...(subataques.length ? { subataques } : {}),
    }
  })

  const extraInfo = (character.extra_info ?? {}) as Record<string, unknown>

  return {
    info: {
      nome_data: character.slug,
      nome: character.nome,
      inspiracao: character.inspiracao,
      nivel: character.nivel,
      xp: character.xp,
      idade: character.idade ?? '',
      altura: character.altura ?? '',
      peso: character.peso ?? '',
      classe: character.classe_social ?? '',
      arquetipo: ENUM_TO_ARQUETIPO[character.arquetipo],
      discord_id: character.discord_id ?? '',
      ...(extraInfo.birth_date ? { birth_date: extraInfo.birth_date } : {}),
    },
    atributos,
    pericias: Array.from(skillGroups.values()),
    habilidades,
  }
}

export function buildLegacyDataFiles(input: {
  bundles: CharacterBundle[]
  generatedAt: string
}) {
  const players: Record<string, unknown> = {}
  const npcs: Record<string, unknown> = {}
  const playerStories: Record<string, string> = {}
  const npcStories: Record<string, string> = {}
  const playerPasswords: Record<string, string> = {}
  const npcPasswords: Record<string, string> = {}

  for (const bundle of input.bundles) {
    const { character, story } = bundle
    const legacy = toLegacyCharacter(bundle)

    if (character.entity_type === 'player') {
      players[character.slug] = legacy
      if (story?.content_html) playerStories[character.slug] = story.content_html
    } else {
      npcs[character.slug] = legacy
      if (story?.content_html) npcStories[character.slug] = story.content_html
    }

    const extraInfo = (character.extra_info ?? {}) as Record<string, unknown>
    const auth = extraInfo.auth as Record<string, unknown> | undefined
    const hash =
      typeof auth?.password_hash === 'string'
        ? auth.password_hash
        : typeof extraInfo.password_hash === 'string'
          ? extraInfo.password_hash
          : null

    if (hash) {
      if (character.entity_type === 'player') {
        playerPasswords[hash] = character.slug
      } else {
        npcPasswords[hash] = character.slug
      }
    }
  }

  return {
    dataJs: `// Auto-generated by Lapse Admin — do not edit manually\n// Generated at: ${input.generatedAt}\n\nconst data = ${JSON.stringify(players, null, 4)};\n`,
    npcDataJs: `// Auto-generated by Lapse Admin — do not edit manually\n// Generated at: ${input.generatedAt}\n\nconst npcData = ${JSON.stringify(npcs, null, 4)};\n`,
    characterStoriesJs: `// Auto-generated by Lapse Admin — do not edit manually\n// Generated at: ${input.generatedAt}\n\nwindow.CHARACTER_STORIES = ${JSON.stringify(playerStories, null, 4)};\n`,
    npcStoriesJs: `// Auto-generated by Lapse Admin — do not edit manually\n// Generated at: ${input.generatedAt}\n\nwindow.NPC_STORIES = ${JSON.stringify(npcStories, null, 4)};\n`,
    passwordConfigJs: `// Auto-generated by Lapse Admin — do not edit manually\n// Generated at: ${input.generatedAt}\n\n(function () {\n    const PLAYER_PASSWORD_MAP = ${JSON.stringify(playerPasswords, null, 8)};\n\n    const NPC_PASSWORD_MAP = ${JSON.stringify(npcPasswords, null, 8)};\n\n    const toHashList = (passwordMap) => Object.keys(passwordMap);\n\n    const normalizePassword = (text = '') =>\n        text.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');\n\n    const hashPassword = async (text) => {\n        const bytes = new TextEncoder().encode(text);\n        const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);\n        return Array.from(new Uint8Array(hashBuffer))\n            .map((b) => b.toString(16).padStart(2, '0'))\n            .join('');\n    };\n\n    window.PASSWORDS = {\n        players: {\n            map: PLAYER_PASSWORD_MAP,\n            hashes: toHashList(PLAYER_PASSWORD_MAP),\n        },\n        npcs: {\n            map: NPC_PASSWORD_MAP,\n            hashes: toHashList(NPC_PASSWORD_MAP),\n        },\n        normalizePassword,\n        hashPassword,\n    };\n})();\n`,
  }
}

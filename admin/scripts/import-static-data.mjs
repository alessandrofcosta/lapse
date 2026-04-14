import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { createClient } from '@supabase/supabase-js'

const rootDir = path.resolve(process.cwd(), '..')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RPG_SLUG = process.env.LAPSE_RPG_SLUG ?? 'lapse'
const RPG_NAME = process.env.LAPSE_RPG_NAME ?? 'Lapse'

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const ARQ_MAP = {
  tanque: 'tanque',
  lutador: 'lutador',
  cacador: 'cacador',
  caçador: 'cacador',
  feiticeiro: 'feiticeiro',
  genio: 'genio',
  gênio: 'genio',
}

const toNum = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed || trimmed === '∞' || trimmed === '-') return null
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const toStr = (value) => {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text ? text : null
}

function parseConstObject(script, constName) {
  const context = { result: null }
  vm.createContext(context)
  vm.runInContext(`${script}\nresult = ${constName};`, context)
  return context.result
}

function parseStories(script, globalName) {
  const context = { window: {} }
  vm.createContext(context)
  vm.runInContext(script, context)
  return context.window[globalName] ?? {}
}

function parsePasswordMaps(script) {
  const playerMatch = script.match(/const PLAYER_PASSWORD_MAP = (\{[\s\S]*?\n\s*\});/)
  const npcMatch = script.match(/const NPC_PASSWORD_MAP = (\{[\s\S]*?\n\s*\});/)

  if (!playerMatch || !npcMatch) {
    throw new Error('Could not parse PLAYER_PASSWORD_MAP / NPC_PASSWORD_MAP from js/passwords/config.js')
  }

  return {
    players: parseConstObject(`const PLAYER_PASSWORD_MAP = ${playerMatch[1]}`, 'PLAYER_PASSWORD_MAP'),
    npcs: parseConstObject(`const NPC_PASSWORD_MAP = ${npcMatch[1]}`, 'NPC_PASSWORD_MAP'),
  }
}

async function ensureRpg() {
  const { data: existing, error: readError } = await supabase
    .from('rpgs')
    .select('id, slug')
    .eq('slug', RPG_SLUG)
    .maybeSingle()

  if (readError) throw readError
  if (existing) return existing.id

  const { data, error } = await supabase
    .from('rpgs')
    .insert({ name: RPG_NAME, slug: RPG_SLUG, description: 'Importado do site estático Lapse' })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

async function main() {
  const [playersRaw, npcsRaw, playerStoriesRaw, npcStoriesRaw, passwordConfigRaw] = await Promise.all([
    fs.readFile(path.join(rootDir, 'js/characters/data.js'), 'utf8'),
    fs.readFile(path.join(rootDir, 'js/npcs/data.js'), 'utf8'),
    fs.readFile(path.join(rootDir, 'js/characters/stories.js'), 'utf8'),
    fs.readFile(path.join(rootDir, 'js/npcs/stories.js'), 'utf8'),
    fs.readFile(path.join(rootDir, 'js/passwords/config.js'), 'utf8'),
  ])

  const playerData = parseConstObject(playersRaw, 'data')
  const npcData = parseConstObject(npcsRaw, 'npcData')
  const playerStories = parseStories(playerStoriesRaw, 'CHARACTER_STORIES')
  const npcStories = parseStories(npcStoriesRaw, 'NPC_STORIES')
  const passwordMaps = parsePasswordMaps(passwordConfigRaw)

  const playerPasswordBySlug = Object.fromEntries(
    Object.entries(passwordMaps.players).map(([hash, slug]) => [String(slug), hash])
  )
  const npcPasswordBySlug = Object.fromEntries(
    Object.entries(passwordMaps.npcs).map(([hash, slug]) => [String(slug), hash])
  )

  const rpgId = await ensureRpg()

  const characters = []
  const attributes = []
  const skills = []
  const abilities = []
  const subAttacks = []
  const stories = []

  function ingestEntity(entityMap, entityType) {
    for (const [slug, rawEntity] of Object.entries(entityMap)) {
      const info = rawEntity.info ?? {}
      const passwordHash = entityType === 'player' ? playerPasswordBySlug[slug] : npcPasswordBySlug[slug]
      const base = {
        rpg_id: rpgId,
        entity_type: entityType,
        slug,
        nome: info.nome || slug,
        nivel: toNum(info.nivel) ?? 1,
        xp: toNum(info.xp) ?? 0,
        arquetipo: ARQ_MAP[String(info.arquetipo ?? '').trim().toLowerCase()] ?? 'genio',
        idade: toStr(info.idade),
        altura: toNum(info.altura),
        peso: toNum(info.peso),
        classe_social: toStr(info.classe),
        inspiracao: toNum(info.inspiracao) ?? 0,
        discord_id: toStr(info.discord_id),
        ps_max: 10,
        extra_info: {
          legacy: {
            info,
          },
          ...(passwordHash ? { auth: { password_hash: passwordHash } } : {}),
        },
        is_active: true,
      }

      const attrs = Array.isArray(rawEntity.atributos) ? rawEntity.atributos : []
      const pvps = attrs[0] ?? {}
      base.ps_max = toNum(pvps.ps) ?? 0
      base.pv_max = toNum(pvps.pv) ?? 0
      characters.push(base)

      const storyContent = entityType === 'player' ? playerStories[slug] : npcStories[slug]
      if (storyContent) {
        stories.push({ slug, content_html: storyContent })
      }

      attrs.slice(1).forEach((attr, index) => {
        attributes.push({
          slug,
          rpg_id: rpgId,
          sigla: attr.sigla,
          nome: attr.nome,
          valor: toNum(attr.valor) ?? 0,
          bonus: toNum(attr.bonus) ?? 0,
          prestigio: toNum(attr.prestigio) ?? 0,
          sort_order: index,
        })
      })

      ;(rawEntity.pericias ?? []).forEach((group) => {
        ;(group.pericia_valor ?? []).forEach((skill, index) => {
          skills.push({
            slug,
            rpg_id: rpgId,
            atributo_sigla: group.atributo,
            nome: skill.nome,
            valor: toNum(skill.valor) ?? 0,
            bonus: toNum(skill.bonus) ?? 0,
            sort_order: index,
          })
        })
      })

      ;(rawEntity.habilidades ?? []).forEach((ability, index) => {
        const abilityKey = `${slug}::${index}::${ability.nome}`
        abilities.push({
          ability_key: abilityKey,
          slug,
          rpg_id: rpgId,
          nome: ability.nome,
          grimorio: toStr(ability.grimorio),
          nivel: String(ability.nivel ?? '1'),
          descricao: toStr(ability.descricao),
          dano: toStr(ability.dano),
          calculo_dano: ability.calculoDano ?? {},
          efeitos: Array.isArray(ability.efeitos) ? ability.efeitos : [],
          sort_order: index,
        })

        ;(ability.subataques ?? []).forEach((sub, subIndex) => {
          subAttacks.push({
            ability_key: abilityKey,
            rpg_id: rpgId,
            nome: sub.nome,
            descricao: toStr(sub.descricao),
            dano: toStr(sub.dano),
            calculo_dano: sub.calculoDano ?? {},
            efeitos: toStr(sub.efeitos),
            sort_order: subIndex,
          })
        })
      })
    }
  }

  ingestEntity(playerData, 'player')
  ingestEntity(npcData, 'npc')

  await supabase.from('sub_attacks').delete().eq('rpg_id', rpgId)
  await supabase.from('abilities').update({ deleted_at: new Date().toISOString() }).eq('rpg_id', rpgId)
  await supabase.from('skills').delete().eq('rpg_id', rpgId)
  await supabase.from('attributes').delete().eq('rpg_id', rpgId)
  await supabase.from('stories').delete().eq('rpg_id', rpgId)
  await supabase.from('characters').update({ deleted_at: new Date().toISOString() }).eq('rpg_id', rpgId)

  const { data: characterRows, error: characterError } = await supabase
    .from('characters')
    .insert(characters)
    .select('id, slug')

  if (characterError) throw characterError

  const characterIdBySlug = Object.fromEntries(characterRows.map((row) => [row.slug, row.id]))

  const { data: abilityRows, error: abilityError } = await supabase
    .from('abilities')
    .insert(
      abilities.map((ability) => ({
        character_id: characterIdBySlug[ability.slug],
        rpg_id: ability.rpg_id,
        nome: ability.nome,
        grimorio: ability.grimorio,
        nivel: ability.nivel,
        descricao: ability.descricao,
        dano: ability.dano,
        calculo_dano: ability.calculo_dano,
        efeitos: ability.efeitos,
        sort_order: ability.sort_order,
      }))
    )
    .select('id, character_id, nome, sort_order')

  if (abilityError) throw abilityError

  const abilityIdByKey = new Map()
  for (const source of abilities) {
    const characterId = characterIdBySlug[source.slug]
    const matched = abilityRows.find(
      (ability) => ability.character_id === characterId && ability.nome === source.nome && ability.sort_order === source.sort_order
    )
    if (matched) abilityIdByKey.set(source.ability_key, matched.id)
  }

  if (attributes.length) {
    const { error } = await supabase.from('attributes').insert(
      attributes.map((attr) => ({
        character_id: characterIdBySlug[attr.slug],
        rpg_id: attr.rpg_id,
        sigla: attr.sigla,
        nome: attr.nome,
        valor: attr.valor,
        bonus: attr.bonus,
        prestigio: attr.prestigio,
        sort_order: attr.sort_order,
      }))
    )
    if (error) throw error
  }

  if (skills.length) {
    const { error } = await supabase.from('skills').insert(
      skills.map((skill) => ({
        character_id: characterIdBySlug[skill.slug],
        rpg_id: skill.rpg_id,
        atributo_sigla: skill.atributo_sigla,
        nome: skill.nome,
        valor: skill.valor,
        bonus: skill.bonus,
        sort_order: skill.sort_order,
      }))
    )
    if (error) throw error
  }

  if (stories.length) {
    const { error } = await supabase.from('stories').insert(
      stories.map((story) => ({
        character_id: characterIdBySlug[story.slug],
        rpg_id: rpgId,
        content_html: story.content_html,
      }))
    )
    if (error) throw error
  }

  if (subAttacks.length) {
    const { error } = await supabase.from('sub_attacks').insert(
      subAttacks
        .filter((sub) => abilityIdByKey.has(sub.ability_key))
        .map((sub) => ({
          ability_id: abilityIdByKey.get(sub.ability_key),
          rpg_id: sub.rpg_id,
          nome: sub.nome,
          descricao: sub.descricao,
          dano: sub.dano,
          calculo_dano: sub.calculo_dano,
          efeitos: sub.efeitos,
          sort_order: sub.sort_order,
        }))
    )
    if (error) throw error
  }

  console.log(`Imported ${characters.length} characters, ${attributes.length} attributes, ${skills.length} skills, ${abilities.length} abilities, ${subAttacks.length} sub-attacks, ${stories.length} stories.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

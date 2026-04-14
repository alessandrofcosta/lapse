import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/supabase'
import { buildLegacyDataFiles } from '@/lib/static-sync'

export const dynamic = 'force-dynamic'

type CharacterWithRelations = Tables<'characters'> & {
  attributes: Tables<'attributes'>[]
  skills: Tables<'skills'>[]
  abilities: Tables<'abilities'>[]
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.EXPORT_SECRET
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: characterRows, error: characterError } = await supabase
    .from('characters')
    .select('*, attributes(*), skills(*), abilities(*)')
    .is('deleted_at', null)
    .order('nome')

  if (characterError) {
    return NextResponse.json({ error: characterError.message }, { status: 500 })
  }

  const characters = (characterRows ?? []) as unknown as CharacterWithRelations[]
  const abilityIds = characters.flatMap((character) => character.abilities.map((ability) => ability.id))
  const characterIds = characters.map((character) => character.id)

  const [{ data: subAttacks, error: subAttacksError }, { data: stories, error: storiesError }] = await Promise.all([
    abilityIds.length
      ? supabase.from('sub_attacks').select('*').in('ability_id', abilityIds).order('sort_order')
      : Promise.resolve({ data: [], error: null }),
    characterIds.length
      ? supabase.from('stories').select('*').in('character_id', characterIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (subAttacksError) {
    return NextResponse.json({ error: subAttacksError.message }, { status: 500 })
  }

  if (storiesError) {
    return NextResponse.json({ error: storiesError.message }, { status: 500 })
  }

  const subAttacksByAbilityId = new Map<string, Tables<'sub_attacks'>[]>()
  for (const subAttack of (subAttacks ?? []) as Tables<'sub_attacks'>[]) {
    const list = subAttacksByAbilityId.get(subAttack.ability_id) ?? []
    list.push(subAttack)
    subAttacksByAbilityId.set(subAttack.ability_id, list)
  }

  const storyByCharacterId = new Map<string, Tables<'stories'>>()
  for (const story of (stories ?? []) as Tables<'stories'>[]) {
    storyByCharacterId.set(story.character_id, story)
  }

  const bundles = characters.map((character) => ({
    character,
    attributes: character.attributes,
    skills: character.skills,
    abilities: character.abilities,
    subAttacksByAbilityId,
    story: storyByCharacterId.get(character.id) ?? null,
  }))

  const generatedAt = new Date().toISOString()
  const generated = buildLegacyDataFiles({ bundles, generatedAt })

  return NextResponse.json({
    success: true,
    generated_at: generatedAt,
    player_count: bundles.filter((bundle) => bundle.character.entity_type === 'player').length,
    npc_count: bundles.filter((bundle) => bundle.character.entity_type === 'npc').length,
    data_js: generated.dataJs,
    npc_data_js: generated.npcDataJs,
    character_stories_js: generated.characterStoriesJs,
    npc_stories_js: generated.npcStoriesJs,
    password_config_js: generated.passwordConfigJs,
  })
}

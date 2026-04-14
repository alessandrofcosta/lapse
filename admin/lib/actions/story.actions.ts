'use server'
import { revalidatePath } from 'next/cache'
import { createServerActionClient, createServiceClient } from '@/lib/supabase/server'
import type { Json } from '@/types/supabase'

export async function upsertStory(input: {
  characterId: string
  rpgId: string
  contentHtml: string
  entityType: 'player' | 'npc'
}) {
  const supabase = await createServerActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: existing } = await supabase
    .from('stories')
    .select('*')
    .eq('character_id', input.characterId)
    .maybeSingle()

  const payload = {
    character_id: input.characterId,
    rpg_id: input.rpgId,
    content_html: input.contentHtml,
    updated_by: user.id,
    ...(existing ? {} : { created_by: user.id }),
  }

  const { data, error } = existing
    ? await supabase
        .from('stories')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
    : await supabase.from('stories').insert(payload).select().single()

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: input.rpgId,
    action: existing ? 'update' : 'create',
    entity_type: 'story',
    entity_id: data.id,
    old_data: (existing ?? null) as Json,
    new_data: data as unknown as Json,
  })

  revalidatePath(`/${input.entityType === 'player' ? 'players' : 'npcs'}/${input.characterId}/story`)

  return { data }
}

'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerActionClient, createServiceClient } from '@/lib/supabase/server'
import { characterSchema } from '@/lib/validations/character.schema'
import type { Json } from '@/types/supabase'

export async function createCharacter(formData: z.infer<typeof characterSchema>) {
  const parsed = characterSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('characters')
    .insert({ ...parsed.data, created_by: user.id, updated_by: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: parsed.data.rpg_id,
    action: 'create',
    entity_type: 'character',
    entity_id: data.id,
    new_data: data as unknown as Json,
  })

  revalidatePath('/players')
  revalidatePath('/npcs')
  return { data }
}

export async function updateCharacter(
  id: string,
  formData: z.infer<typeof characterSchema>
) {
  const parsed = characterSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: old } = await supabase
    .from('characters')
    .select()
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('characters')
    .update({ ...parsed.data, updated_by: user.id })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: parsed.data.rpg_id,
    action: 'update',
    entity_type: 'character',
    entity_id: id,
    old_data: old as unknown as Json,
    new_data: data as unknown as Json,
  })

  revalidatePath('/players')
  revalidatePath('/npcs')
  return { data }
}

export async function softDeleteCharacter(id: string, rpgId: string) {
  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('characters')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id })
    .eq('id', id)

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: rpgId,
    action: 'delete',
    entity_type: 'character',
    entity_id: id,
  })

  revalidatePath('/players')
  revalidatePath('/npcs')
  return { success: true }
}

export async function bulkSoftDeleteCharacters(ids: string[], rpgId: string) {
  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('characters')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id })
    .in('id', ids)
    .eq('rpg_id', rpgId)

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert(
    ids.map((id) => ({
      actor_id: user.id,
      rpg_id: rpgId,
      action: 'bulk_delete',
      entity_type: 'character',
      entity_id: id,
    }))
  )

  revalidatePath('/players')
  revalidatePath('/npcs')
  return { success: true, count: ids.length }
}

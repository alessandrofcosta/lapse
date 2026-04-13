'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerActionClient, createServiceClient } from '@/lib/supabase/server'
import { abilitySchema } from '@/lib/validations/ability.schema'

export async function createAbility(formData: z.infer<typeof abilitySchema>) {
  const parsed = abilitySchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('abilities')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: parsed.data.rpg_id,
    action: 'create',
    entity_type: 'ability',
    entity_id: data.id,
    new_data: data as unknown as Record<string, unknown>,
  })

  revalidatePath(`/players/${parsed.data.character_id}/abilities`)
  return { data }
}

export async function updateAbility(id: string, formData: z.infer<typeof abilitySchema>) {
  const parsed = abilitySchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: old } = await supabase.from('abilities').select().eq('id', id).single()

  const { data, error } = await supabase
    .from('abilities')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: parsed.data.rpg_id,
    action: 'update',
    entity_type: 'ability',
    entity_id: id,
    old_data: old as unknown as Record<string, unknown>,
    new_data: data as unknown as Record<string, unknown>,
  })

  revalidatePath(`/players/${parsed.data.character_id}/abilities`)
  return { data }
}

export async function softDeleteAbility(id: string, characterId: string, rpgId: string) {
  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('abilities')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: rpgId,
    action: 'delete',
    entity_type: 'ability',
    entity_id: id,
  })

  revalidatePath(`/players/${characterId}/abilities`)
  return { success: true }
}

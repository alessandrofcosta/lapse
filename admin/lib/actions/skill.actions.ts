'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerActionClient, createServiceClient } from '@/lib/supabase/server'
import { skillSchema } from '@/lib/validations/skill.schema'

export async function createSkill(formData: z.infer<typeof skillSchema>) {
  const parsed = skillSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('skills')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: parsed.data.rpg_id,
    action: 'create',
    entity_type: 'skill',
    entity_id: data.id,
    new_data: data as unknown as Record<string, unknown>,
  })

  revalidatePath(`/players/${parsed.data.character_id}/skills`)
  return { data }
}

export async function updateSkill(id: string, formData: z.infer<typeof skillSchema>) {
  const parsed = skillSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: old } = await supabase.from('skills').select().eq('id', id).single()

  const { data, error } = await supabase
    .from('skills')
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
    entity_type: 'skill',
    entity_id: id,
    old_data: old as unknown as Record<string, unknown>,
    new_data: data as unknown as Record<string, unknown>,
  })

  revalidatePath(`/players/${parsed.data.character_id}/skills`)
  return { data }
}

export async function deleteSkill(id: string, characterId: string, rpgId: string) {
  const supabase = await createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) return { error: error.message }

  const service = createServiceClient()
  await service.from('audit_log').insert({
    actor_id: user.id,
    rpg_id: rpgId,
    action: 'delete',
    entity_type: 'skill',
    entity_id: id,
  })

  revalidatePath(`/players/${characterId}/skills`)
  return { success: true }
}

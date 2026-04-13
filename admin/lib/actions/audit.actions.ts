'use server'
import { createServiceClient } from '@/lib/supabase/server'
import type { Json } from '@/types/supabase'

interface AuditEntry {
  actor_id: string
  rpg_id?: string
  action: string
  entity_type: string
  entity_id?: string
  old_data?: Json
  new_data?: Json
}

export async function writeAuditLog(entry: AuditEntry) {
  const service = createServiceClient()
  const { error } = await service.from('audit_log').insert(entry)
  if (error) console.error('Audit log write failed:', error.message)
}

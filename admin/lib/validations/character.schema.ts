import { z } from 'zod'

export const characterSchema = z.object({
  rpg_id: z.string().uuid(),
  entity_type: z.enum(['player', 'npc']),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9_-]+$/),
  nome: z.string().min(1).max(100),
  nivel: z.number().int().min(1).max(100),
  xp: z.number().int().min(0).max(100),
  arquetipo: z.enum(['tanque', 'lutador', 'cacador', 'feiticeiro', 'genio']),
  idade: z.string().max(20).optional(),
  altura: z.number().int().positive().optional(),
  peso: z.number().int().positive().optional(),
  classe_social: z.string().max(50).optional(),
  inspiracao: z.number().int().min(0).default(0),
  discord_id: z.string().max(30).optional(),
  ps_max: z.number().int().min(0).default(10),
  extra_info: z.record(z.unknown()).default({}),
  is_active: z.boolean().default(true),
})

export type CharacterInput = z.infer<typeof characterSchema>

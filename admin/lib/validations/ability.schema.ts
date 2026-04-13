import { z } from 'zod'

export const abilitySchema = z.object({
  character_id: z.string().uuid(),
  rpg_id: z.string().uuid(),
  nome: z.string().min(1).max(100),
  grimorio: z.string().max(100).optional(),
  nivel: z.string().default('1'),
  descricao: z.string().optional(),
  dano: z.string().max(50).optional(),
  calculo_dano: z.record(z.unknown()).default({}),
  efeitos: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
})

export type AbilityInput = z.infer<typeof abilitySchema>

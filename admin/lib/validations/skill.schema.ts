import { z } from 'zod'

export const skillSchema = z.object({
  character_id: z.string().uuid(),
  rpg_id: z.string().uuid(),
  atributo_sigla: z.string().min(1).max(10),
  nome: z.string().min(1).max(100),
  valor: z.number().int().min(0).max(15),
  bonus: z.number().int().default(0),
  sort_order: z.number().int().default(0),
})

export type SkillInput = z.infer<typeof skillSchema>

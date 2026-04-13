'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAbility, softDeleteAbility } from '@/lib/actions/ability.actions'
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import type { Tables } from '@/types/supabase'

interface AbilityEditorProps {
  characterId: string
  rpgId: string
}

export function AbilityEditor({ characterId, rpgId }: AbilityEditorProps) {
  const [abilities, setAbilities] = useState<Tables<'abilities'>[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newNome, setNewNome] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('abilities')
      .select('*')
      .eq('character_id', characterId)
      .is('deleted_at', null)
      .order('sort_order')
      .then(({ data }) => {
        setAbilities(data ?? [])
        setLoading(false)
      })
  }, [characterId])

  async function handleAdd() {
    if (!newNome.trim()) return
    const result = await createAbility({
      character_id: characterId,
      rpg_id: rpgId,
      nome: newNome.trim(),
      nivel: '1',
      efeitos: [],
      calculo_dano: {},
      sort_order: abilities.length,
    })
    if ('data' in result && result.data) {
      setAbilities((prev) => [...prev, result.data!])
      setNewNome('')
    }
  }

  async function handleDelete(id: string) {
    await softDeleteAbility(id, characterId, rpgId)
    setAbilities((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading abilities...</p>

  return (
    <div className="space-y-2">
      {abilities.map((ability) => (
        <div key={ability.id} className="rounded-md border">
          <div
            className="flex cursor-pointer items-center justify-between px-4 py-3"
            onClick={() => setExpanded(expanded === ability.id ? null : ability.id)}
          >
            <div className="flex items-center gap-2">
              {expanded === ability.id ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">{ability.nome}</span>
              <span className="text-xs text-muted-foreground">Nível {ability.nivel}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(ability.id) }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {expanded === ability.id && (
            <div className="border-t px-4 py-3 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-muted-foreground">Dano:</span>{' '}
                  {ability.dano ?? '—'}
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Grimório:</span>{' '}
                  {ability.grimorio ?? '—'}
                </div>
              </div>
              {ability.descricao && (
                <p className="text-muted-foreground">{ability.descricao}</p>
              )}
              {ability.efeitos.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {ability.efeitos.map((ef, i) => (
                    <span key={i} className="rounded bg-muted px-2 py-0.5 text-xs">{ef}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        <Input
          placeholder="New ability name"
          value={newNome}
          onChange={(e) => setNewNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} size="sm">Add</Button>
      </div>
    </div>
  )
}

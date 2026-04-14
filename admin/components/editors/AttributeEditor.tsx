'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Tables } from '@/types/supabase'

interface AttributeEditorProps {
  characterId: string
  rpgId: string
}

const DEFAULT_ATTRIBUTES = [
  { sigla: 'FOR', nome: 'Força' },
  { sigla: 'VIG', nome: 'Vigor' },
  { sigla: 'AGL', nome: 'Agilidade' },
  { sigla: 'INT', nome: 'Inteligência' },
  { sigla: 'ESP', nome: 'Espírito' },
  { sigla: 'MAG', nome: 'Magia' },
]

export function AttributeEditor({ characterId, rpgId }: AttributeEditorProps) {
  const [attributes, setAttributes] = useState<Tables<'attributes'>[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('attributes')
      .select('*')
      .eq('character_id', characterId)
      .order('sort_order')
      .then(({ data }) => {
        setAttributes(data ?? [])
        setLoading(false)
      })
  }, [characterId])

  async function handleUpdate(id: string, field: 'valor' | 'bonus' | 'prestigio', value: number) {
    setSaving(id)
    const supabase = createClient()
    const patch =
      field === 'valor' ? { valor: value } :
      field === 'bonus' ? { bonus: value } :
      { prestigio: value }
    await supabase.from('attributes').update(patch).eq('id', id)
    setAttributes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    )
    setSaving(null)
  }

  async function handleCreate(sigla: string, nome: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('attributes')
      .insert({
        character_id: characterId,
        rpg_id: rpgId,
        sigla,
        nome,
        valor: 0,
        bonus: 0,
        prestigio: 1,
        sort_order: attributes.length,
      })
      .select()
      .single()
    if (data) setAttributes((prev) => [...prev, data])
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading attributes...</p>

  const missing = DEFAULT_ATTRIBUTES.filter(
    (d) => !attributes.find((a) => a.sigla === d.sigla)
  )

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2 text-left font-medium">Attribute</th>
              <th className="px-4 py-2 text-center font-medium">Value</th>
              <th className="px-4 py-2 text-center font-medium">Bonus</th>
              <th className="px-4 py-2 text-center font-medium">Prestige</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr) => (
              <tr key={attr.id} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">
                  <span className="text-xs font-mono text-muted-foreground">{attr.sigla}</span>
                  {' '}{attr.nome}
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    className="w-20 mx-auto text-center"
                    value={attr.valor}
                    disabled={saving === attr.id}
                    onChange={(e) => handleUpdate(attr.id, 'valor', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    className="w-20 mx-auto text-center"
                    value={attr.bonus}
                    disabled={saving === attr.id}
                    onChange={(e) => handleUpdate(attr.id, 'bonus', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    className="w-20 mx-auto text-center"
                    value={attr.prestigio}
                    disabled={saving === attr.id}
                    onChange={(e) => handleUpdate(attr.id, 'prestigio', parseInt(e.target.value) || 1)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {missing.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {missing.map((d) => (
            <Button
              key={d.sigla}
              variant="outline"
              size="sm"
              onClick={() => handleCreate(d.sigla, d.nome)}
            >
              + Add {d.sigla}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

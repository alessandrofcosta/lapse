'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSkill, deleteSkill, updateSkill } from '@/lib/actions/skill.actions'
import { Trash2, Plus } from 'lucide-react'
import type { Tables } from '@/types/supabase'

interface SkillEditorProps {
  characterId: string
  rpgId: string
}

export function SkillEditor({ characterId, rpgId }: SkillEditorProps) {
  const [skills, setSkills] = useState<Tables<'skills'>[]>([])
  const [loading, setLoading] = useState(true)
  const [newNome, setNewNome] = useState('')
  const [newSigla, setNewSigla] = useState('FOR')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('skills')
      .select('*')
      .eq('character_id', characterId)
      .order('sort_order')
      .then(({ data }) => {
        setSkills(data ?? [])
        setLoading(false)
      })
  }, [characterId])

  async function handleAdd() {
    if (!newNome.trim()) return
    const result = await createSkill({
      character_id: characterId,
      rpg_id: rpgId,
      atributo_sigla: newSigla,
      nome: newNome.trim(),
      valor: 0,
      bonus: 0,
      sort_order: skills.length,
    })
    if ('data' in result && result.data) {
      setSkills((prev) => [...prev, result.data!])
      setNewNome('')
    }
  }

  async function handleDelete(id: string) {
    await deleteSkill(id, characterId, rpgId)
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  async function handleValorChange(id: string, valor: number) {
    const skill = skills.find((s) => s.id === id)
    if (!skill) return
    await updateSkill(id, {
      character_id: skill.character_id,
      rpg_id: skill.rpg_id,
      atributo_sigla: skill.atributo_sigla,
      nome: skill.nome,
      valor,
      bonus: skill.bonus,
      sort_order: skill.sort_order,
    })
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, valor } : s)))
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading skills...</p>

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2 text-left">Skill</th>
              <th className="px-4 py-2 text-left">Attribute</th>
              <th className="px-4 py-2 text-center">Value</th>
              <th className="px-4 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No skills yet.
                </td>
              </tr>
            ) : (
              skills.map((skill) => (
                <tr key={skill.id} className="border-b last:border-0">
                  <td className="px-4 py-2">{skill.nome}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{skill.atributo_sigla}</td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      min={0}
                      max={15}
                      className="w-16 mx-auto text-center"
                      value={skill.valor}
                      onChange={(e) => handleValorChange(skill.id, parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Attribute (e.g. FOR)"
          value={newSigla}
          onChange={(e) => setNewSigla(e.target.value.toUpperCase())}
          className="w-24"
          maxLength={5}
        />
        <Input
          placeholder="Skill name"
          value={newNome}
          onChange={(e) => setNewNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  )
}

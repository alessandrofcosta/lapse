'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { JsonbEditor } from '@/components/shared/JsonbEditor'
import { createCharacter, updateCharacter, softDeleteCharacter } from '@/lib/actions/character.actions'
import type { Tables } from '@/types/supabase'
import type { CharacterInput } from '@/lib/validations/character.schema'
import { X } from 'lucide-react'

interface CharacterEditorProps {
  character?: Tables<'characters'>
  rpgId: string
  entityType: 'player' | 'npc'
  onClose: () => void
  onSaved: () => void
}

const defaultValues: Partial<CharacterInput> = {
  nivel: 1,
  xp: 0,
  inspiracao: 0,
  ps_max: 10,
  is_active: true,
  extra_info: {},
}

export function CharacterEditor({ character, rpgId, entityType, onClose, onSaved }: CharacterEditorProps) {
  const [form, setForm] = useState<Partial<CharacterInput>>({
    ...defaultValues,
    rpg_id: rpgId,
    entity_type: entityType,
    ...(character
      ? {
          slug: character.slug,
          nome: character.nome,
          nivel: character.nivel,
          xp: character.xp,
          arquetipo: character.arquetipo,
          idade: character.idade ?? undefined,
          altura: character.altura ?? undefined,
          peso: character.peso ?? undefined,
          classe_social: character.classe_social ?? undefined,
          inspiracao: character.inspiracao,
          discord_id: character.discord_id ?? undefined,
          ps_max: character.ps_max,
          extra_info: character.extra_info as Record<string, unknown>,
          is_active: character.is_active,
        }
      : {}),
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function update(field: keyof CharacterInput, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function getPasswordHash(value: unknown): string {
    if (!value || typeof value !== 'object') return ''
    const extra = value as Record<string, unknown>
    const auth = extra.auth
    if (auth && typeof auth === 'object' && typeof (auth as Record<string, unknown>).password_hash === 'string') {
      return (auth as Record<string, unknown>).password_hash as string
    }
    return typeof extra.password_hash === 'string' ? (extra.password_hash as string) : ''
  }

  function updatePasswordHash(hash: string) {
    const trimmed = hash.trim()
    const current = (form.extra_info as Record<string, unknown>) ?? {}
    const next: Record<string, unknown> = { ...current }
    const auth = current.auth && typeof current.auth === 'object'
      ? { ...(current.auth as Record<string, unknown>) }
      : {}

    if (trimmed) {
      auth.password_hash = trimmed
      next.auth = auth
      next.password_hash = trimmed
    } else {
      delete auth.password_hash
      if (Object.keys(auth).length > 0) next.auth = auth
      else delete next.auth
      delete next.password_hash
    }

    update('extra_info', next)
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    const result = character
      ? await updateCharacter(character.id, form as CharacterInput)
      : await createCharacter(form as CharacterInput)
    setLoading(false)
    if ('error' in result && result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Validation error')
    } else {
      onSaved()
      onClose()
    }
  }

  async function handleDelete() {
    if (!character) return
    setLoading(true)
    await softDeleteCharacter(character.id, rpgId)
    setLoading(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-[480px] flex-col border-l bg-card shadow-xl">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          {character ? 'Edit' : 'New'} {entityType === 'player' ? 'Player' : 'NPC'}
        </h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={form.nome ?? ''} onChange={(e) => update('nome', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input value={form.slug ?? ''} onChange={(e) => update('slug', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Archetype *</Label>
          <Select value={form.arquetipo ?? ''} onChange={(e) => update('arquetipo', e.target.value)}>
            <option value="">Select archetype</option>
            <option value="tanque">Tanque</option>
            <option value="lutador">Lutador</option>
            <option value="cacador">Caçador</option>
            <option value="feiticeiro">Feiticeiro</option>
            <option value="genio">Gênio</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Level</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={form.nivel ?? 1}
              onChange={(e) => update('nivel', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>XP</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.xp ?? 0}
              onChange={(e) => update('xp', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Age</Label>
            <Input value={form.idade ?? ''} onChange={(e) => update('idade', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Height (cm)</Label>
            <Input
              type="number"
              value={form.altura ?? ''}
              onChange={(e) => update('altura', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              value={form.peso ?? ''}
              onChange={(e) => update('peso', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Social Class</Label>
            <Input value={form.classe_social ?? ''} onChange={(e) => update('classe_social', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Discord ID</Label>
            <Input value={form.discord_id ?? ''} onChange={(e) => update('discord_id', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Inspiration</Label>
            <Input
              type="number"
              min={0}
              value={form.inspiracao ?? 0}
              onChange={(e) => update('inspiracao', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>PS Max</Label>
            <Input
              type="number"
              min={0}
              value={form.ps_max ?? 10}
              onChange={(e) => update('ps_max', parseInt(e.target.value))}
            />
          </div>
        </div>


        <div className="space-y-1.5">
          <Label>Password hash (SHA-256)</Label>
          <Input
            value={getPasswordHash(form.extra_info)}
            onChange={(e) => updatePasswordHash(e.target.value)}
            placeholder="Cole o hash SHA-256 usado no login estático"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Extra Info (JSONB)</Label>
          <JsonbEditor
            value={(form.extra_info as Record<string, unknown>) ?? {}}
            onChange={(v) => update('extra_info', v)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t px-6 py-4">
        {character && (
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

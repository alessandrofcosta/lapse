'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { upsertStory } from '@/lib/actions/story.actions'

interface StoryEditorProps {
  characterId: string
  rpgId: string
  entityType: 'player' | 'npc'
  initialContent: string
}

export function StoryEditor({ characterId, rpgId, entityType, initialContent }: StoryEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    const result = await upsertStory({
      characterId,
      rpgId,
      entityType,
      contentHtml: content,
    })
    setSaving(false)

    if ('error' in result && result.error) {
      setMessage(result.error)
      return
    }

    setMessage('Story salva com sucesso.')
  }

  return (
    <div className="space-y-3">
      <textarea
        className="min-h-[420px] w-full rounded-md border bg-background px-3 py-2 font-mono text-sm"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Cole aqui o HTML da história..."
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          O conteúdo é salvo como HTML e exportado automaticamente para os arquivos estáticos.
        </p>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar história'}
        </Button>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}

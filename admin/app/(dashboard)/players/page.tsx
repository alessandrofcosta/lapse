'use client'
import { useState } from 'react'
import { EntityTable } from '@/components/tables/EntityTable'
import { CharacterEditor } from '@/components/editors/CharacterEditor'
import { useRpgContext } from '@/components/providers/RpgContextProvider'
import { bulkSoftDeleteCharacters } from '@/lib/actions/character.actions'
import type { Tables } from '@/types/supabase'

export default function PlayersPage() {
  const { activeRpg } = useRpgContext()
  const [editing, setEditing] = useState<Tables<'characters'> | null>(null)
  const [refresh, setRefresh] = useState(0)

  if (!activeRpg) {
    return <p className="text-muted-foreground">Select an RPG to manage players.</p>
  }

  async function handleBulkDelete(ids: string[]) {
    await bulkSoftDeleteCharacters(ids, activeRpg!.id)
    setRefresh((n) => n + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Players</h1>
        <p className="text-muted-foreground">{activeRpg.name}</p>
      </div>

      <EntityTable
        key={`players-${activeRpg.id}-${refresh}`}
        rpgId={activeRpg.id}
        entityType="player"
        onRowClick={(char) => setEditing(char)}
        onBulkDelete={handleBulkDelete}
      />

      {editing && (
        <CharacterEditor
          character={editing}
          rpgId={activeRpg.id}
          entityType="player"
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); setRefresh((n) => n + 1) }}
        />
      )}
    </div>
  )
}

'use client'
import { useRpgContext } from '@/components/providers/RpgContextProvider'
import { CharacterEditor } from '@/components/editors/CharacterEditor'
import { useRouter } from 'next/navigation'

export default function NewPlayerPage() {
  const router = useRouter()
  const { activeRpg } = useRpgContext()

  if (!activeRpg) {
    return <p className="text-muted-foreground">Select an RPG first.</p>
  }

  return (
    <CharacterEditor
      rpgId={activeRpg.id}
      entityType="player"
      onClose={() => router.push('/players')}
      onSaved={() => router.push('/players')}
    />
  )
}

import { createServerActionClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SkillEditor } from '@/components/editors/SkillEditor'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import type { Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function PlayerSkillsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerActionClient()

  const { data: characterData } = await supabase
    .from('characters')
    .select('id, nome, rpg_id')
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  const character = characterData as Pick<Tables<'characters'>, 'id' | 'nome' | 'rpg_id'> | null

  if (!character) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/players/${id}`}>
          <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Skills — {character.nome}</h1>
      </div>
      <SkillEditor characterId={id} rpgId={character.rpg_id} />
    </div>
  )
}

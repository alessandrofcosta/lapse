import { createServerActionClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import type { Tables } from '@/types/supabase'
import { StoryEditor } from '@/components/editors/StoryEditor'

export const dynamic = 'force-dynamic'

export default async function NpcStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerActionClient()

  const { data: characterData } = await supabase
    .from('characters')
    .select('id, nome, rpg_id')
    .eq('id', id)
    .eq('entity_type', 'npc')
    .is('deleted_at', null)
    .single()
  const character = characterData as Pick<Tables<'characters'>, 'id' | 'nome' | 'rpg_id'> | null

  if (!character) notFound()

  const { data: storyData } = await supabase.from('stories').select('*').eq('character_id', id).maybeSingle()
  const story = storyData as Tables<'stories'> | null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/npcs/${id}`}>
          <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Story — {character.nome}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar história</CardTitle>
        </CardHeader>
        <CardContent>
          <StoryEditor
            characterId={character.id}
            rpgId={character.rpg_id}
            entityType="npc"
            initialContent={story?.content_html ?? ''}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {story ? (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: story.content_html }} />
          ) : (
            <p className="text-sm text-muted-foreground">No story written yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { createServerActionClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'
import type { Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function NpcDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerActionClient()

  const { data: characterData } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .eq('entity_type', 'npc')
    .is('deleted_at', null)
    .single()
  const character = characterData as Tables<'characters'> | null

  if (!character) notFound()

  const subPages = [
    { href: `/players/${id}/attributes`, label: 'Attributes' },
    { href: `/players/${id}/skills`, label: 'Skills' },
    { href: `/players/${id}/abilities`, label: 'Abilities' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/npcs">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{character.nome}</h1>
            <Badge variant="secondary">{character.arquetipo}</Badge>
            <Badge variant={character.is_active ? 'default' : 'outline'}>
              {character.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {character.slug} · Level {character.nivel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {subPages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Button variant="outline" className="w-full">
              {page.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

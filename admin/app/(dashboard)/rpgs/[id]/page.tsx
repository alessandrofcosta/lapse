import { createServerActionClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { EntityTable } from '@/components/tables/EntityTable'
import { RealtimeBadge } from '@/components/shared/RealtimeBadge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { bulkSoftDeleteCharacters } from '@/lib/actions/character.actions'
import type { Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function RpgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerActionClient()

  const { data: rpgData } = await supabase
    .from('rpgs')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  const rpg = rpgData as Tables<'rpgs'> | null

  if (!rpg) notFound()

  async function handleBulkDelete(ids: string[]) {
    'use server'
    await bulkSoftDeleteCharacters(ids, id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{rpg.name}</h1>
            <Badge variant={rpg.is_active ? 'default' : 'outline'}>
              {rpg.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <RealtimeBadge table="characters" rpgId={id} />
          </div>
          <p className="font-mono text-sm text-muted-foreground">{rpg.slug}</p>
          {rpg.description && (
            <p className="mt-1 text-muted-foreground">{rpg.description}</p>
          )}
        </div>
        <Link href={`/rpgs/${id}/admins`}>
          <Button variant="outline" size="sm">Manage Admins</Button>
        </Link>
      </div>

      <Tabs defaultValue="players">
        <TabsList>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="npcs">NPCs</TabsTrigger>
        </TabsList>
        <TabsContent value="players">
          <EntityTable
            rpgId={id}
            entityType="player"
            onBulkDelete={handleBulkDelete}
          />
        </TabsContent>
        <TabsContent value="npcs">
          <EntityTable
            rpgId={id}
            entityType="npc"
            onBulkDelete={handleBulkDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { createServerActionClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function RpgsPage() {
  const supabase = await createServerActionClient()
  const { data: rpgsData } = await supabase
    .from('rpgs')
    .select('*')
    .is('deleted_at', null)
    .order('name')
  const rpgs = rpgsData as Tables<'rpgs'>[] | null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RPGs</h1>
          <p className="text-muted-foreground">Manage your campaigns</p>
        </div>
        <Link href="/rpgs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New RPG
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(rpgs ?? []).map((rpg) => (
          <Link key={rpg.id} href={`/rpgs/${rpg.id}`}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <CardTitle className="text-base">{rpg.name}</CardTitle>
                <Badge variant={rpg.is_active ? 'default' : 'outline'}>
                  {rpg.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-xs text-muted-foreground">{rpg.slug}</p>
                {rpg.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {rpg.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {(rpgs ?? []).length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No RPGs yet. Create one to get started.
          </p>
        )}
      </div>
    </div>
  )
}

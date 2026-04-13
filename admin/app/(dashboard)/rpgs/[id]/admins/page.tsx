import { createServerActionClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import type { Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

type RpgAdmin = Tables<'rpg_admins'> & { profiles: { display_name: string; role: string } | null }

export default async function RpgAdminsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: adminsData } = await supabase
    .from('rpg_admins')
    .select('*, profiles(display_name, role)')
    .eq('rpg_id', id)
    .order('granted_at', { ascending: false })
  const admins = adminsData as RpgAdmin[] | null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/rpgs/${id}`}>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">RPG Admins</h1>
          <p className="text-muted-foreground">{rpg.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Admins</CardTitle>
        </CardHeader>
        <CardContent>
          {(admins ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No admins assigned to this RPG.</p>
          ) : (
            <ul className="space-y-3">
              {(admins ?? []).map((admin) => (
                <li key={admin.profile_id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {admin.profiles?.display_name ?? admin.profile_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Granted {new Date(admin.granted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">rpg_admin</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

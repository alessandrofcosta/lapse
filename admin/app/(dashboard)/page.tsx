import { createServerActionClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, Bot, Activity } from 'lucide-react'
import Link from 'next/link'
import type { Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerActionClient()

  const [rpgsResult, playersResult, npcsResult, auditResult] = await Promise.all([
    supabase.from('rpgs').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('characters').select('id', { count: 'exact', head: true }).eq('entity_type', 'player').is('deleted_at', null),
    supabase.from('characters').select('id', { count: 'exact', head: true }).eq('entity_type', 'npc').is('deleted_at', null),
    supabase.from('audit_log').select('id, action, entity_type, created_at').order('created_at', { ascending: false }).limit(10),
  ])
  const auditData = auditResult.data as Pick<Tables<'audit_log'>, 'id' | 'action' | 'entity_type' | 'created_at'>[] | null

  const stats = [
    { label: 'RPGs', value: rpgsResult.count ?? 0, icon: Shield, href: '/rpgs' },
    { label: 'Players', value: playersResult.count ?? 0, icon: Users, href: '/players' },
    { label: 'NPCs', value: npcsResult.count ?? 0, icon: Bot, href: '/npcs' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Lapse RPG campaigns</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(auditData ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {(auditData ?? []).map((entry) => (
                <li key={entry.id} className="flex items-center justify-between text-sm">
                  <span>
                    <span className="font-medium capitalize">{entry.action}</span>{' '}
                    <span className="text-muted-foreground">{entry.entity_type}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'

export function RealtimeBadge({ table, rpgId }: { table: string; rpgId: string }) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`realtime-badge:${table}:${rpgId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {})
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })
    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, rpgId])

  return (
    <Badge variant={connected ? 'default' : 'secondary'} className="text-xs">
      {connected ? '● Live' : '○ Offline'}
    </Badge>
  )
}

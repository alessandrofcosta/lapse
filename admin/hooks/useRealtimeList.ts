'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Tables } from '@/types/supabase'

export function useRealtimeCharacters(rpgId: string) {
  const [characters, setCharacters] = useState<Tables<'characters'>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('characters')
      .select('*')
      .eq('rpg_id', rpgId)
      .is('deleted_at', null)
      .order('nome')
      .then(({ data }) => {
        setCharacters(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`characters:rpg_id=eq.${rpgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'characters',
          filter: `rpg_id=eq.${rpgId}`,
        },
        (payload: RealtimePostgresChangesPayload<Tables<'characters'>>) => {
          setCharacters((prev) => {
            if (payload.eventType === 'INSERT')
              return [...prev, payload.new as Tables<'characters'>]
            if (payload.eventType === 'DELETE')
              return prev.filter((c) => c.id !== (payload.old as { id: string }).id)
            if (payload.eventType === 'UPDATE')
              return prev.map((c) =>
                c.id === (payload.new as Tables<'characters'>).id
                  ? (payload.new as Tables<'characters'>)
                  : c
              )
            return prev
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [rpgId])

  return { characters, loading }
}

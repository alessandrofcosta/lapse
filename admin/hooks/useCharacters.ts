'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/supabase'

interface UseCharactersOptions {
  rpgId: string
  entityType?: 'player' | 'npc'
  search?: string
  page?: number
  pageSize?: number
}

export function useCharacters({
  rpgId,
  entityType,
  search = '',
  page = 0,
  pageSize = 20,
}: UseCharactersOptions) {
  const [characters, setCharacters] = useState<Tables<'characters'>[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCharacters = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('characters')
      .select('*', { count: 'exact' })
      .eq('rpg_id', rpgId)
      .is('deleted_at', null)
      .order('nome')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (entityType) query = query.eq('entity_type', entityType)
    if (search) query = query.ilike('nome', `%${search}%`)

    const { data, count, error } = await query

    if (!error) {
      setCharacters(data ?? [])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }, [rpgId, entityType, search, page, pageSize])

  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  return { characters, total, loading, refetch: fetchCharacters }
}

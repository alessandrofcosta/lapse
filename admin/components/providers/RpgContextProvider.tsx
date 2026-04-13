'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/supabase'

type RpgContextType = {
  rpgs: Tables<'rpgs'>[]
  activeRpg: Tables<'rpgs'> | null
  setActiveRpg: (rpg: Tables<'rpgs'>) => void
  loading: boolean
}

const RpgContext = createContext<RpgContextType>({
  rpgs: [],
  activeRpg: null,
  setActiveRpg: () => {},
  loading: true,
})

export function RpgContextProvider({ children }: { children: ReactNode }) {
  const [rpgs, setRpgs] = useState<Tables<'rpgs'>[]>([])
  const [activeRpg, setActiveRpg] = useState<Tables<'rpgs'> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('rpgs')
      .select('*')
      .is('deleted_at', null)
      .order('name')
      .then(({ data }) => {
        const list = data ?? []
        setRpgs(list)
        if (list.length > 0) setActiveRpg(list[0])
        setLoading(false)
      })
  }, [])

  return (
    <RpgContext.Provider value={{ rpgs, activeRpg, setActiveRpg, loading }}>
      {children}
    </RpgContext.Provider>
  )
}

export function useRpgContext() {
  return useContext(RpgContext)
}

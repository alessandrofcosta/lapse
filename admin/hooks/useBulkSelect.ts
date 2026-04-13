'use client'
import { useState, useCallback } from 'react'

export function useBulkSelect<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setSelected((prev) =>
      prev.size === items.length
        ? new Set()
        : new Set(items.map((i) => i.id))
    )
  }, [items])

  const clear = useCallback(() => setSelected(new Set()), [])

  const isSelected = useCallback((id: string) => selected.has(id), [selected])

  return {
    selected,
    selectedIds: Array.from(selected),
    toggle,
    toggleAll,
    clear,
    isSelected,
    allSelected: items.length > 0 && selected.size === items.length,
    someSelected: selected.size > 0 && selected.size < items.length,
  }
}

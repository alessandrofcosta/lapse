'use client'
import { useRpgContext } from '@/components/providers/RpgContextProvider'
import { Select } from '@/components/ui/select'

export function RpgSwitcher() {
  const { rpgs, activeRpg, setActiveRpg } = useRpgContext()

  if (rpgs.length === 0) return null

  return (
    <Select
      value={activeRpg?.id ?? ''}
      onChange={(e) => {
        const rpg = rpgs.find((r) => r.id === e.target.value)
        if (rpg) setActiveRpg(rpg)
      }}
      className="w-48"
    >
      {rpgs.map((rpg) => (
        <option key={rpg.id} value={rpg.id}>
          {rpg.name}
        </option>
      ))}
    </Select>
  )
}

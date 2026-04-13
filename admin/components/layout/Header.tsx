'use client'
import { useRpgContext } from '@/components/providers/RpgContextProvider'
import { RpgSwitcher } from './RpgSwitcher'

export function Header() {
  const { activeRpg } = useRpgContext()

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <RpgSwitcher />
        {activeRpg && (
          <span className="text-sm text-muted-foreground">
            Active: <span className="font-medium text-foreground">{activeRpg.name}</span>
          </span>
        )}
      </div>
    </header>
  )
}

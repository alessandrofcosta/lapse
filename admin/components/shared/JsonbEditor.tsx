'use client'
import { useState, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

interface JsonbEditorProps {
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  className?: string
}

export function JsonbEditor({ value, onChange, className }: JsonbEditorProps) {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2))
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setRaw(text)
    try {
      const parsed = JSON.parse(text) as unknown
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        onChange(parsed as Record<string, unknown>)
        setError(null)
      } else {
        setError('Value must be a JSON object')
      }
    } catch {
      setError('Invalid JSON')
    }
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <textarea
        value={raw}
        onChange={handleChange}
        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        spellCheck={false}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Trash2, X } from 'lucide-react'

interface BulkActionBarProps {
  count: number
  onDelete: () => Promise<void>
  onClear: () => void
}

export function BulkActionBar({ count, onDelete, onClear }: BulkActionBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onDelete()
    setLoading(false)
    setConfirmOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2">
        <span className="text-sm font-medium">{count} selected</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setConfirmOpen(true)}
          className="gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${count} item${count > 1 ? 's' : ''}?`}
        description="This action cannot be undone. The selected items will be soft-deleted."
        onConfirm={handleConfirm}
        loading={loading}
        destructive
      />
    </>
  )
}

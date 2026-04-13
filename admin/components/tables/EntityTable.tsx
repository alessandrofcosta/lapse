'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { BulkActionBar } from './BulkActionBar'
import { useBulkSelect } from '@/hooks/useBulkSelect'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { Tables } from '@/types/supabase'

interface EntityTableProps {
  rpgId: string
  entityType: 'player' | 'npc'
  onRowClick?: (character: Tables<'characters'>) => void
  onBulkDelete?: (ids: string[]) => Promise<void>
}

export function EntityTable({ rpgId, entityType, onRowClick, onBulkDelete }: EntityTableProps) {
  const router = useRouter()
  const [characters, setCharacters] = useState<Tables<'characters'>[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 20

  const { selected, selectedIds, toggle, toggleAll, clear, isSelected, allSelected, someSelected } =
    useBulkSelect(characters)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    let query = supabase
      .from('characters')
      .select('*', { count: 'exact' })
      .eq('rpg_id', rpgId)
      .eq('entity_type', entityType)
      .is('deleted_at', null)
      .order('nome')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (search) query = query.ilike('nome', `%${search}%`)

    const { data, count } = await query
    setCharacters(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [rpgId, entityType, search, page, pageSize])

  useEffect(() => { fetchData() }, [fetchData])

  const archetypeLabels: Record<string, string> = {
    tanque: 'Tanque',
    lutador: 'Lutador',
    cacador: 'Caçador',
    feiticeiro: 'Feiticeiro',
    genio: 'Gênio',
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/${entityType === 'player' ? 'players' : 'npcs'}/new`)}
        >
          + New
        </Button>
      </div>

      {selected.size > 0 && onBulkDelete && (
        <BulkActionBar
          count={selected.size}
          onDelete={async () => {
            await onBulkDelete(selectedIds)
            clear()
            fetchData()
          }}
          onClear={clear}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected }}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Archetype</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : characters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No {entityType}s found.
                </TableCell>
              </TableRow>
            ) : (
              characters.map((char) => (
                <TableRow
                  key={char.id}
                  className="cursor-pointer"
                  onClick={() => onRowClick ? onRowClick(char) : router.push(`/${entityType === 'player' ? 'players' : 'npcs'}/${char.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(char.id)}
                      onChange={() => toggle(char.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{char.nome}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{char.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{archetypeLabels[char.arquetipo] ?? char.arquetipo}</Badge>
                  </TableCell>
                  <TableCell>{char.nivel}</TableCell>
                  <TableCell>
                    <Badge variant={char.is_active ? 'default' : 'outline'}>
                      {char.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} total · page {page + 1} of {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={(page + 1) * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

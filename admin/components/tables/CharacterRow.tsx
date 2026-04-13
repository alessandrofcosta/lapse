import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { Tables } from '@/types/supabase'

interface CharacterRowProps {
  character: Tables<'characters'>
  selected: boolean
  onSelect: () => void
  onClick: () => void
}

const archetypeLabels: Record<string, string> = {
  tanque: 'Tanque',
  lutador: 'Lutador',
  cacador: 'Caçador',
  feiticeiro: 'Feiticeiro',
  genio: 'Gênio',
}

export function CharacterRow({ character, selected, onSelect, onClick }: CharacterRowProps) {
  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={onSelect} />
      </TableCell>
      <TableCell className="font-medium">{character.nome}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{character.slug}</TableCell>
      <TableCell>
        <Badge variant="secondary">{archetypeLabels[character.arquetipo] ?? character.arquetipo}</Badge>
      </TableCell>
      <TableCell>{character.nivel}</TableCell>
      <TableCell>
        <Badge variant={character.is_active ? 'default' : 'outline'}>
          {character.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

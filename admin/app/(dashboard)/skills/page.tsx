'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRpgContext } from '@/components/providers/RpgContextProvider'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Search } from 'lucide-react'
import type { Tables } from '@/types/supabase'

type SkillWithCharacter = Tables<'skills'> & {
  characters: Pick<Tables<'characters'>, 'nome' | 'slug' | 'entity_type'> | null
}

export default function SkillsPage() {
  const { activeRpg } = useRpgContext()
  const [skills, setSkills] = useState<SkillWithCharacter[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchSkills = useCallback(async () => {
    if (!activeRpg) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('skills')
      .select('*, characters(nome, slug, entity_type)')
      .eq('rpg_id', activeRpg.id)
      .order('nome')
    setSkills((data as unknown as SkillWithCharacter[]) ?? [])
    setLoading(false)
  }, [activeRpg])

  useEffect(() => { fetchSkills() }, [fetchSkills])

  if (!activeRpg) {
    return <p className="text-muted-foreground">Select an RPG to view skills.</p>
  }

  const filtered = search
    ? skills.filter(
        (s) =>
          s.nome.toLowerCase().includes(search.toLowerCase()) ||
          s.atributo_sigla.toLowerCase().includes(search.toLowerCase()) ||
          s.characters?.nome.toLowerCase().includes(search.toLowerCase())
      )
    : skills

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skills</h1>
        <p className="text-muted-foreground">{activeRpg.name}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or attribute..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Attribute</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Character</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No skills found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.nome}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{skill.atributo_sigla}</TableCell>
                  <TableCell>{skill.valor}</TableCell>
                  <TableCell>{skill.bonus > 0 ? `+${skill.bonus}` : skill.bonus}</TableCell>
                  <TableCell>{skill.characters?.nome ?? '—'}</TableCell>
                  <TableCell>
                    {skill.characters?.entity_type && (
                      <Badge variant="secondary">
                        {skill.characters.entity_type === 'player' ? 'Player' : 'NPC'}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} skill{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  )
}

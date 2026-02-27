# Supabase: tabelas e CSV prontos

Este diretório contém uma estrutura de tabelas e arquivos CSV já preparados para importação no Supabase.

## Arquivos

- `schema.sql`: cria as tabelas com relacionamentos.
- `csv/profiles.csv`: cadastro base de personagens e NPCs.
- `csv/status.csv`: PV/PS de cada ficha.
- `csv/attributes.csv`: atributos por ficha.
- `csv/skills.csv`: perícias por ficha.
- `csv/abilities.csv`: habilidades por ficha.

## Ordem recomendada de importação

1. Execute `schema.sql` no SQL Editor do Supabase.
2. Importe `profiles.csv`.
3. Importe `status.csv`.
4. Importe `attributes.csv`.
5. Importe `skills.csv`.
6. Importe `abilities.csv`.

> Dica: no import de CSV, marque para usar a primeira linha como cabeçalho.

## Regenerar os CSVs

Sempre que alterar os dados em `js/characters/data.js` ou `js/npcs/data.js`:

```bash
node scripts/export_supabase_csv.mjs
```

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const outDir = path.join(root, 'supabase', 'csv');
fs.mkdirSync(outDir, { recursive: true });

function loadObject(filePath, variableName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const context = {};
  vm.createContext(context);
  const script = new vm.Script(`${code}\n;${variableName};`);
  return script.runInContext(context);
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[,"\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeCsv(filename, headers, rows) {
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','));
  }
  fs.writeFileSync(path.join(outDir, filename), `${lines.join('\n')}\n`);
}

const players = loadObject(path.join(root, 'js', 'characters', 'data.js'), 'data');
const npcs = loadObject(path.join(root, 'js', 'npcs', 'data.js'), 'npcData');

const entities = [
  ...Object.entries(players).map(([slug, record]) => ({ slug, type: 'player', record })),
  ...Object.entries(npcs).map(([slug, record]) => ({ slug, type: 'npc', record })),
];

let profileId = 1;
const profiles = [];
const statusRows = [];
const attributes = [];
const skills = [];
const abilities = [];

for (const { slug, type, record } of entities) {
  const info = record.info || {};
  profiles.push({
    id: profileId,
    slug,
    entity_type: type,
    name: info.nome || '',
    inspiration: info.inspiracao ?? '',
    level: info.nivel ?? '',
    xp: info.xp ?? '',
    age: info.idade ?? '',
    height_cm: info.altura ?? '',
    weight_kg: info.peso ?? '',
    class_name: info.classe ?? '',
    archetype: info.arquetipo ?? '',
    discord_id: info.discord_id ?? '',
  });

  const attrs = Array.isArray(record.atributos) ? record.atributos : [];
  const hpmp = attrs.find((item) => Object.hasOwn(item, 'pv') || Object.hasOwn(item, 'ps')) || {};

  statusRows.push({
    profile_slug: slug,
    pv: hpmp.pv ?? '',
    ps: hpmp.ps ?? '',
  });

  for (const attr of attrs.filter((item) => Object.hasOwn(item, 'sigla'))) {
    attributes.push({
      profile_slug: slug,
      attribute_code: attr.sigla ?? '',
      attribute_name: attr.nome ?? '',
      base_value: attr.valor ?? '',
      bonus: attr.bonus ?? 0,
      prestige: attr.prestigio ?? 0,
    });
  }

  for (const perBlock of record.pericias || []) {
    for (const skill of perBlock.pericia_valor || []) {
      skills.push({
        profile_slug: slug,
        attribute_code: perBlock.atributo ?? '',
        skill_name: skill.nome ?? '',
        base_value: skill.valor ?? '',
        bonus: skill.bonus ?? 0,
      });
    }
  }

  let abilityOrder = 1;
  for (const ability of record.habilidades || []) {
    abilities.push({
      profile_slug: slug,
      ability_order: abilityOrder,
      ability_name: ability.nome ?? '',
      grimoire: ability.grimorio ?? '',
      ability_level: ability.nivel ?? '',
      description: ability.descricao ?? '',
      damage_label: ability.dano ?? '',
      damage_formula: ability.danoJS ?? '',
      effects: Array.isArray(ability.efeitos) ? ability.efeitos.join(' ') : (ability.efeitos ?? ''),
      subattacks_json: ability.subataques ? JSON.stringify(ability.subataques) : '',
    });
    abilityOrder += 1;
  }

  profileId += 1;
}

writeCsv(
  'profiles.csv',
  ['id', 'slug', 'entity_type', 'name', 'inspiration', 'level', 'xp', 'age', 'height_cm', 'weight_kg', 'class_name', 'archetype', 'discord_id'],
  profiles,
);

writeCsv('status.csv', ['profile_slug', 'pv', 'ps'], statusRows);

writeCsv(
  'attributes.csv',
  ['profile_slug', 'attribute_code', 'attribute_name', 'base_value', 'bonus', 'prestige'],
  attributes,
);

writeCsv(
  'skills.csv',
  ['profile_slug', 'attribute_code', 'skill_name', 'base_value', 'bonus'],
  skills,
);

writeCsv(
  'abilities.csv',
  ['profile_slug', 'ability_order', 'ability_name', 'grimoire', 'ability_level', 'description', 'damage_label', 'damage_formula', 'effects', 'subattacks_json'],
  abilities,
);

console.log(`CSV files generated in ${outDir}`);

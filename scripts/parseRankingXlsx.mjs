// Le o xlsx do ranking historico e gera um JSON estruturado por etapa.
// Uso: node scripts/parseRankingXlsx.mjs <xlsx> [out.json]
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const xlsx = require('xlsx');

const MONTHS = {
  jan: '01', fev: '02', feb: '02', mar: '03', abr: '04', apr: '04',
  mai: '05', may: '05', jun: '06', jul: '07', ago: '08', aug: '08',
  set: '09', sep: '09', out: '10', oct: '10', nov: '11', dez: '12', dec: '12',
};

function parseDate(s, year) {
  const m = String(s).trim().match(/^(\d{1,2})\s*\/\s*([A-Za-zç]+)/);
  if (!m) return null;
  const day = m[1].padStart(2, '0');
  const month = MONTHS[m[2].slice(0, 3).toLowerCase()];
  if (!month) return null;
  return `${year}-${month}-${day}`;
}

const file = resolve(process.argv[2]);
const out = process.argv[3];
const wb = xlsx.readFile(file);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });

const year = 2026;

// Linha 0: titulos ("1ª Etapa", "2ª Etapa", ...) a partir da coluna F (indice 5)
// Linha 1: labels + datas a partir da coluna F
const etapaHeaders = rows[0];
const dateHeaders = rows[1];

const stages = [];
for (let c = 5; c < dateHeaders.length; c++) {
  const dateStr = parseDate(dateHeaders[c], year);
  if (!dateStr) continue;
  stages.push({
    column: c,
    name: String(etapaHeaders[c] || '').trim(),
    date: dateStr,
    participants: [],
  });
}

// Linhas de jogadores: a partir da 2; sao validas enquanto a col A nao vazia.
for (let r = 2; r < rows.length; r++) {
  const row = rows[r];
  const player = String(row[0] || '').trim();
  if (!player) continue;

  for (const stage of stages) {
    const raw = String(row[stage.column] || '').trim();
    if (!raw) continue;
    const n = Number(raw.replace(',', '.'));
    if (!Number.isFinite(n)) continue;
    stage.participants.push({ name: player, points: n });
  }
}

// Ordena participantes por pontos desc e atribui posicoes 1..N com tie-break alfabetico.
for (const stage of stages) {
  stage.participants.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  stage.participants = stage.participants.map((p, i) => ({ position: i + 1, ...p }));
}

const summary = {
  totalStages: stages.length,
  totalParticipations: stages.reduce((acc, s) => acc + s.participants.length, 0),
  uniquePlayers: new Set(stages.flatMap((s) => s.participants.map((p) => p.name))).size,
  stages: stages.map((s) => ({
    name: s.name,
    date: s.date,
    players: s.participants.length,
    topPoints: s.participants[0]?.points ?? 0,
  })),
};

console.log(JSON.stringify(summary, null, 2));

for (const stage of stages) {
  console.log(`\n=== ${stage.name} — ${stage.date} (${stage.participants.length} jogadores) ===`);
  for (const p of stage.participants) {
    console.log(`${String(p.position).padStart(2)}  ${p.name.padEnd(32)} ${String(p.points).padStart(3)} pts`);
  }
}

if (out) {
  writeFileSync(resolve(out), JSON.stringify(stages, null, 2));
  console.log(`\nJSON salvo em ${out}`);
}

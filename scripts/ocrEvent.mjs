// OCR de PDF do EventLink: rasteriza pagina 1 e roda Tesseract.
// Uso: node scripts/ocrEvent.mjs <pdf>

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pdf } from 'pdf-to-img';
import { createWorker } from 'tesseract.js';

const pdfPath = resolve(process.argv[2]);
console.log('Rasterizando PDF...');
const doc = await pdf(pdfPath, { scale: 2 });
const pageBuffer = await doc.getPage(1);
const pngPath = resolve('refs/_modelo_evento_p1.png');
await writeFile(pngPath, pageBuffer);
console.log('PNG salvo em', pngPath);

console.log('Inicializando Tesseract (pt)...');
const worker = await createWorker('por');
console.log('Rodando OCR...');
const { data } = await worker.recognize(pageBuffer);
await worker.terminate();

console.log('--- TEXTO BRUTO ---');
console.log(data.text);
console.log('--- FIM ---');

// Parser
const lines = data.text.split(/\r?\n/).map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);

const header = {};
const results = [];
for (const line of lines) {
  const mEvento = line.match(/^Evento:\s*(.+?)\s*\((\d+)\)/i);
  if (mEvento) {
    header.eventName = mEvento[1].trim();
    header.eventLinkId = mEvento[2];
    continue;
  }
  const mData = line.match(/Data do evento:\s*(\d{2}\/\d{2}\/\d{4})/i);
  if (mData) header.eventDate = mData[1];

  const mRow = line.match(/^(\d+)\s+(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*$/);
  if (mRow) {
    results.push({
      position: Number(mRow[1]),
      name: mRow[2].trim(),
      points: Number(mRow[3]),
      vpg: Number(mRow[4]),
      vj: Number(mRow[5]),
      vjg: Number(mRow[6]),
    });
  }
}

console.log('\n--- HEADER ---');
console.log(header);
console.log('\n--- RANKING ---');
for (const r of results) {
  console.log(`${String(r.position).padStart(2)}  ${r.name.padEnd(28)} ${String(r.points).padStart(3)} pts`);
}
console.log(`\n${results.length} jogadores extraidos.`);

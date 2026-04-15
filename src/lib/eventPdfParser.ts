import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { createWorker, type LoggerMessage } from 'tesseract.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface ExtractedResult {
  position: number;
  name: string;
  points: number;
}

export interface ExtractedEvent {
  eventName?: string;
  eventLinkId?: string;
  eventDate?: string;
  rounds?: number;
  results: ExtractedResult[];
  rawText: string;
}

export type ProgressFn = (phase: 'rasterizing' | 'ocr' | 'parsing', progress: number) => void;

async function rasterizePdf(file: File, scale = 2): Promise<Blob> {
  const buf = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buf }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D nao suportado neste navegador.');

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao gerar PNG.'))), 'image/png');
  });
}

function parseOcrText(text: string): Omit<ExtractedEvent, 'rawText'> {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  let eventName: string | undefined;
  let eventLinkId: string | undefined;
  let eventDate: string | undefined;
  let rounds: number | undefined;
  const results: ExtractedResult[] = [];

  for (const line of lines) {
    const mEvento = line.match(/^Evento:\s*(.+?)\s*\((\d+)\)/i);
    if (mEvento) {
      eventName = mEvento[1].trim();
      eventLinkId = mEvento[2];
      continue;
    }
    const mData = line.match(/Data do evento:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
    if (mData) {
      eventDate = `${mData[3]}-${mData[2]}-${mData[1]}`;
      continue;
    }
    const mRodada = line.match(/Rodada\s+(\d+)/i);
    if (mRodada && !rounds) rounds = Number(mRodada[1]);

    // Ancora nos 4 numeros finais (pontos, %VPG, %VJ, %VJG) mas guarda so pontos.
    const mRow = line.match(/^(\d+)\s+(.+?)\s+(\d+)\s+\d+\s+\d+\s+\d+\s*$/);
    if (mRow) {
      results.push({
        position: Number(mRow[1]),
        name: mRow[2].trim(),
        points: Number(mRow[3]),
      });
    }
  }

  results.sort((a, b) => a.position - b.position);
  return { eventName, eventLinkId, eventDate, rounds, results };
}

export async function extractEventFromPdf(file: File, onProgress?: ProgressFn): Promise<ExtractedEvent> {
  onProgress?.('rasterizing', 0);
  const png = await rasterizePdf(file);
  onProgress?.('rasterizing', 1);

  onProgress?.('ocr', 0);
  const worker = await createWorker('por', 1, {
    logger: (m: LoggerMessage) => {
      if (m.status === 'recognizing text') onProgress?.('ocr', m.progress);
    },
  });

  try {
    const { data } = await worker.recognize(png);
    onProgress?.('ocr', 1);

    onProgress?.('parsing', 0);
    const parsed = parseOcrText(data.text);
    onProgress?.('parsing', 1);

    return { ...parsed, rawText: data.text };
  } finally {
    await worker.terminate();
  }
}

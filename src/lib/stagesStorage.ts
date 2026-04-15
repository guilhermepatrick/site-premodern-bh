export interface StageResult {
  position: number;
  name: string;
  points: number;
  vpg?: number;
  vj?: number;
  vjg?: number;
}

export interface Stage {
  id: string;
  name: string;
  eventLinkId?: string;
  eventDate: string;
  rounds?: number;
  importedAt: string;
  results: StageResult[];
}

const KEY = 'premodern-stages-v1';

export function loadStages(): Stage[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Stage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStage(stage: Stage): void {
  const all = loadStages();
  all.push(stage);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteStage(id: string): void {
  const all = loadStages().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function findStageByEventLinkId(eventLinkId: string): Stage | undefined {
  return loadStages().find((s) => s.eventLinkId === eventLinkId);
}

function normalizeName(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

export function knownPlayerNames(): Set<string> {
  const set = new Set<string>();
  for (const stage of loadStages()) {
    for (const r of stage.results) set.add(normalizeName(r.name));
  }
  return set;
}

export function isNewPlayer(name: string, known: Set<string>): boolean {
  return !known.has(normalizeName(name));
}

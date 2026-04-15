import { supabase } from './supabase';

export interface StageResult {
  position: number;
  name: string;
  points: number;
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

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getActiveSeasonId(): Promise<string> {
  const { data, error } = await supabase
    .from('seasons')
    .select('id')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Nenhuma temporada ativa encontrada.');
  return data.id;
}

export async function loadStages(): Promise<Stage[]> {
  const { data: stages, error } = await supabase
    .from('stages')
    .select('id, name, eventlink_id, event_date, rounds, imported_at')
    .order('event_date', { ascending: false });
  if (error) throw error;
  if (!stages || stages.length === 0) return [];

  const ids = stages.map((s) => s.id);
  const { data: results, error: rErr } = await supabase
    .from('stage_results')
    .select('stage_id, position, points, players(name)')
    .in('stage_id', ids);
  if (rErr) throw rErr;

  const byStage = new Map<string, StageResult[]>();
  for (const r of results ?? []) {
    const rows = byStage.get(r.stage_id) ?? [];
    const player = r.players as { name: string } | null;
    rows.push({
      position: r.position,
      name: player?.name ?? '',
      points: r.points,
    });
    byStage.set(r.stage_id, rows);
  }

  return stages.map((s) => ({
    id: s.id,
    name: s.name,
    eventLinkId: s.eventlink_id ?? undefined,
    eventDate: s.event_date,
    rounds: s.rounds ?? undefined,
    importedAt: s.imported_at,
    results: (byStage.get(s.id) ?? []).sort((a, b) => a.position - b.position),
  }));
}

export interface StageDraft {
  name: string;
  eventLinkId?: string;
  eventDate: string;
  rounds?: number;
  results: StageResult[];
}

export async function loadStageForEdit(id: string): Promise<Stage> {
  const { data: stage, error } = await supabase
    .from('stages')
    .select('id, name, eventlink_id, event_date, rounds, imported_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!stage) throw new Error('Etapa nao encontrada.');

  const { data: results, error: rErr } = await supabase
    .from('stage_results')
    .select('position, points, players(name)')
    .eq('stage_id', id)
    .order('position');
  if (rErr) throw rErr;

  return {
    id: stage.id,
    name: stage.name,
    eventLinkId: stage.eventlink_id ?? undefined,
    eventDate: stage.event_date,
    rounds: stage.rounds ?? undefined,
    importedAt: stage.imported_at,
    results: (results ?? []).map((r) => {
      const player = r.players as { name: string } | null;
      return {
        position: r.position,
        name: player?.name ?? '',
        points: r.points,
      };
    }),
  };
}

export async function updateStage(id: string, draft: StageDraft): Promise<void> {
  const results = draft.results.map((r) => ({
    position: r.position,
    points: r.points,
    name: r.name.trim(),
    normalized_name: normalizeName(r.name),
  }));

  const { error } = await supabase.rpc('update_stage', {
    p_stage_id: id,
    p_name: draft.name,
    p_eventlink_id: draft.eventLinkId ?? '',
    p_event_date: draft.eventDate,
    p_rounds: draft.rounds ?? null,
    p_results: results,
  });
  if (error) throw error;
}

export async function saveStage(draft: StageDraft): Promise<string> {
  const seasonId = await getActiveSeasonId();
  const results = draft.results.map((r) => ({
    position: r.position,
    points: r.points,
    name: r.name.trim(),
    normalized_name: normalizeName(r.name),
  }));

  const { data, error } = await supabase.rpc('import_stage', {
    p_season_id: seasonId,
    p_name: draft.name,
    p_eventlink_id: draft.eventLinkId ?? '',
    p_event_date: draft.eventDate,
    p_rounds: draft.rounds ?? null,
    p_results: results,
  });
  if (error) throw error;
  return data as string;
}

export async function deleteStage(id: string): Promise<void> {
  const { error } = await supabase.from('stages').delete().eq('id', id);
  if (error) throw error;
}

export async function findStageByEventLinkId(eventLinkId: string): Promise<Stage | null> {
  const { data, error } = await supabase
    .from('stages')
    .select('id, name, eventlink_id, event_date, rounds, imported_at')
    .eq('eventlink_id', eventLinkId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    eventLinkId: data.eventlink_id ?? undefined,
    eventDate: data.event_date,
    rounds: data.rounds ?? undefined,
    importedAt: data.imported_at,
    results: [],
  };
}

export async function knownPlayerNames(): Promise<Set<string>> {
  const { data, error } = await supabase.from('players').select('normalized_name');
  if (error) throw error;
  return new Set((data ?? []).map((p) => p.normalized_name));
}

export function isNewPlayer(name: string, known: Set<string>): boolean {
  return !known.has(normalizeName(name));
}

import { supabase } from './supabase';

export type EventType = 'semanal' | 'liga';

export interface StageResult {
  position: number;
  name: string;
  points: number;
}

export interface Stage {
  id: string;
  seasonId: string;
  seasonName?: string;
  format?: string | null;
  name: string;
  eventLinkId?: string;
  eventDate: string;
  rounds?: number;
  eventType: EventType;
  importedAt: string;
  results: StageResult[];
}

export interface StageDraft {
  seasonId: string;
  name: string;
  eventLinkId?: string;
  eventDate: string;
  rounds?: number;
  eventType: EventType;
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

export interface SeasonOption {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SeasonDraft {
  name: string;
  format: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export async function createSeason(draft: SeasonDraft): Promise<string> {
  const { data, error } = await supabase
    .from('seasons')
    .insert({
      name: draft.name,
      format: draft.format.toUpperCase(),
      start_date: draft.startDate || null,
      end_date: draft.endDate || null,
      is_active: draft.isActive,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export interface Season {
  id: string;
  name: string;
  format: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SeasonListItem extends Season {
  stagesCount: number;
}

export interface SeasonWithStages extends Season {
  stages: Stage[];
}

export interface ListSeasonsFilter {
  format?: string;
  isActive?: boolean;
}

export interface SeasonUpdate {
  name?: string;
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean;
}

interface SeasonRow {
  id: string;
  name: string;
  format: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

function seasonFromRow(r: SeasonRow): Season {
  return {
    id: r.id,
    name: r.name,
    format: r.format,
    startDate: r.start_date,
    endDate: r.end_date,
    isActive: r.is_active,
    createdAt: r.created_at,
  };
}

export async function listSeasons(filter: ListSeasonsFilter = {}): Promise<SeasonListItem[]> {
  let query = supabase
    .from('seasons')
    .select('id, name, format, start_date, end_date, is_active, created_at')
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: false });
  if (filter.format) query = query.eq('format', filter.format);
  if (filter.isActive !== undefined) query = query.eq('is_active', filter.isActive);
  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as SeasonRow[];

  const { data: stageRows, error: countErr } = await supabase.from('stages').select('season_id');
  if (countErr) throw countErr;

  const counts = new Map<string, number>();
  for (const row of stageRows ?? []) {
    counts.set(row.season_id, (counts.get(row.season_id) ?? 0) + 1);
  }

  return rows.map((r) => ({ ...seasonFromRow(r), stagesCount: counts.get(r.id) ?? 0 }));
}

export async function loadSeason(id: string): Promise<SeasonWithStages> {
  const { data, error } = await supabase
    .from('seasons')
    .select('id, name, format, start_date, end_date, is_active, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Temporada nao encontrada.');

  const { data: stageData, error: stagesErr } = await supabase
    .from('stages')
    .select('id, name, eventlink_id, event_date, rounds, event_type, imported_at, season_id, seasons(name, format)')
    .eq('season_id', id)
    .order('event_date', { ascending: false });
  if (stagesErr) throw stagesErr;

  const stages: Stage[] = ((stageData ?? []) as unknown as StageRow[]).map((r) => ({
    id: r.id,
    seasonId: r.season_id,
    seasonName: r.seasons?.name,
    format: r.seasons?.format ?? undefined,
    name: r.name,
    eventLinkId: r.eventlink_id ?? undefined,
    eventDate: r.event_date,
    rounds: r.rounds ?? undefined,
    eventType: r.event_type,
    importedAt: r.imported_at,
    results: [],
  }));

  return { ...seasonFromRow(data as SeasonRow), stages };
}

export async function updateSeason(id: string, patch: SeasonUpdate): Promise<void> {
  const update: {
    name?: string;
    start_date?: string | null;
    end_date?: string | null;
    is_active?: boolean;
  } = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.startDate !== undefined) update.start_date = patch.startDate || null;
  if (patch.endDate !== undefined) update.end_date = patch.endDate || null;
  if (patch.isActive !== undefined) update.is_active = patch.isActive;
  if (Object.keys(update).length === 0) return;
  const { error } = await supabase.from('seasons').update(update).eq('id', id);
  if (error) throw error;
}

export async function deleteSeason(id: string): Promise<void> {
  const { error } = await supabase.from('seasons').delete().eq('id', id);
  if (error) throw error;
}

export async function listSeasonsByFormat(format: string): Promise<SeasonOption[]> {
  const { data, error } = await supabase
    .from('seasons')
    .select('id, name, is_active, created_at')
    .eq('format', format)
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((s) => ({ id: s.id, name: s.name, isActive: s.is_active }));
}

export interface ListStagesFilter {
  format?: string;
  eventType?: EventType;
}

interface StageRow {
  id: string;
  name: string;
  eventlink_id: string | null;
  event_date: string;
  rounds: number | null;
  event_type: EventType;
  imported_at: string;
  season_id: string;
  seasons: { name: string; format: string | null } | null;
}

export async function listStages(filter: ListStagesFilter = {}): Promise<Stage[]> {
  let query = supabase
    .from('stages')
    .select('id, name, eventlink_id, event_date, rounds, event_type, imported_at, season_id, seasons(name, format)')
    .order('event_date', { ascending: false });

  if (filter.eventType) query = query.eq('event_type', filter.eventType);

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as unknown as StageRow[];
  const filtered = filter.format
    ? rows.filter((r) => r.seasons?.format === filter.format)
    : rows;

  return filtered.map((r) => ({
    id: r.id,
    seasonId: r.season_id,
    seasonName: r.seasons?.name,
    format: r.seasons?.format ?? undefined,
    name: r.name,
    eventLinkId: r.eventlink_id ?? undefined,
    eventDate: r.event_date,
    rounds: r.rounds ?? undefined,
    eventType: r.event_type,
    importedAt: r.imported_at,
    results: [],
  }));
}

export async function loadStageForEdit(id: string): Promise<Stage> {
  const { data: stage, error } = await supabase
    .from('stages')
    .select('id, name, eventlink_id, event_date, rounds, event_type, imported_at, season_id, seasons(name, format)')
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

  const s = stage as unknown as StageRow;

  return {
    id: s.id,
    seasonId: s.season_id,
    seasonName: s.seasons?.name,
    format: s.seasons?.format ?? undefined,
    name: s.name,
    eventLinkId: s.eventlink_id ?? undefined,
    eventDate: s.event_date,
    rounds: s.rounds ?? undefined,
    eventType: s.event_type,
    importedAt: s.imported_at,
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

function buildResultsPayload(results: StageResult[]) {
  return results.map((r) => ({
    position: r.position,
    points: r.points,
    name: r.name.trim(),
    normalized_name: normalizeName(r.name),
  }));
}

export async function saveStage(draft: StageDraft): Promise<string> {
  const { data, error } = await supabase.rpc('import_stage', {
    p_season_id: draft.seasonId,
    p_name: draft.name,
    p_eventlink_id: draft.eventLinkId ?? '',
    p_event_date: draft.eventDate,
    p_rounds: draft.rounds ?? null,
    p_results: buildResultsPayload(draft.results),
    p_event_type: draft.eventType,
  });
  if (error) throw error;
  return data as string;
}

export async function updateStage(id: string, draft: StageDraft): Promise<void> {
  const { error } = await supabase.rpc('update_stage', {
    p_stage_id: id,
    p_name: draft.name,
    p_eventlink_id: draft.eventLinkId ?? '',
    p_event_date: draft.eventDate,
    p_rounds: draft.rounds ?? null,
    p_results: buildResultsPayload(draft.results),
    p_event_type: draft.eventType,
  });
  if (error) throw error;
}

export async function deleteStage(id: string): Promise<void> {
  const { error } = await supabase.from('stages').delete().eq('id', id);
  if (error) throw error;
}

export async function findStageByEventLinkId(eventLinkId: string): Promise<Stage | null> {
  const { data, error } = await supabase
    .from('stages')
    .select('id, name, eventlink_id, event_date, rounds, event_type, imported_at, season_id, seasons(name, format)')
    .eq('eventlink_id', eventLinkId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const s = data as unknown as StageRow;
  return {
    id: s.id,
    seasonId: s.season_id,
    seasonName: s.seasons?.name,
    format: s.seasons?.format ?? undefined,
    name: s.name,
    eventLinkId: s.eventlink_id ?? undefined,
    eventDate: s.event_date,
    rounds: s.rounds ?? undefined,
    eventType: s.event_type,
    importedAt: s.imported_at,
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

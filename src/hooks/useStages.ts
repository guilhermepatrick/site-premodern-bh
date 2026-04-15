import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface StageSummary {
  id: string;
  name: string;
  eventDate: string;
  rounds: number | null;
  participantsCount: number;
  topThree: { position: number; name: string; points: number }[];
}

export interface StageDetail {
  id: string;
  name: string;
  eventDate: string;
  rounds: number | null;
  results: { position: number; name: string; points: number; playerId: string }[];
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useStagesList(): AsyncState<StageSummary[]> {
  const [state, setState] = useState<AsyncState<StageSummary[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: season, error: sErr } = await supabase
          .from('seasons')
          .select('id')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (sErr) throw sErr;
        if (!season) throw new Error('Nenhuma temporada ativa.');

        const { data: stages, error: stErr } = await supabase
          .from('stages')
          .select('id, name, event_date, rounds')
          .eq('season_id', season.id)
          .order('event_date', { ascending: true });
        if (stErr) throw stErr;
        if (!stages || stages.length === 0) {
          if (!cancelled) setState({ data: [], loading: false, error: null });
          return;
        }

        const stageIds = stages.map((s) => s.id);
        const [{ data: results, error: rErr }, { data: counts, error: cErr }] = await Promise.all([
          supabase
            .from('stage_results')
            .select('stage_id, position, points, players(name)')
            .in('stage_id', stageIds)
            .lte('position', 3),
          supabase.from('stage_results').select('stage_id').in('stage_id', stageIds),
        ]);
        if (rErr) throw rErr;
        if (cErr) throw cErr;

        const topByStage = new Map<string, StageSummary['topThree']>();
        for (const r of results ?? []) {
          const player = r.players as { name: string } | null;
          const arr = topByStage.get(r.stage_id) ?? [];
          arr.push({ position: r.position, name: player?.name ?? '', points: r.points });
          topByStage.set(r.stage_id, arr);
        }

        const countByStage = new Map<string, number>();
        for (const c of counts ?? []) {
          countByStage.set(c.stage_id, (countByStage.get(c.stage_id) ?? 0) + 1);
        }

        const summaries: StageSummary[] = stages.map((s) => ({
          id: s.id,
          name: s.name,
          eventDate: s.event_date,
          rounds: s.rounds,
          participantsCount: countByStage.get(s.id) ?? 0,
          topThree: (topByStage.get(s.id) ?? []).sort((a, b) => a.position - b.position),
        }));

        if (!cancelled) setState({ data: summaries, loading: false, error: null });
      } catch (e) {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : 'Falha ao carregar etapas.',
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function useStageDetail(id: string | undefined): AsyncState<StageDetail> {
  const [state, setState] = useState<AsyncState<StageDetail>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ data: null, loading: false, error: 'Etapa nao informada.' });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data: stage, error: sErr } = await supabase
          .from('stages')
          .select('id, name, event_date, rounds')
          .eq('id', id)
          .maybeSingle();
        if (sErr) throw sErr;
        if (!stage) throw new Error('Etapa nao encontrada.');

        const { data: results, error: rErr } = await supabase
          .from('stage_results')
          .select('position, points, player_id, players(name)')
          .eq('stage_id', id)
          .order('position', { ascending: true });
        if (rErr) throw rErr;

        const detail: StageDetail = {
          id: stage.id,
          name: stage.name,
          eventDate: stage.event_date,
          rounds: stage.rounds,
          results: (results ?? []).map((r) => {
            const player = r.players as { name: string } | null;
            return {
              position: r.position,
              points: r.points,
              playerId: r.player_id,
              name: player?.name ?? '',
            };
          }),
        };

        if (!cancelled) setState({ data: detail, loading: false, error: null });
      } catch (e) {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : 'Falha ao carregar etapa.',
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

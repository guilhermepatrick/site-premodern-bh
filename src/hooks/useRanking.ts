import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { RankingPayload } from '../types/domain';

interface UseRankingState {
  data: RankingPayload | null;
  loading: boolean;
  error: string | null;
}

export function useRanking(): UseRankingState {
  const [state, setState] = useState<UseRankingState>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: season, error: sErr } = await supabase
          .from('seasons')
          .select('id, name, start_date, end_date, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (sErr) throw sErr;
        if (!season) throw new Error('Nenhuma temporada ativa.');

        const { data: ranking, error: rErr } = await supabase
          .from('season_ranking')
          .select('player_id, player_name, total_points, stages_played')
          .eq('season_id', season.id)
          .order('total_points', { ascending: false });
        if (rErr) throw rErr;

        const { data: latest } = await supabase
          .from('stages')
          .select('imported_at')
          .eq('season_id', season.id)
          .order('imported_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const payload: RankingPayload = {
          season: {
            id: season.id,
            name: season.name,
            startDate: season.start_date ?? '',
            endDate: season.end_date ?? '',
            isCurrent: season.is_active,
          },
          updatedAt: latest?.imported_at ?? new Date().toISOString(),
          entries: (ranking ?? []).map((r, i) => {
            const max = r.stages_played * 12;
            const winRate = max > 0 ? Math.round((r.total_points / max) * 1000) / 10 : 0;
            return {
              position: i + 1,
              player: { id: r.player_id, name: r.player_name },
              points: r.total_points,
              eventsPlayed: r.stages_played,
              winRate,
            };
          }),
        };

        if (!cancelled) setState({ data: payload, loading: false, error: null });
      } catch (e) {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : 'Falha ao carregar ranking.',
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

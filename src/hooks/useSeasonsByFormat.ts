import { useEffect, useState } from 'react';
import { listSeasonsByFormat, type SeasonOption } from '../lib/stagesStorage';

interface State {
  seasons: SeasonOption[];
  loading: boolean;
  error: string | null;
}

export function useSeasonsByFormat(format: string | null): State {
  const [state, setState] = useState<State>({ seasons: [], loading: false, error: null });

  useEffect(() => {
    if (!format) {
      setState({ seasons: [], loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ seasons: [], loading: true, error: null });
    listSeasonsByFormat(format)
      .then((seasons) => {
        if (!cancelled) setState({ seasons, loading: false, error: null });
      })
      .catch((e) => {
        if (!cancelled)
          setState({
            seasons: [],
            loading: false,
            error: e instanceof Error ? e.message : 'Erro ao carregar temporadas.',
          });
      });
    return () => {
      cancelled = true;
    };
  }, [format]);

  return state;
}

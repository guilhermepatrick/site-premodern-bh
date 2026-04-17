import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useSeasonsByFormat } from '../../hooks/useSeasonsByFormat';

const FORMAT = 'PREMODERN';

interface Props {
  seasonId: string | null;
  onSeasonChange: (seasonId: string) => void;
  disabled?: boolean;
}

export default function FormatSeasonPicker({ seasonId, onSeasonChange, disabled }: Props) {
  const { seasons, loading: seasonsLoading, error } = useSeasonsByFormat(FORMAT);

  return (
    <div className={`flex flex-col gap-2 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <label
        htmlFor="season-select"
        className="font-title text-xs tracking-[0.25em] uppercase text-vc-muted block"
      >
        Temporada <span className="text-vc-blue-hi ml-1">({FORMAT})</span>
      </label>
      {seasonsLoading ? (
        <div className="h-10 rounded bg-vc-bg-3 animate-pulse" aria-label="Carregando temporadas" />
      ) : error ? (
        <p className="text-red-400 text-sm" role="alert">
          {error}
        </p>
      ) : seasons.length === 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-vc-muted text-sm italic">
            Nenhuma temporada cadastrada para {FORMAT}.
          </p>
          <Link
            to="/admin/temporadas/nova"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-vc-blue hover:bg-vc-blue-hi text-vc-white font-title uppercase tracking-widest text-xs self-start"
          >
            <Plus size={14} /> Criar temporada
          </Link>
        </div>
      ) : (
        <select
          id="season-select"
          value={seasonId ?? ''}
          onChange={(e) => onSeasonChange(e.target.value)}
          className="w-full bg-vc-bg-2 border border-vc-border-2 rounded px-3 py-2 text-vc-white focus:border-vc-blue focus:outline-none focus:ring-1 focus:ring-vc-blue"
        >
          <option value="" disabled>
            Selecione a temporada
          </option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.isActive ? '· ativa' : ''}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

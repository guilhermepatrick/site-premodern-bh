import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, Pencil, Loader2, Power } from 'lucide-react';
import Section from '../../components/admin/Section';
import { listSeasons, updateSeason, type SeasonListItem } from '../../lib/stagesStorage';

type StatusFilter = 'all' | 'active' | 'inactive';

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Ativas' },
  { value: 'inactive', label: 'Inativas' },
];

function formatRange(start: string | null, end: string | null): string {
  if (!start && !end) return 'Sem periodo definido';
  if (start && end) return `${start} → ${end}`;
  if (start) return `A partir de ${start}`;
  return `Ate ${end}`;
}

export default function SeasonsListPage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [seasons, setSeasons] = useState<SeasonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listSeasons({
      format: 'PREMODERN',
      isActive: status === 'all' ? undefined : status === 'active',
    })
      .then((data) => {
        if (!cancelled) setSeasons(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Falha ao carregar temporadas.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, reloadKey]);

  const toggleActive = useCallback(async (season: SeasonListItem) => {
    setTogglingId(season.id);
    setError(null);
    try {
      await updateSeason(season.id, { isActive: !season.isActive });
      setSeasons((prev) =>
        prev.map((s) => (s.id === season.id ? { ...s, isActive: !s.isActive } : s)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao atualizar status.');
    } finally {
      setTogglingId(null);
    }
  }, []);

  return (
    <Section eyebrow="Admin" title="Temporadas cadastradas">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <p className="font-title text-xs tracking-[0.25em] uppercase text-vc-muted mb-2">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setStatus(t.value)}
                aria-pressed={status === t.value}
                className={`px-4 py-1.5 rounded-full text-sm font-title font-600 uppercase tracking-widest border transition-all ${
                  status === t.value
                    ? 'bg-vc-cyan border-vc-cyan text-vc-bg shadow-vc-cyan'
                    : 'bg-transparent border-vc-border-2 text-vc-muted hover:border-vc-cyan hover:text-vc-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Link
          to="/admin/temporadas/nova"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-vc-blue hover:bg-vc-blue-hi text-vc-white font-title font-600 uppercase tracking-widest text-sm shadow-vc-blue transition-colors self-start"
        >
          <Plus size={16} /> Nova temporada
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-vc-muted">
          <Loader2 size={16} className="animate-spin" /> Carregando temporadas...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-3"
        >
          <AlertTriangle size={16} className="mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-2 text-xs underline hover:text-red-300"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      ) : seasons.length === 0 ? (
        <div className="border border-dashed border-vc-border-2 rounded-lg p-8 text-center">
          <p className="text-vc-muted text-sm">Nenhuma temporada encontrada para esse filtro.</p>
          <Link
            to="/admin/temporadas/nova"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded bg-vc-blue hover:bg-vc-blue-hi text-vc-white font-title font-600 uppercase tracking-widest text-xs"
          >
            <Plus size={14} /> Nova temporada
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-vc-border border border-vc-border rounded-lg overflow-hidden">
          {seasons.map((s) => {
            const isToggling = togglingId === s.id;
            return (
              <li key={s.id} className="bg-vc-bg-2 hover:bg-vc-bg-3 transition-colors">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <Link to={`/admin/temporadas/${s.id}`} className="min-w-0 flex-1">
                    <p className="font-title text-vc-white font-600 truncate">{s.name}</p>
                    <p className="text-xs text-vc-muted mt-0.5 flex flex-wrap gap-x-3">
                      <span>{formatRange(s.startDate, s.endDate)}</span>
                      <span>· {s.stagesCount} {s.stagesCount === 1 ? 'etapa' : 'etapas'}</span>
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleActive(s)}
                      disabled={isToggling}
                      aria-pressed={s.isActive}
                      aria-label={s.isActive ? 'Desativar temporada' : 'Ativar temporada'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest border transition-colors disabled:opacity-60 ${
                        s.isActive
                          ? 'bg-vc-cyan/10 text-vc-cyan border-vc-cyan/40 hover:bg-vc-cyan/20'
                          : 'bg-vc-border/20 text-vc-muted border-vc-border-2 hover:text-vc-white'
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Power size={10} />
                      )}
                      {s.isActive ? 'ativa' : 'inativa'}
                    </button>
                    <Link
                      to={`/admin/temporadas/${s.id}`}
                      className="text-vc-muted hover:text-vc-white"
                      aria-label={`Editar ${s.name}`}
                    >
                      <Pencil size={14} />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}

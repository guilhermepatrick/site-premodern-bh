import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, Pencil, Loader2 } from 'lucide-react';
import Section from '../../components/admin/Section';
import { listStages, type Stage, type EventType } from '../../lib/stagesStorage';

const TYPE_FILTERS: Array<{ value: EventType | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'liga', label: 'Liga' },
];

export default function StagesListPage() {
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listStages({
      format: 'PREMODERN',
      eventType: typeFilter === 'all' ? undefined : typeFilter,
    })
      .then((data) => {
        if (!cancelled) setStages(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Falha ao carregar etapas.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [typeFilter, reloadKey]);

  return (
    <Section eyebrow="Admin" title="Etapas cadastradas">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <p className="font-title text-xs tracking-[0.25em] uppercase text-vc-muted mb-2">
            Tipo
          </p>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTypeFilter(t.value)}
                aria-pressed={typeFilter === t.value}
                className={`px-4 py-1.5 rounded-full text-sm font-title font-600 uppercase tracking-widest border transition-all ${
                  typeFilter === t.value
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
          to="/admin/etapas/nova"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-vc-blue hover:bg-vc-blue-hi text-vc-white font-title font-600 uppercase tracking-widest text-sm shadow-vc-blue transition-colors self-start"
        >
          <Plus size={16} /> Nova etapa
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-vc-muted">
          <Loader2 size={16} className="animate-spin" /> Carregando etapas...
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
      ) : stages.length === 0 ? (
        <div className="border border-dashed border-vc-border-2 rounded-lg p-8 text-center">
          <p className="text-vc-muted text-sm">Nenhuma etapa encontrada para esse filtro.</p>
          <Link
            to="/admin/etapas/nova"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded bg-vc-blue hover:bg-vc-blue-hi text-vc-white font-title font-600 uppercase tracking-widest text-xs"
          >
            <Plus size={14} /> Nova etapa
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-vc-border border border-vc-border rounded-lg overflow-hidden">
          {stages.map((s) => (
            <li key={s.id} className="bg-vc-bg-2 hover:bg-vc-bg-3 transition-colors">
              <Link
                to={`/admin/etapas/${s.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-title text-vc-white font-600 truncate">{s.name}</p>
                  <p className="text-xs text-vc-muted mt-0.5 flex flex-wrap gap-x-3">
                    <span>{s.eventDate}</span>
                    {s.seasonName && <span>· {s.seasonName}</span>}
                    {typeof s.rounds === 'number' && <span>· {s.rounds} rodadas</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest border ${
                      s.eventType === 'liga'
                        ? 'bg-vc-blue/10 text-vc-blue-hi border-vc-blue/40'
                        : 'bg-vc-cyan/10 text-vc-cyan border-vc-cyan/40'
                    }`}
                  >
                    {s.eventType}
                  </span>
                  <Pencil size={14} className="text-vc-muted" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

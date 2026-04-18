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
          <p className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 mb-2">
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
                    ? 'bg-pm-gold border-pm-gold text-pm-ink'
                    : 'bg-transparent border-pm-frame text-pm-parchment-2 hover:border-pm-gold hover:text-pm-cream'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Link
          to="/admin/etapas/nova"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-pm-green hover:bg-pm-green-hi text-pm-cream font-title font-600 uppercase tracking-widest text-sm transition-colors self-start"
        >
          <Plus size={16} /> Nova etapa
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-pm-parchment-2 font-body italic">
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
        <div className="border border-dashed border-pm-frame rounded-sm p-8 text-center">
          <p className="text-pm-parchment-2 text-sm font-body italic">Nenhuma etapa encontrada para esse filtro.</p>
          <Link
            to="/admin/etapas/nova"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded bg-pm-green hover:bg-pm-green-hi text-pm-cream font-title font-600 uppercase tracking-widest text-xs"
          >
            <Plus size={14} /> Nova etapa
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-pm-frame border border-pm-frame rounded-sm overflow-hidden shadow-card-lift">
          {stages.map((s) => (
            <li key={s.id} className="bg-pm-bg-2 hover:bg-pm-frame transition-colors">
              <Link
                to={`/admin/etapas/${s.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-title text-pm-cream font-600 truncate">{s.name}</p>
                  <p className="text-xs text-pm-parchment-2 mt-0.5 flex flex-wrap gap-x-3 font-body">
                    <span>{s.eventDate}</span>
                    {s.seasonName && <span>· {s.seasonName}</span>}
                    {typeof s.rounds === 'number' && <span>· {s.rounds} rodadas</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest border font-title ${
                      s.eventType === 'liga'
                        ? 'bg-pm-green/15 text-pm-green-hi border-pm-green/40'
                        : 'bg-pm-gold/10 text-pm-gold border-pm-gold/40'
                    }`}
                  >
                    {s.eventType}
                  </span>
                  <Pencil size={14} className="text-pm-parchment-2" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

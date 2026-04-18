import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Loader2, Save, Trash2, ChevronRight } from 'lucide-react';
import Section from '../../components/admin/Section';
import {
  deleteSeason,
  loadSeason,
  updateSeason,
  type SeasonWithStages,
} from '../../lib/stagesStorage';

export default function EditSeasonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [season, setSeason] = useState<SeasonWithStages | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [draftName, setDraftName] = useState('');
  const [draftStart, setDraftStart] = useState('');
  const [draftEnd, setDraftEnd] = useState('');
  const [draftActive, setDraftActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    loadSeason(id)
      .then((s) => {
        if (cancelled) return;
        setSeason(s);
        setDraftName(s.name);
        setDraftStart(s.startDate ?? '');
        setDraftEnd(s.endDate ?? '');
        setDraftActive(s.isActive);
      })
      .catch((e) => {
        if (!cancelled) {
          if (e instanceof Error && e.message.includes('nao encontrada')) setNotFound(true);
          else setError(e instanceof Error ? e.message : 'Falha ao carregar temporada.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const canSave = !!season && !saving && !deleting && draftName.trim().length > 0;
  const canDelete = !!season && season.stages.length === 0 && !saving && !deleting;

  async function handleSave() {
    if (!season) return;
    setSaving(true);
    setError(null);
    try {
      await updateSeason(season.id, {
        name: draftName.trim(),
        startDate: draftStart || null,
        endDate: draftEnd || null,
        isActive: draftActive,
      });
      navigate('/admin/temporadas', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar temporada.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!season || season.stages.length > 0) return;
    if (!window.confirm(`Excluir temporada "${season.name}"? Esta acao nao pode ser desfeita.`)) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await deleteSeason(season.id);
      navigate('/admin/temporadas', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao excluir temporada.');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Section eyebrow="Admin" title="Editar temporada">
        <div className="flex items-center gap-2 text-pm-parchment-2 font-body italic">
          <Loader2 size={16} className="animate-spin" /> Carregando...
        </div>
      </Section>
    );
  }

  if (notFound) {
    return (
      <Section eyebrow="Admin" title="Temporada nao encontrada">
        <div className="space-y-3 text-center">
          <p className="text-pm-parchment-2 font-body italic">A temporada solicitada nao existe ou foi removida.</p>
          <Link
            to="/admin/temporadas"
            className="inline-flex px-4 py-2 rounded bg-pm-green hover:bg-pm-green-hi text-pm-cream font-title uppercase tracking-widest text-xs"
          >
            Voltar para lista
          </Link>
        </div>
      </Section>
    );
  }

  if (!season) return null;

  return (
    <Section eyebrow="Admin" title={`Editar: ${season.name}`}>
      <div className="space-y-6">
        <p className="text-xs text-pm-parchment-2 uppercase tracking-widest font-title text-center">
          Formato: <span className="text-pm-gold">{season.format ?? '—'}</span>{' '}
          <span className="ml-2 text-pm-parchment-2/60">(read-only)</span>
        </p>

        <div className="bg-pm-bg-2 border border-pm-frame rounded-sm p-5 shadow-card-lift space-y-4">
          <label className="block">
            <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
              Nome
            </span>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold focus:ring-1 focus:ring-pm-gold"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
                Inicio (opcional)
              </span>
              <input
                type="date"
                value={draftStart}
                onChange={(e) => setDraftStart(e.target.value)}
                className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
              />
            </label>
            <label className="block">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
                Fim (opcional)
              </span>
              <input
                type="date"
                value={draftEnd}
                onChange={(e) => setDraftEnd(e.target.value)}
                className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-pm-cream cursor-pointer">
            <input
              type="checkbox"
              checked={draftActive}
              onChange={(e) => setDraftActive(e.target.checked)}
              className="w-4 h-4 accent-pm-green"
            />
            <span className="font-title uppercase tracking-widest text-xs">Temporada ativa</span>
          </label>
        </div>

        <div className="bg-pm-bg-2 border border-pm-frame rounded-sm p-5 shadow-card-lift space-y-3">
          <h3 className="font-title uppercase tracking-widest text-sm text-pm-gold">
            Etapas vinculadas{' '}
            <span className="text-pm-cream">({season.stages.length})</span>
          </h3>
          {season.stages.length === 0 ? (
            <p className="text-pm-parchment-2 text-sm italic font-body">
              Nenhuma etapa vinculada. Esta temporada pode ser excluida.
            </p>
          ) : (
            <ul className="divide-y divide-pm-frame border border-pm-frame rounded-sm overflow-hidden">
              {season.stages.map((st) => (
                <li key={st.id} className="bg-pm-frame hover:bg-pm-bg-2 transition-colors">
                  <Link
                    to={`/admin/etapas/${st.id}`}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-pm-cream truncate font-title">{st.name}</p>
                      <p className="text-[11px] text-pm-parchment-2 mt-0.5 flex flex-wrap gap-x-3 font-body">
                        <span>{st.eventDate}</span>
                        <span
                          className={
                            st.eventType === 'liga' ? 'text-pm-green-hi' : 'text-pm-gold'
                          }
                        >
                          {st.eventType}
                        </span>
                        {typeof st.rounds === 'number' && <span>· {st.rounds} rodadas</span>}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-pm-parchment-2" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2"
          >
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{error}</span>
          </p>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-2 flex-1 min-w-[200px]">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete}
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed font-title uppercase tracking-widest text-xs"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Excluir temporada
            </button>
            {!canDelete && season.stages.length > 0 && (
              <p className="text-[11px] text-pm-parchment-2 max-w-xs leading-relaxed font-body italic">
                Remova as {season.stages.length}{' '}
                {season.stages.length === 1 ? 'etapa vinculada' : 'etapas vinculadas'} ou desative a
                temporada.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/temporadas"
              className="px-4 py-2 rounded border border-pm-frame text-pm-parchment-2 hover:text-pm-cream hover:border-pm-gold font-title uppercase tracking-widest text-xs"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-pm-green hover:bg-pm-green-hi disabled:bg-pm-green-deep disabled:cursor-not-allowed text-pm-cream font-title font-600 uppercase tracking-widest text-sm transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

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
        <div className="flex items-center gap-2 text-vc-muted">
          <Loader2 size={16} className="animate-spin" /> Carregando...
        </div>
      </Section>
    );
  }

  if (notFound) {
    return (
      <Section eyebrow="Admin" title="Temporada nao encontrada">
        <div className="space-y-3">
          <p className="text-vc-muted">A temporada solicitada nao existe ou foi removida.</p>
          <Link
            to="/admin/temporadas"
            className="inline-flex px-4 py-2 rounded bg-vc-blue hover:bg-vc-blue-hi text-vc-white font-title uppercase tracking-widest text-xs"
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
        <p className="text-xs text-vc-muted uppercase tracking-widest font-title">
          Formato: <span className="text-vc-blue-hi">{season.format ?? '—'}</span>{' '}
          <span className="ml-2 text-vc-muted/70">(read-only)</span>
        </p>

        <div className="bg-vc-bg-2 border border-vc-border rounded-lg p-5 shadow-vc-card space-y-4">
          <label className="block">
            <span className="font-title text-xs tracking-[0.25em] uppercase text-vc-muted block mb-1">
              Nome
            </span>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="w-full bg-vc-bg-3 border border-vc-border-2 rounded px-3 py-2 text-vc-white focus:outline-none focus:border-vc-blue"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-vc-muted block mb-1">
                Inicio (opcional)
              </span>
              <input
                type="date"
                value={draftStart}
                onChange={(e) => setDraftStart(e.target.value)}
                className="w-full bg-vc-bg-3 border border-vc-border-2 rounded px-3 py-2 text-vc-white focus:outline-none focus:border-vc-blue"
              />
            </label>
            <label className="block">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-vc-muted block mb-1">
                Fim (opcional)
              </span>
              <input
                type="date"
                value={draftEnd}
                onChange={(e) => setDraftEnd(e.target.value)}
                className="w-full bg-vc-bg-3 border border-vc-border-2 rounded px-3 py-2 text-vc-white focus:outline-none focus:border-vc-blue"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-vc-white cursor-pointer">
            <input
              type="checkbox"
              checked={draftActive}
              onChange={(e) => setDraftActive(e.target.checked)}
              className="w-4 h-4 accent-vc-blue"
            />
            <span className="font-title uppercase tracking-widest text-xs">Temporada ativa</span>
          </label>
        </div>

        <div className="bg-vc-bg-2 border border-vc-border rounded-lg p-5 shadow-vc-card space-y-3">
          <h3 className="font-title uppercase tracking-widest text-sm text-vc-muted">
            Etapas vinculadas{' '}
            <span className="text-vc-blue-hi">({season.stages.length})</span>
          </h3>
          {season.stages.length === 0 ? (
            <p className="text-vc-muted text-sm italic">
              Nenhuma etapa vinculada. Esta temporada pode ser excluida.
            </p>
          ) : (
            <ul className="divide-y divide-vc-border-2 border border-vc-border-2 rounded overflow-hidden">
              {season.stages.map((st) => (
                <li key={st.id} className="bg-vc-bg-3 hover:bg-vc-bg-2 transition-colors">
                  <Link
                    to={`/admin/etapas/${st.id}`}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-vc-white truncate">{st.name}</p>
                      <p className="text-[11px] text-vc-muted mt-0.5 flex flex-wrap gap-x-3">
                        <span>{st.eventDate}</span>
                        <span
                          className={
                            st.eventType === 'liga' ? 'text-vc-blue-hi' : 'text-vc-cyan'
                          }
                        >
                          {st.eventType}
                        </span>
                        {typeof st.rounds === 'number' && <span>· {st.rounds} rodadas</span>}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-vc-muted" />
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
              <p className="text-[11px] text-vc-muted max-w-xs leading-relaxed">
                Remova as {season.stages.length}{' '}
                {season.stages.length === 1 ? 'etapa vinculada' : 'etapas vinculadas'} ou desative a
                temporada.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/temporadas"
              className="px-4 py-2 rounded border border-vc-border-2 text-vc-muted hover:text-vc-white hover:border-vc-blue font-title uppercase tracking-widest text-xs"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-vc-blue hover:bg-vc-blue-hi disabled:bg-vc-blue-dim disabled:cursor-not-allowed text-vc-white font-title font-600 uppercase tracking-widest text-sm shadow-vc-blue transition-colors"
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

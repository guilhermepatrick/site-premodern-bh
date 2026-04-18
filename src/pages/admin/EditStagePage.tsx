import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Loader2, Save, Trash2 } from 'lucide-react';
import Section from '../../components/admin/Section';
import EventTypeSelect from '../../components/admin/EventTypeSelect';
import StageDraftTable, { type DraftRow } from '../../components/admin/StageDraftTable';
import {
  deleteStage,
  knownPlayerNames,
  loadStageForEdit,
  updateStage,
  type EventType,
  type Stage,
} from '../../lib/stagesStorage';

function newKey() {
  return Math.random().toString(36).slice(2);
}

export default function EditStagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [draftName, setDraftName] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [draftEventLinkId, setDraftEventLinkId] = useState('');
  const [draftRounds, setDraftRounds] = useState<number | ''>('');
  const [eventType, setEventType] = useState<EventType>('semanal');
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);

  const [known, setKnown] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    Promise.all([loadStageForEdit(id), knownPlayerNames()])
      .then(([s, k]) => {
        if (cancelled) return;
        setStage(s);
        setDraftName(s.name);
        setDraftDate(s.eventDate);
        setDraftEventLinkId(s.eventLinkId ?? '');
        setDraftRounds(s.rounds ?? '');
        setEventType(s.eventType);
        setDraftRows(s.results.map((r) => ({ _key: newKey(), ...r })));
        setKnown(k);
      })
      .catch((e) => {
        if (!cancelled) {
          if (e instanceof Error && e.message.includes('nao encontrada')) setNotFound(true);
          else setError(e instanceof Error ? e.message : 'Falha ao carregar etapa.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const canSave =
    !!stage &&
    !saving &&
    !deleting &&
    draftName.trim().length > 0 &&
    draftDate.length > 0 &&
    draftRows.length > 0 &&
    draftRows.every((r) => r.name.trim().length > 0 && r.position > 0);

  async function handleSave() {
    if (!stage) return;
    setSaving(true);
    setError(null);
    try {
      await updateStage(stage.id, {
        seasonId: stage.seasonId,
        name: draftName.trim(),
        eventLinkId: draftEventLinkId || undefined,
        eventDate: draftDate,
        rounds: typeof draftRounds === 'number' ? draftRounds : undefined,
        eventType,
        results: draftRows.map(({ _key: _unused, ...r }) => {
          void _unused;
          return r;
        }),
      });
      navigate('/admin/etapas', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar etapa.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!stage) return;
    if (!window.confirm(`Excluir etapa "${stage.name}"? Esta acao nao pode ser desfeita.`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteStage(stage.id);
      navigate('/admin/etapas', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao excluir etapa.');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Section eyebrow="Admin" title="Editar etapa">
        <div className="flex items-center gap-2 text-pm-parchment-2 font-body italic">
          <Loader2 size={16} className="animate-spin" /> Carregando...
        </div>
      </Section>
    );
  }

  if (notFound) {
    return (
      <Section eyebrow="Admin" title="Etapa nao encontrada">
        <div className="space-y-3 text-center">
          <p className="text-pm-parchment-2 font-body italic">A etapa solicitada nao existe ou foi removida.</p>
          <Link
            to="/admin/etapas"
            className="inline-flex px-4 py-2 rounded bg-pm-green hover:bg-pm-green-hi text-pm-cream font-title uppercase tracking-widest text-xs"
          >
            Voltar para lista
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section eyebrow="Admin" title={`Editar: ${stage?.name ?? ''}`}>
      <div className="space-y-6">
        {stage?.seasonName && (
          <p className="text-xs text-pm-parchment-2 uppercase tracking-widest font-title text-center">
            {stage.seasonName}
          </p>
        )}

        <div className="bg-pm-bg-2 border border-pm-frame rounded-sm p-5 shadow-card-lift space-y-4">
          <EventTypeSelect
            value={eventType}
            onChange={setEventType}
            disabled={saving || deleting}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
                Nome
              </span>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
              />
            </label>
            <label className="block">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
                Data
              </span>
              <input
                type="date"
                value={draftDate}
                onChange={(e) => setDraftDate(e.target.value)}
                className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
              />
            </label>
            <label className="block">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
                Rodadas
              </span>
              <input
                type="number"
                min={1}
                value={draftRounds}
                onChange={(e) =>
                  setDraftRounds(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
              />
            </label>
            <label className="block md:col-span-3">
              <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
                EventLink ID
              </span>
              <input
                type="text"
                value={draftEventLinkId}
                onChange={(e) => setDraftEventLinkId(e.target.value)}
                className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
              />
            </label>
          </div>

          <StageDraftTable
            rows={draftRows}
            known={known}
            onChange={setDraftRows}
            disabled={saving || deleting}
          />
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
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:opacity-50 font-title uppercase tracking-widest text-xs"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Excluir etapa
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/etapas"
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

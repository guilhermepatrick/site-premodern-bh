import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2, Save, Pencil } from 'lucide-react';
import Section from '../../components/admin/Section';
import FormatSeasonPicker from '../../components/admin/FormatSeasonPicker';
import EventTypeSelect from '../../components/admin/EventTypeSelect';
import PdfDropzone from '../../components/admin/PdfDropzone';
import StageDraftTable, { type DraftRow } from '../../components/admin/StageDraftTable';
import { extractEventFromPdf, type ProgressFn } from '../../lib/eventPdfParser';
import {
  findStageByEventLinkId,
  knownPlayerNames,
  saveStage,
  type EventType,
  type Stage,
} from '../../lib/stagesStorage';

type Phase = 'rasterizing' | 'ocr' | 'parsing';
const PHASE_LABEL: Record<Phase, string> = {
  rasterizing: 'Rasterizando PDF',
  ocr: 'Lendo texto (OCR)',
  parsing: 'Interpretando tabela',
};

function newKey() {
  return Math.random().toString(36).slice(2);
}

export default function RegisterStagePage() {
  const navigate = useNavigate();

  const [seasonId, setSeasonId] = useState<string | null>(null);
  const [eventType, setEventType] = useState<EventType>('semanal');

  const [draftName, setDraftName] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [draftEventLinkId, setDraftEventLinkId] = useState('');
  const [draftRounds, setDraftRounds] = useState<number | ''>('');
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);

  const [known, setKnown] = useState<Set<string>>(new Set());
  const [duplicateStage, setDuplicateStage] = useState<Stage | null>(null);
  const [layoutWarning, setLayoutWarning] = useState(false);

  const [phase, setPhase] = useState<Phase | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void knownPlayerNames().then(setKnown).catch(() => setKnown(new Set()));
  }, []);

  async function handlePdf(file: File) {
    setError(null);
    setDuplicateStage(null);
    setLayoutWarning(false);
    setBusy(true);
    const onProgress: ProgressFn = (p, v) => {
      setPhase(p as Phase);
      setProgress(v);
    };
    try {
      const ev = await extractEventFromPdf(file, onProgress);
      if (ev.eventName) setDraftName(ev.eventName);
      if (ev.eventDate) setDraftDate(ev.eventDate);
      if (ev.eventLinkId) {
        setDraftEventLinkId(ev.eventLinkId);
        const dup = await findStageByEventLinkId(ev.eventLinkId);
        if (dup) setDuplicateStage(dup);
      }
      if (ev.rounds) setDraftRounds(ev.rounds);
      setDraftRows(
        ev.results.map((r) => ({
          _key: newKey(),
          position: r.position,
          name: r.name,
          points: r.points,
        })),
      );
      if (!ev.eventName && !ev.eventDate && ev.results.length === 0) {
        setLayoutWarning(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao processar o PDF.');
    } finally {
      setBusy(false);
      setPhase(null);
      setProgress(0);
    }
  }

  const canSave =
    !saving &&
    !busy &&
    !!seasonId &&
    draftName.trim().length > 0 &&
    draftDate.length > 0 &&
    draftRows.length > 0 &&
    draftRows.every((r) => r.name.trim().length > 0 && r.position > 0);

  async function handleSave() {
    if (!seasonId) return;
    setSaving(true);
    setError(null);
    try {
      await saveStage({
        seasonId,
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

  return (
    <Section eyebrow="Admin" title="Nova etapa">
      <div className="space-y-6">
        <div className="bg-pm-bg-2 border border-pm-frame rounded-sm p-5 shadow-card-lift space-y-5">
          <FormatSeasonPicker
            seasonId={seasonId}
            onSeasonChange={setSeasonId}
            disabled={busy || saving}
          />
          <EventTypeSelect value={eventType} onChange={setEventType} disabled={busy || saving} />
        </div>

        <div className="bg-pm-bg-2 border border-pm-frame rounded-sm p-5 shadow-card-lift">
          <PdfDropzone
            onFile={handlePdf}
            busy={busy}
            phase={phase ? PHASE_LABEL[phase] : null}
            progress={progress}
            disabled={saving || !seasonId}
          />
          {!seasonId && (
            <p className="text-pm-parchment-2 text-xs mt-2 italic font-body">
              Selecione a temporada antes de carregar o PDF.
            </p>
          )}
        </div>

        {layoutWarning && (
          <div
            role="alert"
            className="flex items-start gap-2 text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/40 rounded p-3"
          >
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="flex-1">
              <p className="font-title uppercase tracking-widest text-xs mb-1">
                Layout do PDF nao reconhecido
              </p>
              <p>
                Nao foi possivel extrair nome, data ou tabela deste PDF. Preencha os campos
                manualmente ou envie um PDF do EventLink (WER) no formato padrao.
              </p>
            </div>
          </div>
        )}

        {duplicateStage && (
          <div
            role="alert"
            className="flex items-start gap-2 text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/40 rounded p-3"
          >
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="flex-1">
              <p className="font-title uppercase tracking-widest text-xs mb-1">Etapa duplicada</p>
              <p>
                Ja existe etapa com EventLink {draftEventLinkId}:{' '}
                <Link
                  to={`/admin/etapas/${duplicateStage.id}`}
                  className="underline text-yellow-200 hover:text-yellow-100 inline-flex items-center gap-1"
                >
                  <Pencil size={12} /> editar existente
                </Link>
              </p>
            </div>
          </div>
        )}

        {(draftRows.length > 0 || draftName || draftDate) && (
          <div className="bg-pm-bg-2 border border-pm-frame rounded-sm p-5 shadow-card-lift space-y-4">
            <h3 className="font-title uppercase tracking-widest text-sm text-pm-gold">
              Detalhes da etapa
            </h3>
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
              disabled={saving}
            />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2"
          >
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{error}</span>
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
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
            {saving ? 'Salvando...' : 'Salvar etapa'}
          </button>
        </div>
      </div>
    </Section>
  );
}

import { useMemo, useState } from 'react';
import { Upload, Loader2, AlertTriangle, Trash2, Save, FileText } from 'lucide-react';
import Section from '../components/ui/Section';
import { extractEventFromPdf, type ExtractedEvent } from '../lib/eventPdfParser';
import {
  knownPlayerNames,
  isNewPlayer,
  findStageByEventLinkId,
  saveStage,
  loadStages,
  deleteStage,
  type Stage,
  type StageResult,
} from '../lib/stagesStorage';

type Phase = 'rasterizing' | 'ocr' | 'parsing';

const PHASE_LABEL: Record<Phase, string> = {
  rasterizing: 'Rasterizando PDF',
  ocr: 'Lendo texto (OCR)',
  parsing: 'Interpretando tabela',
};

interface DraftRow extends StageResult {
  _key: string;
}

export default function RegisterStagePage() {
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [draftName, setDraftName] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [draftEventLinkId, setDraftEventLinkId] = useState('');
  const [draftRounds, setDraftRounds] = useState<number | ''>('');
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);
  const [rawText, setRawText] = useState<string>('');

  const [savedStages, setSavedStages] = useState<Stage[]>(loadStages());

  const known = useMemo(() => knownPlayerNames(), [savedStages]);
  const duplicateEventLinkId = draftEventLinkId
    ? findStageByEventLinkId(draftEventLinkId)
    : undefined;

  function resetDraft() {
    setDraftName('');
    setDraftDate('');
    setDraftEventLinkId('');
    setDraftRounds('');
    setDraftRows([]);
    setRawText('');
    setError(null);
  }

  function fillFromExtracted(ev: ExtractedEvent) {
    setDraftName(ev.eventName ?? '');
    setDraftDate(ev.eventDate ?? '');
    setDraftEventLinkId(ev.eventLinkId ?? '');
    setDraftRounds(ev.rounds ?? '');
    setDraftRows(
      ev.results.map((r, i) => ({ ...r, _key: `${i}-${r.position}-${Date.now()}` })),
    );
    setRawText(ev.rawText);
  }

  async function handleFile(file: File) {
    resetDraft();
    setBusy(true);
    setPhase('rasterizing');
    setProgress(0);
    try {
      const ev = await extractEventFromPdf(file, (p, prog) => {
        setPhase(p);
        setProgress(prog);
      });
      fillFromExtracted(ev);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao processar o PDF.');
    } finally {
      setBusy(false);
      setPhase(null);
      setProgress(0);
    }
  }

  function updateRow(key: string, patch: Partial<StageResult>) {
    setDraftRows((rows) => rows.map((r) => (r._key === key ? { ...r, ...patch } : r)));
  }

  function removeRow(key: string) {
    setDraftRows((rows) => rows.filter((r) => r._key !== key));
  }

  function handleSave() {
    setError(null);
    if (!draftName.trim()) return setError('Informe o nome da etapa.');
    if (!draftDate) return setError('Informe a data do evento.');
    if (draftRows.length === 0) return setError('Nenhum jogador para salvar.');
    if (draftRows.some((r) => !r.name.trim())) return setError('Todo jogador precisa ter um nome.');
    if (duplicateEventLinkId) {
      return setError(`Este evento (ID ${draftEventLinkId}) ja foi importado em ${duplicateEventLinkId.eventDate}.`);
    }

    const stage: Stage = {
      id: crypto.randomUUID(),
      name: draftName.trim(),
      eventLinkId: draftEventLinkId.trim() || undefined,
      eventDate: draftDate,
      rounds: typeof draftRounds === 'number' ? draftRounds : undefined,
      importedAt: new Date().toISOString(),
      results: draftRows.map(({ _key, ...rest }) => ({ ...rest, name: rest.name.trim() })),
    };
    saveStage(stage);
    setSavedStages(loadStages());
    resetDraft();
  }

  function handleDeleteStage(id: string) {
    if (!confirm('Remover esta etapa?')) return;
    deleteStage(id);
    setSavedStages(loadStages());
  }

  return (
    <>
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 0%, rgba(201,169,97,0.6) 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="font-title text-pm-gold tracking-[0.4em] text-xs mb-3">ADMIN</div>
          <h1 className="font-title text-4xl md:text-5xl text-pm-cream tracking-wide">
            Registrar etapa
          </h1>
          <div className="gold-divider max-w-md mx-auto" />
          <p className="font-body italic text-pm-parchment-2">
            Suba o PDF do EventLink para importar os resultados
          </p>
        </div>
      </header>

      <Section eyebrow="PASSO 1" title="Importar PDF do evento" id="importar">
        <div className="frame-card p-2">
          <div className="name-box rounded-t-sm">
            <span>Selecione o relatorio</span>
            <FileText size={16} className="text-pm-frame" />
          </div>
          <div className="parchment-texture m-1 p-6 rounded-sm">
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="btn-pm-gold">
                <Upload size={18} />
                {busy ? 'Processando...' : 'Escolher PDF'}
              </div>
              <input
                type="file"
                accept="application/pdf"
                disabled={busy}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                  e.target.value = '';
                }}
              />
              <span className="text-xs text-pm-ink/70 italic">
                A primeira vez baixa ~10MB do motor de OCR (cacheado depois).
              </span>
            </label>

            {busy && phase && (
              <div className="mt-4 flex items-center gap-3 text-pm-ink">
                <Loader2 size={18} className="animate-spin" />
                <span className="font-title text-sm tracking-wider">
                  {PHASE_LABEL[phase]}{' '}
                  {phase === 'ocr' && progress > 0 ? `${Math.round(progress * 100)}%` : ''}
                </span>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 text-red-700">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {draftRows.length > 0 && (
        <Section eyebrow="PASSO 2" title="Confira e ajuste os dados" id="conferir">
          <div className="frame-card-gold p-2">
            <div className="name-box rounded-t-sm">
              <span>{draftName || 'Nova etapa'}</span>
              <span className="text-pm-frame text-xs">⚜</span>
            </div>
            <div className="parchment-texture m-1 p-4 md:p-6 rounded-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Field label="Nome da etapa">
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="input-pm"
                  />
                </Field>
                <Field label="Data do evento">
                  <input
                    type="date"
                    value={draftDate}
                    onChange={(e) => setDraftDate(e.target.value)}
                    className="input-pm"
                  />
                </Field>
                <Field label="ID EventLink">
                  <input
                    value={draftEventLinkId}
                    onChange={(e) => setDraftEventLinkId(e.target.value)}
                    className="input-pm"
                    placeholder="opcional"
                  />
                </Field>
                <Field label="Rodadas">
                  <input
                    type="number"
                    min={1}
                    value={draftRounds}
                    onChange={(e) =>
                      setDraftRounds(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="input-pm"
                  />
                </Field>
              </div>

              {duplicateEventLinkId && (
                <div className="flex items-start gap-2 text-amber-800 bg-amber-100/60 border border-amber-700/40 p-3 rounded-sm">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <span className="text-sm">
                    Este ID EventLink ja foi importado em{' '}
                    <strong>{duplicateEventLinkId.eventDate}</strong>. Altere o ID ou apague a etapa
                    duplicada antes de salvar.
                  </span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-pm-ink">
                  <thead>
                    <tr className="border-b-2 border-pm-frame">
                      <th className="text-left py-2 px-2 font-title text-pm-frame text-xs tracking-widest">POS</th>
                      <th className="text-left py-2 px-2 font-title text-pm-frame text-xs tracking-widest">JOGADOR</th>
                      <th className="text-right py-2 px-2 font-title text-pm-frame text-xs tracking-widest">PONTOS</th>
                      <th className="hidden md:table-cell text-center py-2 px-2 font-title text-pm-frame text-xs tracking-widest">%VPG</th>
                      <th className="hidden md:table-cell text-center py-2 px-2 font-title text-pm-frame text-xs tracking-widest">%VJ</th>
                      <th className="hidden md:table-cell text-center py-2 px-2 font-title text-pm-frame text-xs tracking-widest">%VJG</th>
                      <th className="py-2 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftRows.map((r) => {
                      const novo = isNewPlayer(r.name, known);
                      return (
                        <tr key={r._key} className="border-b border-pm-frame/30">
                          <td className="py-1 px-2 w-12">
                            <input
                              type="number"
                              value={r.position}
                              onChange={(e) => updateRow(r._key, { position: Number(e.target.value) })}
                              className="input-pm w-14 text-right"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <div className="flex items-center gap-2">
                              <input
                                value={r.name}
                                onChange={(e) => updateRow(r._key, { name: e.target.value })}
                                className="input-pm flex-1"
                              />
                              {novo && (
                                <span className="shrink-0 text-[10px] font-title tracking-wider px-2 py-0.5 rounded-sm bg-pm-gold text-pm-ink">
                                  NOVO
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-1 px-2 w-20">
                            <input
                              type="number"
                              value={r.points}
                              onChange={(e) => updateRow(r._key, { points: Number(e.target.value) })}
                              className="input-pm w-16 text-right"
                            />
                          </td>
                          <td className="hidden md:table-cell py-1 px-2 w-16">
                            <input
                              type="number"
                              value={r.vpg ?? ''}
                              onChange={(e) =>
                                updateRow(r._key, { vpg: e.target.value === '' ? undefined : Number(e.target.value) })
                              }
                              className="input-pm w-14 text-center"
                            />
                          </td>
                          <td className="hidden md:table-cell py-1 px-2 w-16">
                            <input
                              type="number"
                              value={r.vj ?? ''}
                              onChange={(e) =>
                                updateRow(r._key, { vj: e.target.value === '' ? undefined : Number(e.target.value) })
                              }
                              className="input-pm w-14 text-center"
                            />
                          </td>
                          <td className="hidden md:table-cell py-1 px-2 w-16">
                            <input
                              type="number"
                              value={r.vjg ?? ''}
                              onChange={(e) =>
                                updateRow(r._key, { vjg: e.target.value === '' ? undefined : Number(e.target.value) })
                              }
                              className="input-pm w-14 text-center"
                            />
                          </td>
                          <td className="py-1 px-2 w-10 text-right">
                            <button
                              onClick={() => removeRow(r._key)}
                              className="text-red-700 hover:text-red-900"
                              aria-label="Remover linha"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleSave} disabled={busy} className="btn-pm-gold">
                  <Save size={18} />
                  Salvar etapa
                </button>
                <button onClick={resetDraft} disabled={busy} className="btn-pm">
                  Descartar
                </button>
                <span className="text-xs text-pm-ink/70 italic">
                  Salva localmente no navegador (Supabase entra em fase futura).
                </span>
              </div>

              <details className="text-pm-ink/70">
                <summary className="cursor-pointer text-xs font-title tracking-wider">
                  Ver texto bruto do OCR
                </summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap bg-black/5 p-3 rounded-sm max-h-64 overflow-auto">
                  {rawText}
                </pre>
              </details>
            </div>
          </div>
        </Section>
      )}

      <Section eyebrow="HISTORICO" title="Etapas salvas" id="salvas">
        {savedStages.length === 0 ? (
          <p className="text-center italic text-pm-parchment-2">Nenhuma etapa importada ainda.</p>
        ) : (
          <div className="frame-card p-2">
            <div className="name-box rounded-t-sm">
              <span>{savedStages.length} etapa(s)</span>
              <span className="text-pm-frame text-xs">⚜</span>
            </div>
            <div className="parchment-texture m-1 p-4 rounded-sm">
              <ul className="divide-y divide-pm-frame/30">
                {[...savedStages]
                  .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
                  .map((s) => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-title text-pm-ink">{s.name}</div>
                        <div className="text-xs text-pm-ink/70">
                          {s.eventDate} · {s.results.length} jogadores
                          {s.eventLinkId ? ` · ID ${s.eventLinkId}` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStage(s.id)}
                        className="text-red-700 hover:text-red-900"
                        aria-label="Apagar etapa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-title tracking-widest text-pm-frame mb-1">
        {label.toUpperCase()}
      </span>
      {children}
    </label>
  );
}

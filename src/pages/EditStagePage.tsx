import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Trash2,
  Plus,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import Section from '../components/ui/Section';
import {
  loadStageForEdit,
  updateStage,
  knownPlayerNames,
  isNewPlayer,
  type StageResult,
} from '../lib/stagesStorage';

interface DraftRow extends StageResult {
  _key: string;
}

function newKey() {
  return `row-${Math.random().toString(36).slice(2, 10)}`;
}

export default function EditStagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [eventLinkId, setEventLinkId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [rounds, setRounds] = useState<number | ''>('');
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [known, setKnown] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [stage, knownSet] = await Promise.all([loadStageForEdit(id), knownPlayerNames()]);
        if (cancelled) return;
        setName(stage.name);
        setEventLinkId(stage.eventLinkId ?? '');
        setEventDate(stage.eventDate);
        setRounds(stage.rounds ?? '');
        setRows(stage.results.map((r) => ({ ...r, _key: newKey() })));
        setKnown(knownSet);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Falha ao carregar etapa.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateRow(key: string, patch: Partial<StageResult>) {
    setRows((rs) => rs.map((r) => (r._key === key ? { ...r, ...patch } : r)));
  }

  function removeRow(key: string) {
    setRows((rs) => rs.filter((r) => r._key !== key));
  }

  function addRow() {
    const nextPos = (rows.reduce((m, r) => Math.max(m, r.position), 0) || 0) + 1;
    setRows((rs) => [...rs, { _key: newKey(), position: nextPos, name: '', points: 0 }]);
  }

  async function handleSave() {
    if (!id) return;
    setError(null);
    if (!name.trim()) return setError('Informe o nome da etapa.');
    if (!eventDate) return setError('Informe a data do evento.');
    if (rows.length === 0) return setError('Adicione pelo menos um jogador.');
    if (rows.some((r) => !r.name.trim())) return setError('Todo jogador precisa ter um nome.');

    setSaving(true);
    try {
      await updateStage(id, {
        name: name.trim(),
        eventLinkId: eventLinkId.trim() || undefined,
        eventDate,
        rounds: typeof rounds === 'number' ? rounds : undefined,
        results: rows.map(({ _key, ...rest }) => ({ ...rest, name: rest.name.trim() })),
      });
      navigate('/admin/registrar-etapa');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center italic text-pm-parchment-2">
        Carregando etapa...
      </div>
    );
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
          <Link
            to="/admin/registrar-etapa"
            className="inline-flex items-center gap-1 text-pm-cream hover:text-pm-gold-hi text-sm font-title tracking-wider mb-3"
          >
            <ChevronLeft size={14} /> voltar
          </Link>
          <div className="font-title text-pm-gold tracking-[0.4em] text-xs mb-3">ADMIN</div>
          <h1 className="font-title text-4xl md:text-5xl text-pm-cream tracking-wide">
            Editar etapa
          </h1>
          <div className="gold-divider max-w-md mx-auto" />
        </div>
      </header>

      <Section eyebrow="EDICAO" title={name || 'Etapa'} id="editar">
        <div className="frame-card-gold p-2">
          <div className="name-box rounded-t-sm">
            <span>{name || 'Etapa'}</span>
            <span className="text-pm-frame text-xs">⚜</span>
          </div>
          <div className="parchment-texture m-1 p-4 md:p-6 rounded-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Field label="Nome da etapa">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-pm" />
              </Field>
              <Field label="Data do evento">
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="input-pm"
                />
              </Field>
              <Field label="ID EventLink">
                <input
                  value={eventLinkId}
                  onChange={(e) => setEventLinkId(e.target.value)}
                  className="input-pm"
                  placeholder="opcional"
                />
              </Field>
              <Field label="Rodadas">
                <input
                  type="number"
                  min={1}
                  value={rounds}
                  onChange={(e) => setRounds(e.target.value === '' ? '' : Number(e.target.value))}
                  className="input-pm"
                />
              </Field>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-pm-ink">
                <thead>
                  <tr className="border-b-2 border-pm-frame">
                    <th className="text-left py-2 px-2 font-title text-pm-frame text-xs tracking-widest">POS</th>
                    <th className="text-left py-2 px-2 font-title text-pm-frame text-xs tracking-widest">JOGADOR</th>
                    <th className="text-right py-2 px-2 font-title text-pm-frame text-xs tracking-widest">PONTOS</th>
                    <th className="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
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
                            {novo && r.name.trim() && (
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

            <button
              onClick={addRow}
              className="inline-flex items-center gap-2 text-pm-ink hover:text-pm-frame text-sm font-title tracking-wider"
            >
              <Plus size={16} /> Adicionar linha
            </button>

            {error && (
              <div className="flex items-start gap-2 text-red-700">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-pm-gold">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Salvando...' : 'Salvar alteracoes'}
              </button>
              <Link to="/admin/registrar-etapa" className="btn-pm">
                Cancelar
              </Link>
            </div>
          </div>
        </div>
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

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import Section from '../../components/admin/Section';
import { createSeason } from '../../lib/stagesStorage';

const FORMAT = 'PREMODERN';

export default function NewSeasonPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = !saving && name.trim().length > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createSeason({
        name: name.trim(),
        format: FORMAT,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        isActive,
      });
      navigate('/admin/temporadas', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar temporada.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section eyebrow="Admin" title="Nova temporada">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-pm-bg-2 border border-pm-frame rounded-sm p-5 shadow-card-lift max-w-2xl mx-auto"
      >
        <p className="text-xs text-pm-parchment-2 font-title uppercase tracking-widest">
          Formato: <span className="text-pm-gold">{FORMAT}</span>
        </p>

        <label className="block">
          <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
            Nome da temporada
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Semanal Abril"
            required
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
            />
          </label>
          <label className="block">
            <span className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2 block mb-1">
              Fim (opcional)
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold"
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-pm-cream cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-pm-green"
          />
          <span className="font-title uppercase tracking-widest text-xs">Temporada ativa</span>
        </label>

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
            to="/admin/temporadas"
            className="px-4 py-2 rounded border border-pm-frame text-pm-parchment-2 hover:text-pm-cream hover:border-pm-gold font-title uppercase tracking-widest text-xs"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={!canSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-pm-green hover:bg-pm-green-hi disabled:bg-pm-green-deep disabled:cursor-not-allowed text-pm-cream font-title font-600 uppercase tracking-widest text-sm transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Criando...' : 'Criar temporada'}
          </button>
        </div>
      </form>
    </Section>
  );
}

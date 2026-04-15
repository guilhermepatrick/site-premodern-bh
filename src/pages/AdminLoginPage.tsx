import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Loader2, AlertTriangle } from 'lucide-react';
import Section from '../components/ui/Section';
import { useAuth } from '../lib/auth';

export default function AdminLoginPage() {
  const { session, loading, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin/registrar-etapa';

  if (loading) return null;
  if (session) return <Navigate to={from} replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.');
    } finally {
      setBusy(false);
    }
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
          <h1 className="font-title text-4xl md:text-5xl text-pm-cream tracking-wide">Entrar</h1>
          <div className="gold-divider max-w-md mx-auto" />
          <p className="font-body italic text-pm-parchment-2">Acesso restrito a organizadores</p>
        </div>
      </header>

      <Section eyebrow="LOGIN" title="Credenciais" id="login">
        <div className="max-w-md mx-auto">
          <div className="frame-card-gold p-2">
            <div className="name-box rounded-t-sm">
              <span>Entrada dos juizes</span>
              <Lock size={16} className="text-pm-frame" />
            </div>
            <form onSubmit={handleSubmit} className="parchment-texture m-1 p-6 rounded-sm space-y-4">
              <label className="block">
                <span className="block text-[10px] font-title tracking-widest text-pm-frame mb-1">EMAIL</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-pm"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] font-title tracking-widest text-pm-frame mb-1">SENHA</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-pm"
                />
              </label>

              {error && (
                <div className="flex items-start gap-2 text-red-700">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button type="submit" disabled={busy} className="btn-pm-gold w-full justify-center">
                {busy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                {busy ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}

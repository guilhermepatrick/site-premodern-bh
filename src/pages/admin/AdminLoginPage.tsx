import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Loader2, AlertTriangle } from 'lucide-react';
import Section from '../../components/admin/Section';
import { useAuth } from '../../lib/auth';

export default function AdminLoginPage() {
  const { session, loading, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin/etapas';

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
    <div className="min-h-screen bg-pm-bg bg-dark-grain flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Section eyebrow="Area restrita" title="Admin Premodern">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-pm-bg-2 border border-pm-frame rounded-sm p-6 shadow-card-lift"
            >
              <div className="flex items-center gap-2 text-pm-gold">
                <Lock size={18} />
                <span className="font-title uppercase tracking-widest text-xs">
                  Acesso do operador
                </span>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="login-email"
                  className="block font-title text-xs uppercase tracking-[0.25em] text-pm-parchment-2"
                >
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold focus:ring-1 focus:ring-pm-gold"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="login-password"
                  className="block font-title text-xs uppercase tracking-[0.25em] text-pm-parchment-2"
                >
                  Senha
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  aria-describedby={error ? 'login-error' : undefined}
                  className="w-full bg-pm-frame border border-pm-frame rounded px-3 py-2 text-pm-cream focus:outline-none focus:border-pm-gold focus:ring-1 focus:ring-pm-gold"
                />
              </div>

              {error && (
                <p
                  id="login-error"
                  role="alert"
                  className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2"
                >
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={busy || !email || !password}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-pm-green hover:bg-pm-green-hi disabled:bg-pm-green-deep disabled:cursor-not-allowed text-pm-cream font-title font-600 uppercase tracking-widest text-sm transition-colors"
              >
                {busy && <Loader2 size={16} className="animate-spin" />}
                {busy ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </Section>
        </div>
      </div>
    </div>
  );
}

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-1.5 rounded text-sm font-title font-600 uppercase tracking-widest transition-colors ${
    isActive ? 'bg-pm-green text-pm-cream' : 'text-pm-parchment-2 hover:text-pm-cream'
  }`;

export default function AdminHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <header className="border-b border-pm-frame bg-pm-bg-2">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/admin/etapas" className="flex items-center gap-2.5 group">
          <span className="font-title font-700 text-xl tracking-[0.2em] text-pm-cream group-hover:text-pm-gold transition-colors uppercase">
            PREMODERN · ADMIN
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/admin/etapas" end className={linkClass}>
            Etapas
          </NavLink>
          <NavLink to="/admin/temporadas" end className={linkClass}>
            Temporadas
          </NavLink>
          <button
            onClick={handleLogout}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-title font-600 uppercase tracking-widest text-pm-parchment-2 hover:text-pm-cream border border-pm-frame hover:border-pm-gold transition-colors"
            aria-label="Sair"
          >
            <LogOut size={14} />
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}

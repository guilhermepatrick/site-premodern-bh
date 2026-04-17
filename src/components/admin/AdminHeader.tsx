import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-1.5 rounded text-sm font-title font-600 uppercase tracking-widest transition-colors ${
    isActive ? 'bg-vc-blue text-vc-white' : 'text-vc-muted hover:text-vc-white'
  }`;

export default function AdminHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <header className="border-b border-vc-border bg-vc-bg-2">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/admin/etapas" className="flex items-center gap-2.5 group">
          <span className="font-title font-700 text-xl tracking-[0.2em] text-vc-white group-hover:text-vc-cyan transition-colors uppercase">
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
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-title font-600 uppercase tracking-widest text-vc-muted hover:text-vc-white border border-vc-border-2 hover:border-vc-blue transition-colors"
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

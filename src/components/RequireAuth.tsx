import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../lib/auth';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center text-pm-parchment-2 italic">
        Verificando sessao...
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

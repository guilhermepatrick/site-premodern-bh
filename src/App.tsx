import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import StagesListPage from './pages/StagesListPage';
import StageDetailPage from './pages/StageDetailPage';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminStagesListPage from './pages/admin/StagesListPage';
import SeasonsListPage from './pages/admin/SeasonsListPage';
import NewSeasonPage from './pages/admin/NewSeasonPage';

const RegisterStagePage = lazy(() => import('./pages/admin/RegisterStagePage'));
const EditStagePage = lazy(() => import('./pages/admin/EditStagePage'));
const EditSeasonPage = lazy(() => import('./pages/admin/EditSeasonPage'));

function AdminFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-pm-bg">
      <div className="h-10 w-10 rounded-full border-2 border-pm-frame border-t-pm-gold animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Site público */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/etapas" element={<StagesListPage />} />
        <Route path="/etapas/:id" element={<StageDetailPage />} />
      </Route>

      {/* Admin — login standalone */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      {/* Redireciona /admin (antiga rota de login) */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Admin — área protegida */}
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/etapas" element={<AdminStagesListPage />} />
          <Route path="/admin/temporadas" element={<SeasonsListPage />} />
          <Route path="/admin/temporadas/nova" element={<NewSeasonPage />} />
          <Route
            path="/admin/temporadas/:id"
            element={
              <Suspense fallback={<AdminFallback />}>
                <EditSeasonPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/etapas/nova"
            element={
              <Suspense fallback={<AdminFallback />}>
                <RegisterStagePage />
              </Suspense>
            }
          />
          <Route
            path="/admin/etapas/:id"
            element={
              <Suspense fallback={<AdminFallback />}>
                <EditStagePage />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

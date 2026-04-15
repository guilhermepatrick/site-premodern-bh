import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import StagesListPage from './pages/StagesListPage';
import StageDetailPage from './pages/StageDetailPage';
import RegisterStagePage from './pages/RegisterStagePage';
import AdminLoginPage from './pages/AdminLoginPage';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/etapas" element={<StagesListPage />} />
        <Route path="/etapas/:id" element={<StageDetailPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route
          path="/admin/registrar-etapa"
          element={
            <RequireAuth>
              <RegisterStagePage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

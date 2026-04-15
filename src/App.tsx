import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import RegisterStagePage from './pages/RegisterStagePage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/admin/registrar-etapa" element={<RegisterStagePage />} />
      </Route>
    </Routes>
  );
}

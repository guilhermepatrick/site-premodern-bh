import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-pm-bg bg-dark-grain">
      <AdminHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Toasts } from '../ui/Toast';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';
import { usersApi } from '../../lib/api';

export function AppShell() {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;
    const tick = () => {
      if (document.hidden) return;
      usersApi.heartbeat(token).catch(() => {});
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [token]);

  return (
    <div className="flex h-full min-h-screen bg-bg-0">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      <Toasts />
    </div>
  );
}

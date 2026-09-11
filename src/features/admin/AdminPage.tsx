import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function AdminPage() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  if (!isAdmin) return <Navigate to="/app/home" replace />;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="text-primary" /> Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold mb-2">Jeux — Prompts</h3>
          <p className="text-text-2 text-sm">CRUD des défis Action/Vérité via /admin/games/prompts</p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Roue</h3>
          <p className="text-text-2 text-sm">Gérer les segments via /admin/games/wheel</p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Musique</h3>
          <p className="text-text-2 text-sm">Upload / delete tracks, activer musique site</p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Seed</h3>
          <p className="text-text-2 text-sm">POST /admin/games/seed pour pack de départ</p>
        </Card>
      </div>
    </div>
  );
}

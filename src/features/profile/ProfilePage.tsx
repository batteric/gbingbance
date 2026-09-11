import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

export function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Mon profil</h1>
      <Card className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center text-3xl font-bold">
          {user?.pseudo?.[0]?.toUpperCase() || <User />}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.pseudo}</h2>
          <p className="text-text-2 text-sm">{user?.email || 'Pas d\'email'}</p>
          {user?.is_admin && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Admin</span>}
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold mb-2">À propos</h3>
        <p className="text-text-2 text-sm">{user?.bio || 'Aucune bio pour le moment.'}</p>
      </Card>
      <Button variant="danger" onClick={handleLogout}><LogOut size={16} /> Déconnexion</Button>
    </div>
  );
}

export function PublicProfilePage() {
  return (
    <div className="p-8 text-center text-text-2">
      Profil public — à connecter à l'API /users/:id
    </div>
  );
}

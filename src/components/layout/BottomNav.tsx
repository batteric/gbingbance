import { NavLink } from 'react-router-dom';
import { Home, Users, Gamepad2, Music, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

const items = [
  { to: '/app/home', icon: Home, label: 'Accueil' },
  { to: '/app/salons', icon: Users, label: 'Salons' },
  { to: '/app/games', icon: Gamepad2, label: 'Jeux' },
  { to: '/app/music', icon: Music, label: 'Musique' },
];

export function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-1 border-t border-bg-3 flex items-center justify-around py-2 z-50 safe-area-pb">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-0.5 px-2 py-1 text-xs', isActive ? 'text-primary' : 'text-text-2')
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs text-text-2"
        >
          <Menu size={22} />
          Menu
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/60" onClick={() => setMenuOpen(false)}>
          <div className="absolute bottom-16 left-4 right-4 card space-y-2" onClick={(e) => e.stopPropagation()}>
            <NavLink to="/app/messages" onClick={() => setMenuOpen(false)} className="block py-2 text-text">Messagerie</NavLink>
            <NavLink to="/app/friends" onClick={() => setMenuOpen(false)} className="block py-2 text-text">Amis</NavLink>
            <NavLink to="/app/discover" onClick={() => setMenuOpen(false)} className="block py-2 text-text">Discover</NavLink>
            <NavLink to="/app/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-text">Profil</NavLink>
            <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2 text-danger w-full text-left">Déconnexion</button>
          </div>
        </div>
      )}
    </>
  );
}

import { NavLink } from 'react-router-dom';
import {
  Home, Users, MessageCircle, Gamepad2, Music, User, Shield, Sparkles, Compass
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useBadgeStore } from '../../stores/badgeStore';
import { cn } from '../../lib/utils';

const links = [
  { to: '/app/home', icon: Home, label: 'Accueil' },
  { to: '/app/salons', icon: Users, label: 'Salons' },
  { to: '/app/messages', icon: MessageCircle, label: 'Messagerie', badge: 'pm' },
  { to: '/app/friends', icon: Users, label: 'Amis' },
  { to: '/app/games', icon: Gamepad2, label: 'Jeux' },
  { to: '/app/music', icon: Music, label: 'Musique' },
  { to: '/app/discover', icon: Compass, label: 'Discover' },
  { to: '/app/profile', icon: User, label: 'Profil' },
];

export function Sidebar() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const badges = useBadgeStore();

  return (
    <aside className="hidden md:flex w-60 flex-col bg-bg-1 border-r border-bg-3 h-full">
      <div className="p-5 flex items-center gap-2 text-primary">
        <Sparkles size={24} />
        <span className="font-bold text-lg tracking-tight">GBINGBANCE</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition',
                isActive ? 'bg-primary/20 text-primary' : 'text-text-2 hover:bg-bg-2 hover:text-text'
              )
            }
          >
            <Icon size={20} />
            <span className="flex-1">{label}</span>
            {badge === 'pm' && badges.pm > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-1.5 min-w-[18px] text-center">{badges.pm}</span>
            )}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/app/admin"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition',
                isActive ? 'bg-primary/20 text-primary' : 'text-text-2 hover:bg-bg-2 hover:text-text'
              )
            }
          >
            <Shield size={20} />
            Admin
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

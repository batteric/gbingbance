import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { roomsApi, usersApi, musicApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Radio, Users, Music, Sparkles } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export function HomePage() {
  const token = useAuthStore((s) => s.token)!;
  const user = useAuthStore((s) => s.user);

  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.list(token),
    refetchInterval: 5000,
  });

  const { data: onlineData } = useQuery({
    queryKey: ['online'],
    queryFn: () => usersApi.online(token),
    refetchInterval: 10000,
  });

  const rooms = (roomsData as any)?.rooms || (roomsData as any)?.data || [];
  const liveRooms = Array.isArray(rooms) ? rooms.filter((r: any) => (r.occupants_count || 0) > 0) : [];
  const online = (onlineData as any)?.users || (onlineData as any)?.data || [];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <section className="relative overflow-hidden rounded-card bg-gradient-to-r from-primary/30 via-pink/20 to-cyan/20 p-8 border border-primary/20">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Salut <span className="text-primary">{user?.pseudo}</span> 👋
          </h1>
          <p className="text-text-2 mb-6 max-w-lg">
            Prêt pour une soirée ? Rejoins un salon LIVE, lance un jeu ou écoute de la musique.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/app/salons"><Button>Voir les salons</Button></Link>
            <Link to="/app/games"><Button variant="secondary">Lancer un jeu</Button></Link>
          </div>
        </div>
        <Sparkles className="absolute right-8 top-8 text-primary/30" size={80} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Radio className="text-danger" size={20} />
          <h2 className="text-xl font-semibold">En ce moment</h2>
          <span className="badge-live">LIVE</span>
        </div>
        {roomsLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : liveRooms.length === 0 ? (
          <Card className="text-center text-text-2 py-10">
            Aucun salon en live pour le moment. Sois le premier !
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveRooms.slice(0, 6).map((room: any) => (
              <Link key={room.id} to={`/app/salons/${room.id}`}>
                <Card className="hover:border-primary/50 transition cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{room.emoji || '🎉'}</span>
                    <span className="badge-live">● LIVE</span>
                  </div>
                  <h3 className="font-semibold truncate">{room.name}</h3>
                  <p className="text-text-2 text-sm line-clamp-2 mt-1">{room.description || 'Salon de soirée'}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-text-2">
                    <span className="flex items-center gap-1"><Users size={14} /> {room.occupants_count || 0}</span>
                    {room.music_on && <span className="flex items-center gap-1 text-cyan"><Music size={14} /> ON</span>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Users size={18} /> En ligne</h3>
          {Array.isArray(online) && online.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {online.slice(0, 12).map((u: any) => (
                <Link key={u.id} to={`/app/users/${u.id}`} className="flex items-center gap-2 bg-bg-3 rounded-full px-3 py-1 text-sm hover:bg-primary/20 transition">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  {u.pseudo}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-text-2 text-sm">Personne en ligne pour l'instant</p>
          )}
        </Card>
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Music size={18} /> Musique du site</h3>
          <p className="text-text-2 text-sm mb-3">Active le son pour profiter de l'ambiance.</p>
          <Link to="/app/music"><Button variant="secondary" size="sm">Ouvrir le player</Button></Link>
        </Card>
      </section>
    </div>
  );
}

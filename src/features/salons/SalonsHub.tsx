import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { roomsApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { Plus, Search, Users, Music, Lock, Radio } from 'lucide-react';

export function SalonsHub() {
  const token = useAuthStore((s) => s.token)!;
  const user = useAuthStore((s) => s.user)!;
  const addToast = useUiStore((s) => s.addToast);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'live' | 'private' | 'mine'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [form, setForm] = useState({ name: '', description: '', emoji: '🎉', is_public: true });

  const { data, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.list(token),
    refetchInterval: 4000,
  });

  const rooms: any[] = (data as any)?.rooms || (data as any)?.data || [];

  const createMut = useMutation({
    mutationFn: () => roomsApi.create(token, form),
    onSuccess: (res: any) => {
      addToast('success', 'Salon créé !');
      qc.invalidateQueries({ queryKey: ['rooms'] });
      setShowCreate(false);
      const id = res.room?.id || res.id;
      if (id) navigate(`/app/salons/${id}`);
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const joinMut = useMutation({
    mutationFn: () => roomsApi.joinCode(token, joinCode),
    onSuccess: (res: any) => {
      addToast('success', 'Salon rejoint');
      const id = res.room?.id || res.id;
      if (id) navigate(`/app/salons/${id}`);
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const filtered = rooms.filter((r) => {
    if (search && !r.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'live') return (r.occupants_count || 0) > 0;
    if (filter === 'private') return !r.is_public;
    if (filter === 'mine') return r.created_by === user.id;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Salons</h1>
          <p className="text-text-2 text-sm">Rejoins ou crée une soirée</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreate(true)}><Plus size={18} /> Créer</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" size={18} />
          <Input className="pl-10" placeholder="Rechercher un salon..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-bg-2 rounded-btn p-1">
          {(['all', 'live', 'private', 'mine'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-btn text-sm capitalize ${filter === f ? 'bg-primary text-white' : 'text-text-2 hover:text-text'}`}
            >
              {f === 'all' ? 'Tous' : f === 'live' ? 'LIVE' : f === 'private' ? 'Privés' : 'Mes salons'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Input placeholder="Code d'invitation" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="max-w-xs" />
        <Button variant="secondary" onClick={() => joinMut.mutate()} disabled={!joinCode || joinMut.isPending}>Rejoindre</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12 text-text-2">Aucun salon trouvé</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => (
            <Link key={room.id} to={`/app/salons/${room.id}`}>
              <Card className="hover:border-primary/40 transition h-full cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl">{room.emoji || '🎉'}</span>
                  <div className="flex gap-1">
                    {(room.occupants_count || 0) > 0 && <span className="badge-live">● LIVE</span>}
                    {!room.is_public && <span className="text-xs bg-bg-3 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock size={12} /> Privé</span>}
                  </div>
                </div>
                <h3 className="font-semibold truncate">{room.name}</h3>
                <p className="text-text-2 text-sm line-clamp-2 mt-1">{room.description || ''}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-text-2">
                  <span className="flex items-center gap-1"><Users size={14} /> {room.occupants_count || 0}</span>
                  {room.music_on && <span className="flex items-center gap-1 text-cyan"><Music size={14} /> Musique</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="card w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold">Créer un salon</h2>
            <Input placeholder="Nom du salon" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Emoji" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} maxLength={2} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="accent-primary" />
              Salon public
            </label>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Annuler</Button>
              <Button onClick={() => createMut.mutate()} disabled={!form.name || createMut.isPending}>Créer & entrer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

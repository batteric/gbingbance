import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { useRoomStore } from '../../stores/roomStore';
import { useUiStore } from '../../stores/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { LogOut, Gamepad2, Music, UserPlus, Send, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RoomView() {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const token = useAuthStore((s) => s.token)!;
  const user = useAuthStore((s) => s.user)!;
  const { setCurrentRoom, clearRoom, isHost } = useRoomStore();
  const addToast = useUiStore((s) => s.addToast);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [msg, setMsg] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.list(token),
    refetchInterval: 5000,
  });
  const rooms: any[] = (roomsData as any)?.rooms || (roomsData as any)?.data || [];
  const room = rooms.find((r: any) => r.id === roomId);

  const { data: msgData, isLoading } = useQuery({
    queryKey: ['room-messages', roomId],
    queryFn: () => roomsApi.messages(token, roomId),
    refetchInterval: (query) => (document.hidden ? false : 3000),
    enabled: !!roomId,
  });
  const messages: any[] = (msgData as any)?.messages || (msgData as any)?.data || [];

  useEffect(() => {
    if (room) setCurrentRoom(room, user.id);
    return () => clearRoom();
  }, [room, user.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (roomId) {
      roomsApi.enter(token, roomId).catch(() => {});
    }
  }, [roomId, token]);

  const sendMut = useMutation({
    mutationFn: () => roomsApi.postMessage(token, roomId, msg),
    onSuccess: () => {
      setMsg('');
      qc.invalidateQueries({ queryKey: ['room-messages', roomId] });
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const leave = async () => {
    try {
      await roomsApi.leave(token, roomId);
    } catch {}
    clearRoom();
    navigate('/app/salons');
  };

  if (!room && !isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-2 mb-4">Salon introuvable</p>
        <Link to="/app/salons"><Button>Retour</Button></Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-0px)] md:h-screen flex flex-col md:flex-row">
      {/* Left: members + music */}
      <div className="hidden md:flex w-64 flex-col bg-bg-1 border-r border-bg-3 p-4 space-y-4">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-2xl">{room?.emoji || '🎉'}</span>
            {room?.name}
          </h2>
          {(room?.occupants_count || 0) > 0 && <span className="badge-live mt-1">● LIVE</span>}
        </div>
        <div>
          <h3 className="text-sm text-text-2 mb-2 flex items-center gap-1"><Users size={14} /> Membres</h3>
          <p className="text-sm text-text-2">{room?.occupants_count || 0} présents</p>
        </div>
        <div>
          <h3 className="text-sm text-text-2 mb-2 flex items-center gap-1"><Music size={14} /> Musique</h3>
          <p className="text-sm">{room?.music_on ? 'En cours' : 'Arrêtée'}</p>
          {isHost && <p className="text-xs text-primary mt-1">Tu es l'hôte</p>}
        </div>
      </div>

      {/* Center: chat */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="md:hidden p-3 border-b border-bg-3 flex items-center justify-between bg-bg-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{room?.emoji}</span>
            <span className="font-semibold truncate">{room?.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={leave}><LogOut size={16} /></Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : messages.length === 0 ? (
            <p className="text-center text-text-2 py-12">Aucun message. Dis bonjour !</p>
          ) : (
            messages.map((m: any) => (
              <div key={m.id} className={`flex gap-2 ${m.user_id === user.id ? 'justify-end' : ''}`}>
                {m.kind === 'game_draw' || m.kind === 'game_wheel' ? (
                  <Card className="max-w-sm bg-primary/10 border-primary/30">
                    <p className="text-xs text-primary mb-1">{m.kind === 'game_draw' ? 'Action ou Vérité' : 'Roue'}</p>
                    <p className="font-medium">{m.content}</p>
                  </Card>
                ) : (
                  <div className={`max-w-[75%] rounded-card px-3 py-2 ${m.user_id === user.id ? 'bg-primary/30' : 'bg-bg-2'}`}>
                    {m.user_id !== user.id && <p className="text-xs text-primary mb-0.5">{m.user?.pseudo || 'Anonyme'}</p>}
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    <p className="text-[10px] text-text-2 mt-1 opacity-60">
                      {m.created_at ? new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <form
          className="p-3 border-t border-bg-3 flex gap-2 bg-bg-1"
          onSubmit={(e) => { e.preventDefault(); if (msg.trim()) sendMut.mutate(); }}
        >
          <Input
            placeholder="Écrire un message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!msg.trim() || sendMut.isPending}><Send size={18} /></Button>
        </form>
      </div>

      {/* Right: actions */}
      <div className="hidden md:flex w-56 flex-col bg-bg-1 border-l border-bg-3 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-text-2">Actions</h3>
        <Link to="/app/games/av"><Button variant="secondary" className="w-full justify-start"><Gamepad2 size={16} /> Jeux</Button></Link>
        <Link to="/app/music"><Button variant="secondary" className="w-full justify-start"><Music size={16} /> Musique</Button></Link>
        <Button variant="secondary" className="w-full justify-start" disabled><UserPlus size={16} /> Inviter</Button>
        <div className="flex-1" />
        <Button variant="danger" className="w-full" onClick={leave}><LogOut size={16} /> Quitter</Button>
      </div>
    </div>
  );
}

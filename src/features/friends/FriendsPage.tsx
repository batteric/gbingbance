import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { UserPlus, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FriendsPage() {
  const token = useAuthStore((s) => s.token)!;
  const addToast = useUiStore((s) => s.addToast);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: () => socialApi.friends(token),
    refetchInterval: 10000,
  });

  const friends: any[] = (data as any)?.friends || (data as any)?.data || [];
  const requests: any[] = (data as any)?.requests || [];

  const acceptMut = useMutation({
    mutationFn: (id: number) => socialApi.accept(token, id),
    onSuccess: () => { addToast('success', 'Ami accepté'); qc.invalidateQueries({ queryKey: ['friends'] }); },
    onError: (e: any) => addToast('error', e.message),
  });
  const refuseMut = useMutation({
    mutationFn: (id: number) => socialApi.refuse(token, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['friends'] }); },
  });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Amis</h1>

      {requests.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3 text-text-2">Demandes ({requests.length})</h2>
          <div className="space-y-2">
            {requests.map((r: any) => (
              <Card key={r.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold">
                  {(r.from_user?.pseudo || '?')[0]?.toUpperCase()}
                </div>
                <div className="flex-1">{r.from_user?.pseudo}</div>
                <Button size="sm" onClick={() => acceptMut.mutate(r.id)}><Check size={16} /></Button>
                <Button size="sm" variant="ghost" onClick={() => refuseMut.mutate(r.id)}><X size={16} /></Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-3">Mes amis</h2>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : friends.length === 0 ? (
          <Card className="text-center py-12 text-text-2">
            <UserPlus className="mx-auto mb-2 opacity-50" size={32} />
            Aucun ami pour le moment. Explore Discover !
          </Card>
        ) : (
          <div className="space-y-2">
            {friends.map((f: any) => (
              <Card key={f.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold relative">
                  {(f.pseudo || '?')[0]?.toUpperCase()}
                  {f.is_online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-bg-2" />}
                </div>
                <div className="flex-1">
                  <Link to={`/app/users/${f.id}`} className="font-medium hover:text-primary">{f.pseudo}</Link>
                </div>
                <Link to={`/app/messages/${f.id}`}><Button size="sm" variant="secondary">Message</Button></Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

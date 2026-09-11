import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { Send, ArrowLeft } from 'lucide-react';

export function MessagesPage() {
  const { userId } = useParams<{ userId?: string }>();
  const token = useAuthStore((s) => s.token)!;
  const me = useAuthStore((s) => s.user)!;
  const addToast = useUiStore((s) => s.addToast);
  const qc = useQueryClient();
  const [text, setText] = useState('');

  const { data: convData, isLoading: listLoading } = useQuery({
    queryKey: ['pm-list'],
    queryFn: () => socialApi.pmList(token),
    refetchInterval: 5000,
  });
  const conversations: any[] = (convData as any)?.conversations || (convData as any)?.data || [];

  const { data: threadData, isLoading: threadLoading } = useQuery({
    queryKey: ['pm-thread', userId],
    queryFn: () => socialApi.pmThread(token, Number(userId)),
    enabled: !!userId,
    refetchInterval: 3000,
  });
  const messages: any[] = (threadData as any)?.messages || (threadData as any)?.data || [];

  const sendMut = useMutation({
    mutationFn: () => socialApi.pmSend(token, Number(userId), text),
    onSuccess: () => {
      setText('');
      qc.invalidateQueries({ queryKey: ['pm-thread', userId] });
      qc.invalidateQueries({ queryKey: ['pm-list'] });
    },
    onError: (e: any) => addToast('error', e.message),
  });

  if (userId) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
        <div className="p-3 border-b border-bg-3 flex items-center gap-3 bg-bg-1">
          <Link to="/app/messages"><Button variant="ghost" size="sm"><ArrowLeft size={18} /></Button></Link>
          <span className="font-semibold">Conversation</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {threadLoading ? <div className="flex justify-center py-12"><Spinner /></div> : messages.length === 0 ? (
            <p className="text-center text-text-2 py-12">Aucun message</p>
          ) : messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.user_id === me.id ? 'justify-end' : ''}`}>
              <div className={`max-w-[75%] rounded-card px-3 py-2 text-sm ${m.user_id === me.id ? 'bg-primary/30' : 'bg-bg-2'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <form className="p-3 border-t border-bg-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) sendMut.mutate(); }}>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message..." className="flex-1" />
          <Button type="submit" disabled={!text.trim()}><Send size={18} /></Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Messagerie</h1>
      {listLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : conversations.length === 0 ? (
        <Card className="text-center py-12 text-text-2">Aucune conversation. Va sur Amis pour discuter !</Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((c: any) => (
            <Link key={c.id || c.user?.id} to={`/app/messages/${c.user?.id || c.user_id}`}>
              <Card className="flex items-center gap-3 hover:border-primary/30 transition cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold">
                  {(c.user?.pseudo || '?')[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{c.user?.pseudo || 'Utilisateur'}</p>
                  <p className="text-sm text-text-2 truncate">{c.last_message?.content || 'Nouvelle conversation'}</p>
                </div>
                {(c.unread_count || 0) > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">{c.unread_count}</span>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

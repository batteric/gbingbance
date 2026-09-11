import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { gamesApi, roomsApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { useRoomStore } from '../../stores/roomStore';
import { useUiStore } from '../../stores/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Gamepad2, RotateCcw, Swords, Sparkles } from 'lucide-react';

type Category = 'soft' | 'moyen' | 'extreme' | 'all';

export function GamesPage() {
  const { mode } = useParams<{ mode?: string }>();
  const token = useAuthStore((s) => s.token)!;
  const { currentRoom } = useRoomStore();
  const addToast = useUiStore((s) => s.addToast);
  const [category, setCategory] = useState<Category>('all');
  const [include18, setInclude18] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const { data: wheelData } = useQuery({
    queryKey: ['wheel'],
    queryFn: () => gamesApi.wheel(token),
    enabled: mode === 'wheel' || !mode,
  });
  const segments: any[] = (wheelData as any)?.segments || (wheelData as any)?.data || [];

  const drawMut = useMutation({
    mutationFn: (type: 'verite' | 'action') =>
      gamesApi.draw(token, {
        type,
        category: category === 'all' ? undefined : category,
        include18,
        room_id: currentRoom?.id,
      }),
    onSuccess: async (res: any) => {
      const prompt = res.prompt || res.data || res;
      setResult(prompt);
      if (currentRoom?.id && prompt?.content) {
        try {
          await roomsApi.postMessage(token, currentRoom.id, prompt.content, 'game_draw', {
            category: prompt.category,
            type: prompt.type,
          });
        } catch {}
      }
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const spinWheel = () => {
    if (!segments.length) {
      addToast('info', 'Aucun segment disponible');
      return;
    }
    setSpinning(true);
    setWheelResult(null);
    setTimeout(async () => {
      const idx = Math.floor(Math.random() * segments.length);
      const seg = segments[idx];
      setWheelResult(seg.label || seg.name || String(seg));
      setSpinning(false);
      if (currentRoom?.id) {
        try {
          await roomsApi.postMessage(token, currentRoom.id, seg.label || seg.name, 'game_wheel');
        } catch {}
      }
    }, 4000);
  };

  if (mode === 'defi') {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <Swords className="mx-auto text-primary" size={48} />
        <h1 className="text-2xl font-bold">Défis entre amis</h1>
        <Card className="py-10 text-text-2">
          Bientôt disponible
        </Card>
        <Link to="/app/games"><Button variant="secondary">Retour</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Gamepad2 className="text-primary" /> Jeux
        </h1>
        <p className="text-text-2 text-sm mt-1">Action ou Vérité • Roue • Défis</p>
      </div>

      <div className="flex justify-center gap-2">
        <Link to="/app/games/av"><Button variant={!mode || mode === 'av' ? 'primary' : 'secondary'}>Action / Vérité</Button></Link>
        <Link to="/app/games/wheel"><Button variant={mode === 'wheel' ? 'primary' : 'secondary'}>Roue</Button></Link>
        <Link to="/app/games/defi"><Button variant={mode === 'defi' ? 'primary' : 'secondary'}>Défi</Button></Link>
      </div>

      {(!mode || mode === 'av') && (
        <Card className="space-y-6">
          <h2 className="font-semibold text-lg">Action ou Vérité</h2>
          <div className="flex flex-wrap gap-2">
            {(['all', 'soft', 'moyen', 'extreme'] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize ${category === c ? 'bg-primary text-white' : 'bg-bg-3 text-text-2'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-text-2">
            <input type="checkbox" checked={include18} onChange={(e) => setInclude18(e.target.checked)} className="accent-primary" />
            Inclure contenu 18+
          </label>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => drawMut.mutate('verite')} disabled={drawMut.isPending}>
              {drawMut.isPending ? <Spinner /> : 'Vérité'}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => drawMut.mutate('action')} disabled={drawMut.isPending}>
              Action
            </Button>
          </div>
          {result && (
            <Card className="bg-primary/10 border-primary/30 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-primary">{result.category || category} • {result.type || 'tirage'}</span>
              <p className="text-lg font-medium">{result.content || result.prompt || JSON.stringify(result)}</p>
            </Card>
          )}
        </Card>
      )}

      {mode === 'wheel' && (
        <Card className="space-y-6 text-center">
          <h2 className="font-semibold text-lg flex items-center justify-center gap-2"><RotateCcw /> Roue de la fortune</h2>
          <div className={`mx-auto w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center bg-bg-2 ${spinning ? 'animate-spin' : ''}`} style={{ animationDuration: '0.4s' }}>
            <Sparkles className="text-primary" size={40} />
          </div>
          <Button size="lg" onClick={spinWheel} disabled={spinning || !segments.length}>
            {spinning ? 'Tourne...' : 'Lancer la roue'}
          </Button>
          {wheelResult && (
            <Card className="bg-cyan/10 border-cyan/30">
              <p className="text-xl font-bold text-cyan">{wheelResult}</p>
            </Card>
          )}
          {!segments.length && <p className="text-text-2 text-sm">Segments chargés depuis l'API admin</p>}
        </Card>
      )}
    </div>
  );
}

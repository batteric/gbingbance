import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { useMusicStore } from '../../stores/musicStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export function MusicPage() {
  const token = useAuthStore((s) => s.token)!;
  const { mutedLocal, setMutedLocal, setPlayback } = useMusicStore();
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: tracksData, isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => musicApi.tracks(token),
  });
  const { data: playbackData } = useQuery({
    queryKey: ['playback'],
    queryFn: () => musicApi.playback(token),
    refetchInterval: 5000,
  });

  const tracks: any[] = (tracksData as any)?.tracks || (tracksData as any)?.data || [];
  const playback: any = playbackData || {};

  useEffect(() => {
    if (playback) setPlayback(playback);
  }, [playback]);

  const unlockAudio = () => {
    setAudioUnlocked(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const currentTrack = playback?.track || tracks[0];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Music className="text-primary" /> Musique</h1>
        <Button variant="ghost" size="sm" onClick={() => setMutedLocal(!mutedLocal)}>
          {mutedLocal ? <VolumeX size={18} /> : <Volume2 size={18} />}
          {mutedLocal ? 'Muet' : 'Son'}
        </Button>
      </div>

      {!audioUnlocked && (
        <Card className="text-center py-8 space-y-4 border-primary/30">
          <p className="text-text-2">Les navigateurs bloquent l'autoplay. Clique pour activer le son.</p>
          <Button onClick={unlockAudio}><Play size={18} /> Activer le son</Button>
        </Card>
      )}

      {currentTrack && (
        <Card className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-card bg-primary/20 flex items-center justify-center">
            <Music className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{currentTrack.title || 'Piste en cours'}</p>
            <p className="text-sm text-text-2">{currentTrack.artist || 'Artiste'}</p>
          </div>
          {audioUnlocked && currentTrack.url && (
            <audio ref={audioRef} src={currentTrack.url} autoPlay={!mutedLocal} loop={false} />
          )}
        </Card>
      )}

      <section>
        <h2 className="font-semibold mb-3">Bibliothèque</h2>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : tracks.length === 0 ? (
          <Card className="text-center py-10 text-text-2">Aucune piste. L'admin peut en uploader.</Card>
        ) : (
          <div className="space-y-2">
            {tracks.map((t: any) => (
              <Card key={t.id} className="flex items-center gap-3 py-3 hover:border-primary/30 transition">
                <div className="w-10 h-10 rounded bg-bg-3 flex items-center justify-center text-primary">
                  <Music size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{t.title}</p>
                  <p className="text-xs text-text-2">{t.artist} {t.genre ? `• ${t.genre}` : ''}</p>
                </div>
                {t.duration_sec && <span className="text-xs text-text-2">{Math.floor(t.duration_sec / 60)}:{String(t.duration_sec % 60).padStart(2, '0')}</span>}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

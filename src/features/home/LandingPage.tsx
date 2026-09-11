import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Sparkles, Users, Music, Gamepad2 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-0 flex flex-col">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={24} />
          <span className="font-bold text-xl">GBINGBANCE</span>
        </div>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost">Connexion</Button></Link>
          <Link to="/register"><Button>S'inscrire</Button></Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-pink to-cyan bg-clip-text text-transparent">
          Soirées sociales<br />en ligne
        </h1>
        <p className="text-text-2 text-lg max-w-xl mb-8">
          Chat, salons avec musique, Action ou Vérité, Roue, défis entre amis. Ambiance night social.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link to="/register"><Button size="lg">Rejoindre la fête</Button></Link>
          <Link to="/login"><Button size="lg" variant="secondary">Se connecter</Button></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          <div className="card text-center space-y-2">
            <Users className="mx-auto text-primary" size={32} />
            <h3 className="font-semibold">Salons LIVE</h3>
            <p className="text-sm text-text-2">Crée ou rejoins des soirées avec chat et musique</p>
          </div>
          <div className="card text-center space-y-2">
            <Gamepad2 className="mx-auto text-pink" size={32} />
            <h3 className="font-semibold">Jeux de groupe</h3>
            <p className="text-sm text-text-2">Action/Vérité, Roue, défis — 100% API</p>
          </div>
          <div className="card text-center space-y-2">
            <Music className="mx-auto text-cyan" size={32} />
            <h3 className="font-semibold">Musique sync</h3>
            <p className="text-sm text-text-2">Player partagé, hôte ou site</p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

const schema = z.object({
  login: z.string().min(1, 'Email ou pseudo requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});
type Form = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useUiStore((s) => s.addToast);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authApi.login({ login: data.login, password: data.password });
      if (res.token && res.user) {
        setAuth(res.token, res.user);
        addToast('success', `Bienvenue ${res.user.pseudo} !`);
        navigate('/app/home');
      }
    } catch (e: any) {
      addToast('error', e.message || 'Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-bg-0 via-bg-1 to-bg-2">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Sparkles size={28} />
            <h1 className="text-3xl font-bold tracking-tight">GBINGBANCE</h1>
          </div>
          <p className="text-text-2">Soirées sociales, musique & jeux</p>
        </div>
        <div className="card space-y-6">
          <h2 className="text-xl font-semibold text-center">Connexion</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email ou pseudo" autoComplete="username" {...register('login')} />
              {errors.login && <p className="text-danger text-sm mt-1">{errors.login.message}</p>}
            </div>
            <div className="relative">
              <Input type={showPwd ? 'text' : 'password'} placeholder="Mot de passe" autoComplete="current-password" {...register('password')} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-2" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</Button>
          </form>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" disabled>Google</Button>
            <Button variant="secondary" className="flex-1" disabled>Facebook</Button>
          </div>
          <p className="text-center text-text-2 text-sm">
            Pas de compte ? <Link to="/register" className="text-primary hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

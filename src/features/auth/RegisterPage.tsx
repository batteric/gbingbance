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
import { Sparkles } from 'lucide-react';

const schema = z.object({
  pseudo: z.string().min(3, 'Min 3 caractères').max(20),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  password: z.string().min(6, 'Min 6 caractères'),
  sex: z.enum(['M', 'F', 'O']).optional(),
  cgu: z.literal(true, { errorMap: () => ({ message: 'CGU obligatoires' }) }),
  age18: z.literal(true, { errorMap: () => ({ message: '18+ obligatoire' }) }),
});
type Form = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useUiStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res: any = await authApi.register({
        pseudo: data.pseudo,
        password: data.password,
        email: data.email || undefined,
        sex: data.sex,
      });
      if (res.token && res.user) {
        setAuth(res.token, res.user);
        addToast('success', 'Compte créé ! Bienvenue 🎉');
        navigate('/app/home');
      } else if (res.ok) {
        addToast('success', 'Compte créé, connecte-toi');
        navigate('/login');
      }
    } catch (e: any) {
      addToast('error', e.message || 'Inscription échouée');
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
            <h1 className="text-3xl font-bold">GBINGBANCE</h1>
          </div>
          <p className="text-text-2">Rejoins la soirée</p>
        </div>
        <div className="card space-y-5">
          <h2 className="text-xl font-semibold text-center">Inscription</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Input placeholder="Pseudo" {...register('pseudo')} />
              {errors.pseudo && <p className="text-danger text-sm mt-1">{errors.pseudo.message}</p>}
            </div>
            <div>
              <Input type="email" placeholder="Email (optionnel)" {...register('email')} />
              {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" placeholder="Mot de passe" {...register('password')} />
              {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <select className="input" {...register('sex')}>
                <option value="">Genre (optionnel)</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
                <option value="O">Autre</option>
              </select>
            </div>
            <label className="flex items-start gap-2 text-sm text-text-2">
              <input type="checkbox" className="mt-1 accent-primary" {...register('cgu')} />
              J'accepte les CGU
            </label>
            {errors.cgu && <p className="text-danger text-sm">{errors.cgu.message}</p>}
            <label className="flex items-start gap-2 text-sm text-text-2">
              <input type="checkbox" className="mt-1 accent-primary" {...register('age18')} />
              J'ai 18 ans ou plus
            </label>
            {errors.age18 && <p className="text-danger text-sm">{errors.age18.message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte'}</Button>
          </form>
          <p className="text-center text-text-2 text-sm">
            Déjà un compte ? <Link to="/login" className="text-primary hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

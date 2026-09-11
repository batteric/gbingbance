import { useUiStore } from '../../stores/uiStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Toasts() {
  const { toasts, removeToast } = useUiStore();
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 rounded-card px-4 py-3 shadow-lg border animate-in slide-in-from-right',
            t.type === 'success' && 'bg-success/20 border-success/40 text-success',
            t.type === 'error' && 'bg-danger/20 border-danger/40 text-danger',
            t.type === 'info' && 'bg-primary/20 border-primary/40 text-primary'
          )}
        >
          {t.type === 'success' && <CheckCircle size={18} />}
          {t.type === 'error' && <AlertCircle size={18} />}
          {t.type === 'info' && <Info size={18} />}
          <span className="flex-1 text-sm text-text">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

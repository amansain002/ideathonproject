import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  accent?: string;
  icon?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, subtitle, accent = '#8B5CF6', icon, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} card card-pad max-h-[90vh] overflow-y-auto scrollbar-thin rounded-b-none sm:rounded-2xl animate-slideUp`}
        style={{ boxShadow: `0 0 0 1px ${accent}33, 0 12px 50px rgba(0,0,0,0.6)` }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${accent}1f`, color: accent, border: `1px solid ${accent}44` }}
              >
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/50 hover:bg-surface2 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="neon-divider mb-4" />
        {children}
      </div>
    </div>
  );
}

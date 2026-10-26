import { Home, BookOpen, CalendarDays, TrendingUp, User, type LucideIcon } from 'lucide-react';
import type { TabId } from '@/types';

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-edge bg-ink/95 backdrop-blur-xl">
      <div className="flex items-stretch justify-between px-2 py-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition active:scale-90"
            >
              <Icon
                size={22}
                className={isActive ? 'text-neon-purple' : 'text-white/35'}
                style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.6))' } : undefined}
              />
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-white' : 'text-white/35'}`}>
                {t.label}
              </span>
              {isActive && <span className="absolute -top-0.5 h-1 w-1 rounded-full bg-neon-purple shadow-glow" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { GameProvider } from '@/context/GameContext';
import { BottomNav } from '@/components/BottomNav';
import { LevelUpOverlay, CompanionWidget } from '@/components/CompanionOverlay';
import { CoachReactionOverlay } from '@/components/CoachReactionOverlay';
import { Onboarding } from '@/Onboarding';
import { HomeTab } from '@/tabs/HomeTab';
import { ToolsTab } from '@/tabs/ToolsTab';
import { ProgressTab } from '@/tabs/ProgressTab';
import { FriendsTab } from '@/tabs/FriendsTab';
import { ProfileTab } from '@/tabs/ProfileTab';
import { LearnTab } from '@/tabs/LearnTab';
import { TimetableTab } from '@/tabs/TimetableTab';
import type { TabId } from '@/types';

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabId>('home');
  const [runId, setRunId] = useState(0);

  if (!onboarded) {
    return (
      <GameProvider key={runId}>
        <Onboarding onFinish={() => setOnboarded(true)} />
      </GameProvider>
    );
  }

  return (
    <GameProvider key={runId}>
      <div className="app-frame flex min-h-screen flex-col">
        <main className="flex-1">
          {tab === 'home' && <HomeTab onNavigate={setTab} />}
          {tab === 'learn' && <LearnTab onNavigate={setTab} />}
          {tab === 'timetable' && <TimetableTab />}
          {tab === 'progress' && <ProgressTab />}
          {tab === 'profile' && <ProfileTab onRestart={() => { setTab('home'); setOnboarded(false); setRunId((n) => n + 1); }} />}
          {tab === 'tools' && <ToolsTab />}
          {tab === 'friends' && <FriendsTab />}
        </main>
        <BottomNav active={tab} onChange={setTab} />
        <CompanionWidget />
        <CoachReactionOverlay />
        <LevelUpOverlay />
      </div>
    </GameProvider>
  );
}

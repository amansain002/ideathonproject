import { useCallback, useEffect, useRef, useState } from 'react';
import type { PersonalityTone } from '@/types';

interface VoiceSettings {
  enabled: boolean;
  volume: number; // 0-1
  voiceURI: string | null; // selected system voice
}

const personalityVoiceParams: Record<PersonalityTone, { pitch: number; rate: number }> = {
  supportive: { pitch: 1.05, rate: 0.95 },
  hype: { pitch: 1.3, rate: 1.2 },
  strict: { pitch: 0.85, rate: 1.0 },
  calm: { pitch: 1.0, rate: 0.85 },
  savage: { pitch: 0.9, rate: 1.1 },
};

const LS_KEY = 'uplevel-voice-settings';

function loadSettings(): VoiceSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { enabled: true, volume: 0.8, voiceURI: null, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { enabled: true, volume: 0.8, voiceURI: null };
}

function saveSettings(s: VoiceSettings) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function useCoachVoice(personality: PersonalityTone) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(loadSettings);
  const [speaking, setSpeaking] = useState(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (!supported) return;
    const update = () => setVoices(window.speechSynthesis.getVoices());
    update();
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, [supported]);

  useEffect(() => { saveSettings(settings); }, [settings]);

  const speak = useCallback((text: string) => {
    if (!supported) return;
    const s = settingsRef.current;
    if (!s.enabled) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const params = personalityVoiceParams[personality];
      u.pitch = params.pitch;
      u.rate = params.rate;
      u.volume = s.volume;
      if (s.voiceURI) {
        const v = window.speechSynthesis.getVoices().find((v) => v.voiceURI === s.voiceURI);
        if (v) u.voice = v;
      }
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch {
      setSpeaking(false);
    }
  }, [supported, personality]);

  const stop = useCallback(() => {
    if (!supported) return;
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    setSpeaking(false);
  }, [supported]);

  const updateSettings = useCallback((patch: Partial<VoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleMute = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, enabled: !prev.enabled };
      if (!next.enabled) {
        try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
        setSpeaking(false);
      }
      return next;
    });
  }, []);

  const preview = useCallback((p: PersonalityTone, text: string) => {
    if (!supported) return;
    const s = settingsRef.current;
    if (!s.enabled) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const params = personalityVoiceParams[p];
      u.pitch = params.pitch;
      u.rate = params.rate;
      u.volume = s.volume;
      if (s.voiceURI) {
        const v = window.speechSynthesis.getVoices().find((v) => v.voiceURI === s.voiceURI);
        if (v) u.voice = v;
      }
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch {
      setSpeaking(false);
    }
  }, [supported]);

  return {
    supported,
    voices,
    settings,
    speaking,
    speak,
    stop,
    updateSettings,
    toggleMute,
    preview,
  };
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ScreenType, UserProfile, AvatarConfig, DailyQuest } from '../types';
import { BADGES_DATA, INITIAL_QUESTS } from '../data/learningData';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'fun_learning_world_v1';

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#FCD34D',
  hairStyle: 'curls',
  hairColor: '#78350F',
  outfit: 'adventurer',
  hat: 'baseball',
  glasses: 'none',
  companionPet: 'puppy',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Super Explorer',
  age: 5,
  avatar: DEFAULT_AVATAR,
  stars: 35,
  unlockedItems: ['hat-baseball', 'outfit-adventurer', 'pet-puppy'],
  badges: ['badge-abc-starter'],
  completedLessons: {},
  highScores: {},
  dailyStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyQuests: INITIAL_QUESTS,
  settings: {
    soundEffects: true,
    voiceGuidance: true,
    speechRate: 0.88,
    dailyLimitMinutes: 0, // unlimited by default
    todayMinutesSpent: 0,
    parentPin: '1234',
  },
};

interface GameContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  lastWorld: ScreenType;
  profile: UserProfile;
  addStars: (amount: number, reason?: string) => void;
  completeActivity: (activityId: string, category: DailyQuest['category']) => void;
  updateAvatar: (avatar: AvatarConfig) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (settingsUpdates: Partial<UserProfile['settings']>) => void;
  resetProgress: () => void;
  mascotMessage: string;
  mascotMood: 'idle' | 'happy' | 'cheering' | 'talking';
  setMascot: (message: string, mood?: 'idle' | 'happy' | 'cheering' | 'talking', vocalize?: boolean, lang?: string) => void;
  showConfetti: () => void;
  screenTimePaused: boolean;
  dismissScreenTimePause: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROFILE, ...parsed, settings: { ...DEFAULT_PROFILE.settings, ...(parsed.settings || {}) } };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [currentScreen, setCurrentScreenState] = useState<ScreenType>('home');
  const [lastWorld, setLastWorld] = useState<ScreenType>('abc');
  const [mascotMessage, setMascotMessage] = useState<string>('Welcome to Fun Learning World! Tap any island to start playing!');
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheering' | 'talking'>('happy');
  const [screenTimePaused, setScreenTimePaused] = useState<boolean>(false);

  // Sync settings with audio controller
  useEffect(() => {
    sound.setSoundEnabled(profile.settings.soundEffects);
    sound.setVoiceEnabled(profile.settings.voiceGuidance);
  }, [profile.settings.soundEffects, profile.settings.voiceGuidance]);

  // Save profile changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage unavailable
    }
  }, [profile]);

  // Track session screen time (increments every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setProfile((prev) => {
        const newMinutes = prev.settings.todayMinutesSpent + 1;
        if (prev.settings.dailyLimitMinutes > 0 && newMinutes >= prev.settings.dailyLimitMinutes) {
          setScreenTimePaused(true);
        }
        return {
          ...prev,
          settings: {
            ...prev.settings,
            todayMinutesSpent: newMinutes,
          },
        };
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const setCurrentScreen = (screen: ScreenType) => {
    sound.playPop();
    if (screen !== 'home' && screen !== 'avatar' && screen !== 'badges' && screen !== 'parent-dashboard') {
      setLastWorld(screen);
    }
    setCurrentScreenState(screen);
  };

  const showConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch {
      // Ignored
    }
  };

  const setMascot = (
    message: string,
    mood: 'idle' | 'happy' | 'cheering' | 'talking' = 'talking',
    vocalize = true,
    lang = 'en-US'
  ) => {
    setMascotMessage(message);
    setMascotMood(mood);
    if (vocalize && profile.settings.voiceGuidance) {
      sound.speak(message, { lang, rate: profile.settings.speechRate });
    }
  };

  const addStars = (amount: number, reason?: string) => {
    sound.playStarDing();
    setProfile((prev) => ({
      ...prev,
      stars: prev.stars + amount,
    }));
    if (amount >= 10) {
      sound.playSuccess();
      showConfetti();
    }
    if (reason) {
      setMascot(`Awesome! You earned +${amount} Stars for ${reason}! ⭐`, 'cheering', true);
    }
  };

  const completeActivity = (activityId: string, category: DailyQuest['category']) => {
    setProfile((prev) => {
      const alreadyDone = prev.completedLessons[activityId];
      const newCompleted = { ...prev.completedLessons, [activityId]: true };

      // Update Daily Quests
      const updatedQuests = prev.dailyQuests.map((q) => {
        if (q.category === category && !q.isCompleted) {
          const nextCount = q.currentCount + 1;
          const isNowCompleted = nextCount >= q.targetCount;
          if (isNowCompleted) {
            setTimeout(() => {
              addStars(q.rewardStars, `Daily Quest: ${q.title}`);
              sound.playFanfare();
            }, 600);
          }
          return {
            ...q,
            currentCount: nextCount,
            isCompleted: isNowCompleted,
          };
        }
        return q;
      });

      // Check badges
      const newBadges = [...prev.badges];
      const totalCompleted = Object.keys(newCompleted).length;

      BADGES_DATA.forEach((b) => {
        if (!newBadges.includes(b.id)) {
          if (b.id === 'badge-abc-starter' && category === 'abc') newBadges.push(b.id);
          if (b.id === 'badge-math-whiz' && category === 'math') newBadges.push(b.id);
          if (b.id === 'badge-urdu-star' && category === 'urdu') newBadges.push(b.id);
          if (b.id === 'badge-animal-hero' && category === 'animals') newBadges.push(b.id);
          if (b.id === 'badge-color-artist' && category === 'colors') newBadges.push(b.id);
          if (b.id === 'badge-space-astronaut' && category === 'space') newBadges.push(b.id);
          if (b.id === 'badge-puzzle-genius' && category === 'puzzles') newBadges.push(b.id);
          if (b.id === 'badge-daily-champion' && updatedQuests.every((q) => q.isCompleted)) {
            newBadges.push(b.id);
          }
        }
      });

      return {
        ...prev,
        stars: alreadyDone ? prev.stars + 2 : prev.stars + 5,
        completedLessons: newCompleted,
        dailyQuests: updatedQuests,
        badges: newBadges,
      };
    });
  };

  const updateAvatar = (avatar: AvatarConfig) => {
    sound.playPop();
    setProfile((prev) => ({ ...prev, avatar }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateSettings = (settingsUpdates: Partial<UserProfile['settings']>) => {
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settingsUpdates },
    }));
  };

  const resetProgress = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentScreen('home');
  };

  const dismissScreenTimePause = () => {
    setScreenTimePaused(false);
  };

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        lastWorld,
        profile,
        addStars,
        completeActivity,
        updateAvatar,
        updateProfile,
        updateSettings,
        resetProgress,
        mascotMessage,
        mascotMood,
        setMascot,
        showConfetti,
        screenTimePaused,
        dismissScreenTimePause,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

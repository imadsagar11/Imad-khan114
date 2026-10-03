export type ScreenType =
  | 'home'
  | 'abc'
  | 'math'
  | 'colors-shapes'
  | 'animals'
  | 'urdu'
  | 'space'
  | 'puzzles'
  | 'avatar'
  | 'badges'
  | 'parent-dashboard';

export interface AvatarConfig {
  skinColor: string; // hex
  hairStyle: 'curls' | 'short' | 'spiky' | 'pigtails' | 'cap';
  hairColor: string;
  outfit: 'adventurer' | 'superhero' | 'astronaut' | 'dinosaur' | 'rainbow' | 'scientist';
  hat: 'none' | 'crown' | 'wizard' | 'baseball' | 'flower' | 'astro-helm';
  glasses: 'none' | 'star' | 'circle' | 'cool-shades';
  companionPet: 'none' | 'puppy' | 'kitten' | 'baby-dragon' | 'robot';
}

export interface UserProfile {
  name: string;
  age: number;
  avatar: AvatarConfig;
  stars: number;
  unlockedItems: string[];
  badges: string[];
  completedLessons: {
    [key: string]: boolean;
  };
  highScores: {
    [key: string]: number;
  };
  dailyStreak: number;
  lastActiveDate: string;
  dailyQuests: DailyQuest[];
  // Parental settings
  settings: {
    soundEffects: boolean;
    voiceGuidance: boolean;
    speechRate: number; // 0.8 to 1.1
    dailyLimitMinutes: number; // 0 = unlimited, 15, 30, 45, 60
    todayMinutesSpent: number;
    parentPin: string;
  };
}

export interface DailyQuest {
  id: string;
  title: string;
  titleUrdu: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  rewardStars: number;
  category: 'abc' | 'math' | 'animals' | 'urdu' | 'puzzles' | 'space' | 'colors';
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  isUnlocked?: boolean;
}

export interface AbcLetter {
  letter: string;
  lowercase: string;
  phonics: string;
  word: string;
  urduMeaning: string;
  emoji: string;
  color: string;
  traceGuide: string; // descriptive stroke
}

export interface UrduLetter {
  letter: string;
  name: string;
  transliteration: string;
  word: string;
  englishMeaning: string;
  emoji: string;
  color: string;
}

export interface MathItem {
  id: string;
  type: 'count' | 'addition' | 'subtraction' | 'comparison' | 'pattern';
  question: string;
  questionUrdu: string;
  num1: number;
  num2?: number;
  operator?: '+' | '-' | '>' | '<';
  emoji: string;
  correctAnswer: number;
  options: number[];
}

export interface AnimalItem {
  id: string;
  name: string;
  urduName: string;
  emoji: string;
  soundDescription: string;
  soundName: string;
  habitat: 'Jungle' | 'Farm' | 'Ocean' | 'Forest' | 'Savanna';
  habitatUrdu: string;
  funFact: string;
  funFactUrdu: string;
  soundAudioCue: 'roar' | 'bark' | 'meow' | 'trumpet' | 'ooh-aah' | 'quack' | 'moo' | 'baa';
}

export interface PlanetItem {
  id: string;
  name: string;
  urduName: string;
  emoji: string;
  color: string;
  funFact: string;
  funFactUrdu: string;
  orderFromSun: number;
  distanceInfo: string;
}

export interface ColorShapeItem {
  id: string;
  name: string;
  urduName: string;
  hex: string;
  type: 'color' | 'shape';
  shapeType?: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'rectangle';
}

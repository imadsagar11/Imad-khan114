import React, { useState } from 'react';
import { Play, Sparkles, Trophy, Gift, Compass, ChevronRight, Heart } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { MascotBuddy } from '../common/MascotBuddy';
import { DailyChallengeModal } from '../features/DailyChallengeModal';
import { sound } from '../../utils/audio';
import { ScreenType } from '../../types';

interface WorldCard {
  id: ScreenType;
  title: string;
  urduTitle: string;
  icon: string;
  tagline: string;
  colorGradient: string;
  borderColor: string;
  textColor: string;
  completedKey: string;
}

const WORLDS: WorldCard[] = [
  {
    id: 'abc',
    title: 'ABC Adventure',
    urduTitle: 'اے بی سی ایڈونچر',
    icon: '🔤',
    tagline: 'Letters, Phonics & Tracing',
    colorGradient: 'from-rose-400 via-pink-500 to-rose-500',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-600',
    completedKey: 'abc',
  },
  {
    id: 'math',
    title: 'Math Land',
    urduTitle: 'میتھ لینڈ',
    icon: '🔢',
    tagline: 'Counting, Plus & Minus',
    colorGradient: 'from-emerald-400 via-teal-500 to-emerald-600',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-600',
    completedKey: 'math',
  },
  {
    id: 'urdu',
    title: 'Urdu Learning',
    urduTitle: 'اردو لرننگ',
    icon: '🇵🇰',
    tagline: 'حروفِ تہجی، انار، تتلی',
    colorGradient: 'from-green-500 via-emerald-600 to-teal-700',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    completedKey: 'urdu',
  },
  {
    id: 'animals',
    title: 'Animal World',
    urduTitle: 'جانوروں کی دنیا',
    icon: '🐾',
    tagline: 'Sounds, Roars & Habits',
    colorGradient: 'from-amber-400 via-orange-500 to-amber-600',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    completedKey: 'animals',
  },
  {
    id: 'colors-shapes',
    title: 'Colors & Shapes',
    urduTitle: 'رنگ اور اشکال',
    icon: '🎨',
    tagline: 'Rainbows, Stars & Sorting',
    colorGradient: 'from-purple-400 via-fuchsia-500 to-pink-500',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-600',
    completedKey: 'colors',
  },
  {
    id: 'space',
    title: 'Space Adventure',
    urduTitle: 'خلائی سفر',
    icon: '🚀',
    tagline: 'Planets, Stars & Rocket Flight',
    colorGradient: 'from-indigo-600 via-blue-700 to-purple-800',
    borderColor: 'border-indigo-400',
    textColor: 'text-indigo-600',
    completedKey: 'space',
  },
  {
    id: 'puzzles',
    title: 'Puzzle Zone',
    urduTitle: 'پہیلیوں کا زون',
    icon: '🧩',
    tagline: 'Memory Cards & Brain Games',
    colorGradient: 'from-cyan-400 via-sky-500 to-blue-600',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-600',
    completedKey: 'puzzles',
  },
];

export const HomeScreen: React.FC = () => {
  const { profile, setCurrentScreen, lastWorld } = useGame();
  const [showDailyModal, setShowDailyModal] = useState(false);

  const completedDailyCount = profile.dailyQuests.filter((q) => q.isCompleted).length;

  const handleOpenWorld = (worldId: ScreenType) => {
    sound.playPop();
    setCurrentScreen(worldId);
  };

  const handleContinue = () => {
    sound.playPop();
    setCurrentScreen(lastWorld || 'abc');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border-4 border-white">
        {/* Floating background bubbles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-300/30 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <span className="inline-block bg-white/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border border-white/30">
              Welcome Explorer 🌟
            </span>
            <h2 className="text-2xl sm:text-4xl font-black drop-shadow-sm">
              Hi, {profile.name}!
            </h2>
            <p className="text-amber-100 font-semibold text-sm sm:text-base max-w-md">
              Are you ready for your next exciting learning adventure today?
            </p>

            {/* Quick Continue Learning Button */}
            <div className="pt-2">
              <button
                onClick={handleContinue}
                className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-900 font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-300 hover:scale-105 active:scale-95 transition text-base"
              >
                <Play className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>Continue Learning</span>
              </button>
            </div>
          </div>

          {/* Daily Challenge Interactive Card */}
          <div
            onClick={() => {
              sound.playPop();
              setShowDailyModal(true);
            }}
            className="bg-white/95 backdrop-blur-md text-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg border-3 border-amber-200 cursor-pointer hover:scale-105 active:scale-95 transition w-full md:w-72"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider flex items-center gap-1">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>Daily Quests</span>
              </span>
              <span className="text-xs font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {completedDailyCount}/3 Done
              </span>
            </div>

            <p className="text-xs font-bold text-slate-600 mb-2">
              Complete quests for bonus stars and rewards!
            </p>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedDailyCount / 3) * 100}%` }}
              />
            </div>

            <button className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1">
              <span>View Quests</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mascot Companion Speaking Banner */}
      <MascotBuddy />

      {/* Learning Worlds Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">Explore Learning Worlds</h3>
          </div>
          <span className="text-xs font-bold text-slate-500">7 Interactive Islands</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {WORLDS.map((world) => (
            <div
              key={world.id}
              onClick={() => handleOpenWorld(world.id)}
              className="group bg-white rounded-3xl p-5 border-3 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer active:scale-98 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card Top Pill */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${world.colorGradient} text-white flex items-center justify-center text-3xl shadow-md border-2 border-white group-hover:scale-110 transition-transform`}
                >
                  {world.icon}
                </div>

                <span className="text-xs font-urdu font-bold text-slate-400 group-hover:text-amber-600 transition">
                  {world.urduTitle}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="mt-4">
                <h4 className="text-lg font-black text-slate-800 group-hover:text-amber-700 transition">
                  {world.title}
                </h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-snug">
                  {world.tagline}
                </p>
              </div>

              {/* Enter Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-amber-700">Play Island</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-amber-400 group-hover:text-amber-950 text-slate-600 flex items-center justify-center transition-colors shadow-sm">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Challenge Modal Popup */}
      {showDailyModal && <DailyChallengeModal onClose={() => setShowDailyModal(false)} />}
    </div>
  );
};

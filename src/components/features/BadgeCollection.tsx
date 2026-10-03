import React from 'react';
import { ArrowLeft, Trophy, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BADGES_DATA } from '../../data/learningData';
import { sound } from '../../utils/audio';

export const BadgeCollection: React.FC = () => {
  const { profile, setCurrentScreen } = useGame();

  const handleBadgeClick = (isUnlocked: boolean, title: string) => {
    if (isUnlocked) {
      sound.playSuccess();
      sound.speak(`You unlocked the ${title} badge! Outstanding job! 🏆`);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`Keep playing to unlock the ${title} badge! You can do it!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-200">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 p-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-amber-900 flex items-center justify-center gap-2">
            <span>Trophy Room</span>
            <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Earn special badges as you explore learning worlds!
          </p>
        </div>

        <div className="bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300 font-black text-amber-800 text-sm">
          <span>{profile.badges.length} / {BADGES_DATA.length} 🏅</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES_DATA.map((badge) => {
          const isUnlocked = profile.badges.includes(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(isUnlocked, badge.title)}
              className={`p-5 rounded-3xl border-3 cursor-pointer transition-all active:scale-95 relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-50 via-white to-amber-100 border-amber-400 shadow-md hover:shadow-xl hover:-translate-y-1'
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Badge Icon Header */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 ${
                    isUnlocked ? 'bg-amber-200 border-amber-300 animate-wiggle' : 'bg-slate-200 border-slate-300 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                {isUnlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-3">
                <h3 className="font-extrabold text-slate-800 text-base flex items-center justify-between">
                  <span>{badge.title}</span>
                  <span className="text-xs text-amber-700 font-urdu">{badge.titleUrdu}</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-snug">{badge.description}</p>
                <div className="mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg inline-block">
                  Target: {badge.requirement}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

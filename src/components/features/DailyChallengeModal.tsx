import React from 'react';
import { X, Check, Gift, Sparkles, Trophy } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

interface DailyChallengeModalProps {
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ onClose }) => {
  const { profile, addStars, showConfetti, setCurrentScreen } = useGame();

  const allCompleted = profile.dailyQuests.every((q) => q.isCompleted);

  const handleQuestJump = (category: string) => {
    sound.playPop();
    onClose();
    if (category === 'abc') setCurrentScreen('abc');
    else if (category === 'math') setCurrentScreen('math');
    else if (category === 'animals') setCurrentScreen('animals');
    else if (category === 'urdu') setCurrentScreen('urdu');
    else if (category === 'space') setCurrentScreen('space');
    else if (category === 'puzzles') setCurrentScreen('puzzles');
    else setCurrentScreen('colors-shapes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-300 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner border border-amber-300 animate-wiggle">
          🎁
        </div>

        <h3 className="text-2xl font-black text-amber-900">Today's Learning Quests!</h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-5">
          Finish today's mini challenges to earn bonus stars and unlock badges!
        </p>

        {/* Quests List */}
        <div className="space-y-3 mb-6 text-left">
          {profile.dailyQuests.map((quest) => {
            const pct = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

            return (
              <div
                key={quest.id}
                onClick={() => !quest.isCompleted && handleQuestJump(quest.category)}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition ${
                  quest.isCompleted
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-400 cursor-pointer active:scale-98'
                }`}
              >
                <div className="text-3xl flex-shrink-0">{quest.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                    <span className="truncate">{quest.title}</span>
                    <span className="text-amber-600 flex-shrink-0 ml-2">+{quest.rewardStars} ⭐</span>
                  </div>

                  <div className="text-[11px] text-amber-800/80 font-urdu mb-1.5">{quest.titleUrdu}</div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        quest.isCompleted ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* State Tag */}
                <div className="flex-shrink-0">
                  {quest.isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-xs font-black text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      {quest.currentCount}/{quest.targetCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Claim / Completion Banner */}
        {allCompleted ? (
          <div className="bg-gradient-to-r from-amber-400 to-yellow-300 p-4 rounded-2xl border-2 border-amber-400 text-amber-950 font-black shadow-md flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-amber-900 fill-amber-700" />
            <span>All Daily Challenges Done! You are a superstar! 🌟</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Tap any quest above to jump straight into that learning world!
          </p>
        )}
      </div>
    </div>
  );
};

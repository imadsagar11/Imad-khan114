import React from 'react';
import { Coffee, Eye, Heart } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

export const ScreenTimeAlertModal: React.FC = () => {
  const { screenTimePaused, dismissScreenTimePause } = useGame();

  if (!screenTimePaused) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 text-center relative space-y-4">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
          🧸
        </div>

        <h3 className="text-2xl font-black text-slate-800">Time for a Fun Rest! 🌟</h3>

        <p className="text-slate-600 text-sm leading-relaxed">
          Great job learning today! Your eyes have worked hard. Let's stand up, stretch high like a giraffe 🦒, drink some fresh water, and play outside!
        </p>

        <div className="flex items-center justify-center gap-4 py-2 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-sky-500" />
            <span>Rest Eyes</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Stretch Body</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            dismissScreenTimePause();
          }}
          className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold text-base shadow-lg transition active:scale-95"
        >
          Parent: Resume Playing
        </button>
      </div>
    </div>
  );
};

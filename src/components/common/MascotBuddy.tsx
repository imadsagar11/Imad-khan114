import React, { useState } from 'react';
import { Volume2, Sparkles, Heart } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

export const MascotBuddy: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { mascotMessage, mascotMood, profile } = useGame();
  const [giggling, setGiggling] = useState(false);

  const handleTap = () => {
    setGiggling(true);
    sound.playPop();
    const giggles = [
      "Hehehe! That tickles!",
      "You're doing fantastic! Keep going!",
      "I love learning with you!",
      "High five, super explorer! 🖐️",
    ];
    const quote = giggles[Math.floor(Math.random() * giggles.length)];
    sound.speak(quote, { rate: profile.settings.speechRate });
    setTimeout(() => setGiggling(false), 800);
  };

  const handleReplayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.speak(mascotMessage, { rate: profile.settings.speechRate });
  };

  return (
    <div className={`relative flex items-center gap-3 ${compact ? 'max-w-md' : 'max-w-2xl'} mx-auto select-none`}>
      {/* Mascot Character Avatar */}
      <button
        onClick={handleTap}
        className={`relative z-10 flex-shrink-0 transition-transform ${
          giggling ? 'scale-110 rotate-12' : 'hover:scale-105 active:scale-95'
        }`}
        title="Tap me!"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl sm:text-4xl animate-bounce-slow">
          {mascotMood === 'cheering' ? '🦁🎉' : giggling ? '😹' : '🦁'}
        </div>
        {/* Little badge / heart tag */}
        <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1 shadow border border-white">
          <Heart className="w-3.5 h-3.5 fill-white" />
        </div>
      </button>

      {/* Speech Bubble */}
      <div className="relative flex-1 bg-white border-3 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-md text-amber-950">
        {/* Bubble pointer triangle */}
        <div className="absolute -left-2.5 top-6 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-amber-300" />
        <div className="absolute -left-2 top-6 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white" />

        <div className="flex items-start justify-between gap-2">
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800">
            {mascotMessage}
          </p>
          <button
            onClick={handleReplayVoice}
            className="flex-shrink-0 p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition active:scale-90"
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

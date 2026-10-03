import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Shield, ArrowLeft, Trophy, User } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ParentGateModal } from '../parent/ParentGateModal';
import { sound } from '../../utils/audio';

export const Header: React.FC = () => {
  const { currentScreen, setCurrentScreen, profile, updateSettings, addStars } = useGame();
  const [showParentGate, setShowParentGate] = useState(false);

  const toggleSound = () => {
    const nextState = !profile.settings.soundEffects;
    updateSettings({ soundEffects: nextState });
    if (nextState) sound.playPop();
  };

  const onStarsClick = () => {
    sound.playStarDing();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 shadow-sm px-3 py-2 sm:px-6 sm:py-3 flex items-center justify-between">
      {/* Left: Back / Brand */}
      <div className="flex items-center gap-2">
        {currentScreen !== 'home' ? (
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-md transition-transform active:scale-95 text-sm sm:text-base border-2 border-amber-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Worlds</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl animate-bounce-slow">🌟</span>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Fun Learning World
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-700 font-semibold hidden xs:block">
                Play • Learn • Explore • Grow
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Star Counter */}
        <button
          onClick={onStarsClick}
          className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-800 font-extrabold px-3 py-1.5 rounded-full shadow-inner transition-transform active:scale-95"
          title="Your Stars! Keep playing to collect more!"
        >
          <span className="text-xl animate-wiggle">⭐</span>
          <span className="text-base sm:text-lg">{profile.stars}</span>
        </button>

        {/* Badges Quick Nav */}
        <button
          onClick={() => setCurrentScreen('badges')}
          className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${
            currentScreen === 'badges'
              ? 'bg-purple-500 border-purple-600 text-white'
              : 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200'
          }`}
          title="Trophy Badges"
        >
          <Trophy className="w-5 h-5" />
        </button>

        {/* Avatar Dressing Room */}
        <button
          onClick={() => setCurrentScreen('avatar')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 transition-transform active:scale-95 ${
            currentScreen === 'avatar'
              ? 'bg-pink-500 border-pink-600 text-white'
              : 'bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200'
          }`}
          title="Dress up Avatar"
        >
          <div
            className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-xs overflow-hidden"
            style={{ backgroundColor: profile.avatar.skinColor }}
          >
            {profile.avatar.companionPet === 'puppy' ? '🐶' : profile.avatar.companionPet === 'kitten' ? '🐱' : '🧒'}
          </div>
          <span className="text-xs font-bold hidden sm:inline">{profile.name}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${
            profile.settings.soundEffects
              ? 'bg-sky-100 border-sky-300 text-sky-700 hover:bg-sky-200'
              : 'bg-gray-100 border-gray-300 text-gray-400'
          }`}
          title={profile.settings.soundEffects ? 'Sound On' : 'Sound Off'}
        >
          {profile.settings.soundEffects ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* Parent Protected Area */}
        <button
          onClick={() => setShowParentGate(true)}
          className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-full font-bold text-xs transition-transform active:scale-95"
          title="Parent Dashboard"
        >
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="hidden md:inline">Parents</span>
        </button>
      </div>

      {showParentGate && (
        <ParentGateModal
          onSuccess={() => {
            setShowParentGate(false);
            setCurrentScreen('parent-dashboard');
          }}
          onClose={() => setShowParentGate(false)}
        />
      )}
    </header>
  );
};

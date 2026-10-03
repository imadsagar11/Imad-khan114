import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Lock } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { AvatarConfig } from '../../types';

export const AvatarCustomizer: React.FC = () => {
  const { profile, updateAvatar, addStars, setCurrentScreen, showConfetti } = useGame();
  const [current, setCurrent] = useState<AvatarConfig>(profile.avatar);
  const [activeTab, setActiveTab] = useState<'skin' | 'hair' | 'outfit' | 'hat' | 'glasses' | 'pet'>('skin');

  const skinColors = ['#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#FED7AA', '#E2E8F0'];
  const hairColors = ['#78350F', '#1F2937', '#DC2626', '#D97706', '#9333EA', '#2563EB'];

  const outfits = [
    { id: 'adventurer', name: 'Explorer Vest', emoji: '🧭', cost: 0 },
    { id: 'superhero', name: 'Hero Cape', emoji: '🦸', cost: 20 },
    { id: 'astronaut', name: 'Space Suit', emoji: '👨‍🚀', cost: 30 },
    { id: 'dinosaur', name: 'Dino Hoodie', emoji: '🦖', cost: 25 },
    { id: 'rainbow', name: 'Rainbow Tee', emoji: '🌈', cost: 15 },
    { id: 'scientist', name: 'Lab Coat', emoji: '🥼', cost: 20 },
  ];

  const hats = [
    { id: 'none', name: 'No Hat', emoji: '❌', cost: 0 },
    { id: 'baseball', name: 'Cap', emoji: '🧢', cost: 0 },
    { id: 'crown', name: 'Gold Crown', emoji: '👑', cost: 40 },
    { id: 'wizard', name: 'Magic Hat', emoji: '🧙‍♂️', cost: 35 },
    { id: 'flower', name: 'Flower Crown', emoji: '🌸', cost: 20 },
    { id: 'astro-helm', name: 'Space Helmet', emoji: '🪖', cost: 30 },
  ];

  const glassesList = [
    { id: 'none', name: 'None', emoji: '❌', cost: 0 },
    { id: 'cool-shades', name: 'Cool Shades', emoji: '🕶️', cost: 15 },
    { id: 'circle', name: 'Smart Specs', emoji: '👓', cost: 10 },
    { id: 'star', name: 'Star Glasses', emoji: '⭐', cost: 25 },
  ];

  const pets = [
    { id: 'puppy', name: 'Playful Pup', emoji: '🐶', cost: 0 },
    { id: 'kitten', name: 'Fluffy Kitten', emoji: '🐱', cost: 15 },
    { id: 'baby-dragon', name: 'Baby Dragon', emoji: '🐲', cost: 50 },
    { id: 'robot', name: 'Mini Bot', emoji: '🤖', cost: 30 },
  ];

  const handleSelect = (category: keyof AvatarConfig, val: string, cost = 0) => {
    sound.playPop();
    const isUnlocked = cost === 0 || profile.unlockedItems.includes(`${category}-${val}`);

    if (!isUnlocked) {
      if (profile.stars >= cost) {
        // Unlock with stars
        sound.playSuccess();
        showConfetti();
        addStars(-cost);
        profile.unlockedItems.push(`${category}-${val}`);
        setCurrent((prev) => ({ ...prev, [category]: val }));
      } else {
        sound.playFriendlyBoing();
        sound.speak(`You need ${cost} stars to unlock this! Keep playing to earn stars! ⭐`);
      }
      return;
    }

    setCurrent((prev) => ({ ...prev, [category]: val }));
  };

  const handleSave = () => {
    updateAvatar(current);
    sound.playSuccess();
    showConfetti();
    setCurrentScreen('home');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm border-2 border-amber-200">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 p-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <h2 className="text-xl sm:text-2xl font-black text-amber-900 text-center">
          Dressing Room 🎨
        </h2>

        <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300 font-black text-amber-800 text-sm">
          <span>⭐</span>
          <span>{profile.stars}</span>
        </div>
      </div>

      {/* Main Wardrobe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Avatar Showcase Stage */}
        <div className="md:col-span-5 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 rounded-3xl p-6 border-4 border-white shadow-xl flex flex-col items-center justify-center relative min-h-[320px]">
          {/* Decorative Sparkles */}
          <div className="absolute top-4 left-4 text-2xl animate-spin" style={{ animationDuration: '8s' }}>
            ✨
          </div>
          <div className="absolute top-6 right-6 text-2xl animate-bounce-slow">
            🎈
          </div>

          {/* Interactive Character Display */}
          <div className="relative flex flex-col items-center my-4 animate-float">
            {/* Hat */}
            {current.hat !== 'none' && (
              <div className="text-4xl sm:text-5xl -mb-4 z-20 animate-wiggle">
                {hats.find((h) => h.id === current.hat)?.emoji}
              </div>
            )}

            {/* Head */}
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative overflow-hidden transition-all duration-300"
              style={{ backgroundColor: current.skinColor }}
            >
              {/* Hair */}
              <div
                className="absolute top-0 inset-x-0 h-10 rounded-t-full opacity-90"
                style={{ backgroundColor: current.hairColor }}
              />

              {/* Face Details */}
              <div className="relative flex flex-col items-center mt-3">
                {/* Eyes & Glasses */}
                <div className="flex items-center gap-5 text-xl font-black text-slate-800 relative">
                  {current.glasses !== 'none' ? (
                    <span className="text-2xl z-10">
                      {glassesList.find((g) => g.id === current.glasses)?.emoji}
                    </span>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-slate-900 rounded-full" />
                      <div className="w-3 h-3 bg-slate-900 rounded-full" />
                    </>
                  )}
                </div>
                {/* Cheeks */}
                <div className="flex items-center gap-7 mt-1">
                  <div className="w-2.5 h-1.5 bg-rose-400 rounded-full opacity-70" />
                  <div className="w-2.5 h-1.5 bg-rose-400 rounded-full opacity-70" />
                </div>
                {/* Cheerful Smile */}
                <div className="w-6 h-3 border-b-3 border-slate-900 rounded-b-full mt-1" />
              </div>
            </div>

            {/* Outfit Body */}
            <div className="text-4xl sm:text-5xl -mt-2 z-10">
              {outfits.find((o) => o.id === current.outfit)?.emoji}
            </div>

            {/* Companion Pet */}
            {current.companionPet !== 'none' && (
              <div className="absolute -right-10 bottom-2 text-3xl sm:text-4xl animate-bounce-slow">
                {pets.find((p) => p.id === current.companionPet)?.emoji}
              </div>
            )}
          </div>

          <div className="mt-3 text-center">
            <span className="font-extrabold text-amber-900 text-lg">{profile.name}</span>
            <p className="text-xs text-amber-700 font-medium">Ready for big learning adventures!</p>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg border-b-4 border-green-700 active:translate-y-1 transition flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Wear This Outfit!</span>
          </button>
        </div>

        {/* Right: Customization Panels */}
        <div className="md:col-span-7 bg-white rounded-3xl p-5 shadow-lg border-2 border-amber-200 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b pb-3">
            {[
              { id: 'skin', label: 'Skin', icon: '🎨' },
              { id: 'hair', label: 'Hair', icon: '💇' },
              { id: 'outfit', label: 'Clothes', icon: '👕' },
              { id: 'hat', label: 'Hats', icon: '🧢' },
              { id: 'glasses', label: 'Glasses', icon: '👓' },
              { id: 'pet', label: 'Pet Buddy', icon: '🐾' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPop();
                  setActiveTab(tab.id as unknown as typeof activeTab);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-amber-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Skin Tone Selector */}
          {activeTab === 'skin' && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Choose Skin Tone</p>
              <div className="flex flex-wrap gap-3">
                {skinColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSelect('skinColor', color)}
                    className={`w-12 h-12 rounded-2xl border-4 transition-transform ${
                      current.skinColor === color ? 'border-amber-500 scale-110 shadow-md ring-2 ring-amber-300' : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Hair Color Selector */}
          {activeTab === 'hair' && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Choose Hair Color</p>
              <div className="flex flex-wrap gap-3">
                {hairColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSelect('hairColor', color)}
                    className={`w-12 h-12 rounded-2xl border-4 transition-transform ${
                      current.hairColor === color ? 'border-amber-500 scale-110 shadow-md ring-2 ring-amber-300' : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Outfits Selector */}
          {activeTab === 'outfit' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {outfits.map((item) => {
                const unlocked = item.cost === 0 || profile.unlockedItems.includes(`outfit-${item.id}`);
                const isSelected = current.outfit === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect('outfit', item.id, item.cost)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    {!unlocked && (
                      <span className="mt-1 flex items-center gap-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" /> {item.cost} ⭐
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Hats Selector */}
          {activeTab === 'hat' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hats.map((item) => {
                const unlocked = item.cost === 0 || profile.unlockedItems.includes(`hat-${item.id}`);
                const isSelected = current.hat === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect('hat', item.id, item.cost)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    {!unlocked && (
                      <span className="mt-1 flex items-center gap-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" /> {item.cost} ⭐
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Glasses Selector */}
          {activeTab === 'glasses' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {glassesList.map((item) => {
                const unlocked = item.cost === 0 || profile.unlockedItems.includes(`glasses-${item.id}`);
                const isSelected = current.glasses === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect('glasses', item.id, item.cost)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    {!unlocked && (
                      <span className="mt-1 flex items-center gap-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" /> {item.cost} ⭐
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Pets Selector */}
          {activeTab === 'pet' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pets.map((item) => {
                const unlocked = item.cost === 0 || profile.unlockedItems.includes(`companionPet-${item.id}`);
                const isSelected = current.companionPet === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect('companionPet', item.id, item.cost)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    {!unlocked && (
                      <span className="mt-1 flex items-center gap-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" /> {item.cost} ⭐
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

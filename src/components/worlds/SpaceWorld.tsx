import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Rocket, RefreshCw, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PLANETS_DATA } from '../../data/learningData';
import { sound } from '../../utils/audio';
import { PlanetItem } from '../../types';

export const SpaceWorld: React.FC = () => {
  const { addStars, completeActivity, showConfetti, setMascot } = useGame();
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetItem>(PLANETS_DATA[3]); // Earth default
  const [mode, setMode] = useState<'planets' | 'rocket-game'>('planets');

  // Rocket Game State
  const [rocketPos, setRocketPos] = useState<number>(50); // percentage 10% to 90%
  const [starsCollected, setStarsCollected] = useState<number>(0);
  const [fallingStars, setFallingStars] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isFlying, setIsFlying] = useState<boolean>(false);

  const handleSelectPlanet = (planet: PlanetItem) => {
    sound.playPop();
    setSelectedPlanet(planet);
    setMode('planets');
    sound.speak(`${planet.name}. ${planet.funFact}`);
    setMascot(`${planet.name} (${planet.urduName}): ${planet.funFact}`, 'talking');
  };

  const startRocketGame = () => {
    sound.playRocketWhoosh();
    setMode('rocket-game');
    setIsFlying(true);
    setStarsCollected(0);
    setRocketPos(50);
    setFallingStars([
      { id: 1, x: 25, y: 15 },
      { id: 2, x: 75, y: 35 },
      { id: 3, x: 50, y: 60 },
    ]);
    sound.speak("Blast off! Steer your rocket and collect the sparkling stars!");
    setMascot("Blast off! Use the buttons to steer the rocket and catch stars! 🚀", 'cheering');
  };

  // Rocket Game Animation Loop
  useEffect(() => {
    if (!isFlying || mode !== 'rocket-game') return;

    const interval = setInterval(() => {
      setFallingStars((prev) => {
        return prev.map((s) => {
          let nextY = s.y + 3;
          let nextX = s.x;

          // Check collision with rocket at bottom (y ~ 80-90)
          if (nextY >= 75 && nextY <= 88 && Math.abs(nextX - rocketPos) < 18) {
            sound.playStarDing();
            setStarsCollected((c) => {
              const updated = c + 1;
              if (updated % 5 === 0) {
                addStars(5, 'Space Rocket Star Collector');
                completeActivity('rocket-flight', 'space');
              }
              return updated;
            });
            nextY = 0;
            nextX = Math.floor(Math.random() * 80) + 10;
          }

          if (nextY > 100) {
            nextY = 0;
            nextX = Math.floor(Math.random() * 80) + 10;
          }

          return { ...s, x: nextX, y: nextY };
        });
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isFlying, rocketPos, mode]);

  const moveLeft = () => {
    setRocketPos((prev) => Math.max(15, prev - 15));
    sound.playPop();
  };

  const moveRight = () => {
    setRocketPos((prev) => Math.min(85, prev + 15));
    sound.playPop();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
            <span>🚀 Space Adventure</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold">
            Explore the Solar System, planets & fly your cosmic rocket!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setMode('planets');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'planets' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Solar System
          </button>
          <button
            onClick={startRocketGame}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'rocket-game' ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Fly Rocket 🚀
          </button>
        </div>
      </div>

      {/* Mode 1: Planets Explorer */}
      {mode === 'planets' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Active Planet Showcase */}
          <div className="md:col-span-6 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-indigo-400/40 flex flex-col items-center text-center relative overflow-hidden">
            {/* Background stars */}
            <div className="absolute inset-0 opacity-40 pointer-events-none text-xs">
              <span className="absolute top-4 left-6">✨</span>
              <span className="absolute top-12 right-10">⭐</span>
              <span className="absolute bottom-8 left-12">🌟</span>
              <span className="absolute bottom-16 right-8">✨</span>
            </div>

            <button
              onClick={() => sound.speak(`${selectedPlanet.name}. ${selectedPlanet.funFact}`)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
              title="Hear Planet Info"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Planet Body */}
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white/40 shadow-2xl flex items-center justify-center text-7xl sm:text-8xl my-3 animate-float relative z-10"
              style={{ backgroundColor: selectedPlanet.color }}
            >
              {selectedPlanet.emoji}
            </div>

            {/* Names */}
            <div className="mt-2 relative z-10">
              <h3 className="text-3xl font-black text-amber-300">{selectedPlanet.name}</h3>
              <p className="text-lg font-urdu font-bold text-sky-300">{selectedPlanet.urduName}</p>
              <span className="inline-block mt-1 text-[11px] font-bold text-indigo-200 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-400/30">
                {selectedPlanet.distanceInfo}
              </span>
            </div>

            {/* Fun Fact */}
            <div className="mt-4 w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-left space-y-2 relative z-10">
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                🚀 {selectedPlanet.funFact}
              </p>
              <p className="text-xs font-urdu text-amber-200 font-semibold text-right leading-relaxed">
                {selectedPlanet.funFactUrdu}
              </p>
            </div>
          </div>

          {/* Planets Grid */}
          <div className="md:col-span-6 bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-600 uppercase tracking-wider mb-3">
              Explore Celestial Bodies:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLANETS_DATA.map((planet) => {
                const isSelected = selectedPlanet.id === planet.id;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handleSelectPlanet(planet)}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 shadow-md scale-105 ring-2 ring-indigo-200'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-4xl mb-1">{planet.emoji}</span>
                    <span className="text-xs font-black text-slate-800">{planet.name}</span>
                    <span className="text-[11px] font-urdu text-indigo-700 font-bold">{planet.urduName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Rocket Pilot Mini Game */}
      {mode === 'rocket-game' && (
        <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 bg-amber-900/50 px-3 py-1 rounded-full border border-amber-500/30">
                Cosmic Flight
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1">Steer Rocket & Catch Stars! ⭐</h3>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 font-black text-amber-300 text-lg">
              <span>⭐</span>
              <span>{starsCollected}</span>
            </div>
          </div>

          {/* Game Canvas / Starfield Area */}
          <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-slate-950 border-3 border-indigo-400/30 overflow-hidden shadow-inner">
            {/* Twinkling background dots */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 text-xs">✨</div>
              <div className="absolute top-20 right-20 text-xs">✨</div>
              <div className="absolute bottom-20 left-32 text-xs">✨</div>
              <div className="absolute top-44 left-60 text-xs">✨</div>
            </div>

            {/* Falling Stars */}
            {fallingStars.map((s) => (
              <div
                key={s.id}
                className="absolute text-3xl sm:text-4xl transition-all duration-75 select-none pointer-events-none drop-shadow"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                ⭐
              </div>
            ))}

            {/* The Rocket Player */}
            <div
              className="absolute text-5xl sm:text-6xl transition-all duration-150 select-none bottom-4"
              style={{
                left: `${rocketPos}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="relative flex flex-col items-center animate-wiggle">
                <span>🚀</span>
                {/* Flame */}
                <span className="text-xs -mt-1 animate-pulse">🔥</span>
              </div>
            </div>
          </div>

          {/* Tactile Big Left/Right Controller Buttons */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={moveLeft}
              className="flex-1 max-w-[180px] py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg border-b-4 border-indigo-900 active:translate-y-1 transition"
            >
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
              <span>Left</span>
            </button>

            <button
              onClick={moveRight}
              className="flex-1 max-w-[180px] py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg border-b-4 border-indigo-900 active:translate-y-1 transition"
            >
              <span>Right</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

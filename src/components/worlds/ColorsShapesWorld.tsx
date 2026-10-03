import React, { useState } from 'react';
import { Volume2, Sparkles, RefreshCw, Trophy, Blend } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { COLORS_DATA, SHAPES_DATA } from '../../data/learningData';
import { sound } from '../../utils/audio';

export const ColorsShapesWorld: React.FC = () => {
  const { addStars, completeActivity, showConfetti, setMascot } = useGame();
  const [activeTab, setActiveTab] = useState<'explore' | 'find-game' | 'mixer'>('explore');

  // "Find the Color & Shape" Game State
  const [targetColor, setTargetColor] = useState(COLORS_DATA[0]);
  const [targetShape, setTargetShape] = useState(SHAPES_DATA[0]);
  const [gameGrid, setGameGrid] = useState<Array<{ color: typeof COLORS_DATA[0]; shape: typeof SHAPES_DATA[0]; isTarget: boolean }>>([]);

  // Color Mixer State
  const [mixA, setMixA] = useState<'red' | 'blue' | 'yellow'>('red');
  const [mixB, setMixB] = useState<'red' | 'blue' | 'yellow'>('yellow');

  const startFindGame = () => {
    sound.playPop();
    const c = COLORS_DATA[Math.floor(Math.random() * 4)]; // primary/popular
    const s = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
    setTargetColor(c);
    setTargetShape(s);

    // Create 6 grid cards, 1 is the exact match
    const items = [
      { color: c, shape: s, isTarget: true },
      { color: COLORS_DATA.find((x) => x.id !== c.id) || c, shape: s, isTarget: false },
      { color: c, shape: SHAPES_DATA.find((x) => x.id !== s.id) || s, isTarget: false },
      { color: COLORS_DATA[(COLORS_DATA.indexOf(c) + 2) % COLORS_DATA.length], shape: s, isTarget: false },
      { color: c, shape: SHAPES_DATA[(SHAPES_DATA.indexOf(s) + 2) % SHAPES_DATA.length], isTarget: false },
      {
        color: COLORS_DATA[(COLORS_DATA.indexOf(c) + 1) % COLORS_DATA.length],
        shape: SHAPES_DATA[(SHAPES_DATA.indexOf(s) + 1) % SHAPES_DATA.length],
        isTarget: false,
      },
    ].sort(() => 0.5 - Math.random());

    setGameGrid(items);
    setActiveTab('find-game');
    sound.speak(`Find the ${c.name} ${s.name}!`);
    setMascot(`Tap the "${c.name} ${s.name}" (${c.urduName} ${s.urduName})! 🎨`, 'happy');
  };

  const handleGameSelect = (isTarget: boolean, cName: string, sName: string) => {
    if (isTarget) {
      sound.playSuccess();
      showConfetti();
      addStars(5, `${targetColor.name} ${targetShape.name}`);
      completeActivity(`shape-${targetShape.id}`, 'colors');
      setMascot(`Terrific! You found the ${targetColor.name} ${targetShape.name}! ⭐`, 'cheering');
      setTimeout(() => {
        startFindGame();
      }, 1500);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`That's a ${cName} ${sName}. Let's find the ${targetColor.name} ${targetShape.name}!`);
    }
  };

  const renderShapeSvg = (shapeId: string, fillColor: string) => {
    switch (shapeId) {
      case 'circle':
        return <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-md" style={{ backgroundColor: fillColor }} />;
      case 'square':
        return <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-md" style={{ backgroundColor: fillColor }} />;
      case 'triangle':
        return (
          <div
            className="w-0 h-0 border-l-[36px] border-l-transparent border-r-[36px] border-r-transparent border-b-[60px]"
            style={{ borderBottomColor: fillColor }}
          />
        );
      case 'star':
        return (
          <span className="text-6xl drop-shadow" style={{ color: fillColor }}>
            ★
          </span>
        );
      case 'heart':
        return (
          <span className="text-6xl drop-shadow" style={{ color: fillColor }}>
            ♥
          </span>
        );
      case 'rectangle':
        return <div className="w-24 h-14 rounded-2xl shadow-md" style={{ backgroundColor: fillColor }} />;
      default:
        return <div className="w-16 h-16 rounded-full" style={{ backgroundColor: fillColor }} />;
    }
  };

  // Color Mixer Result
  const getMixResult = () => {
    if (mixA === mixB) {
      return { name: mixA === 'red' ? 'Red' : mixA === 'blue' ? 'Blue' : 'Yellow', hex: mixA === 'red' ? '#EF4444' : mixA === 'blue' ? '#3B82F6' : '#EAB308' };
    }
    if ((mixA === 'red' && mixB === 'yellow') || (mixA === 'yellow' && mixB === 'red')) {
      return { name: 'Orange 🍊', hex: '#F97316' };
    }
    if ((mixA === 'blue' && mixB === 'yellow') || (mixA === 'yellow' && mixB === 'blue')) {
      return { name: 'Green 🌿', hex: '#22C55E' };
    }
    if ((mixA === 'red' && mixB === 'blue') || (mixA === 'blue' && mixB === 'red')) {
      return { name: 'Purple 🍇', hex: '#9333EA' };
    }
    return { name: 'Magic Mix', hex: '#EC4899' };
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-pink-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-pink-600 flex items-center gap-2">
            <span>🎨 Colors & Shapes</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Recognize bright rainbow colors, geometric shapes, and mix colors!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('explore');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'explore' ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Explore
          </button>
          <button
            onClick={startFindGame}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'find-game' ? 'bg-amber-400 text-amber-950 shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Find Shape Game 🔍
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('mixer');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'mixer' ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Color Mixer 🧪
          </button>
        </div>
      </div>

      {/* Mode 1: Explore Gallery */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Colors Shelf */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
            <h3 className="text-base font-extrabold text-slate-700 mb-4 flex items-center gap-2">
              <span>Rainbow Colors:</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COLORS_DATA.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${c.name}. In Urdu, ${c.urduName}`);
                  }}
                  className="p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-300 shadow-sm flex items-center gap-3 transition hover:scale-105 active:scale-95 text-left"
                >
                  <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                  <div>
                    <span className="font-black text-slate-800 text-base">{c.name}</span>
                    <p className="text-xs font-urdu text-slate-500 font-bold">{c.urduName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shapes Shelf */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
            <h3 className="text-base font-extrabold text-slate-700 mb-4 flex items-center gap-2">
              <span>Geometric Shapes:</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SHAPES_DATA.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${s.name}. Shape ${s.name}`);
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-100 hover:border-slate-300 shadow-sm flex flex-col items-center justify-center gap-3 transition hover:scale-105 active:scale-95"
                >
                  {renderShapeSvg(s.id, s.hex)}
                  <div className="text-center">
                    <span className="font-black text-slate-800 text-base">{s.name}</span>
                    <p className="text-xs font-urdu text-slate-500 font-bold">{s.urduName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: "Find the RED circle" Game */}
      {activeTab === 'find-game' && (
        <div className="bg-gradient-to-b from-sky-50 to-pink-50 rounded-3xl p-6 sm:p-10 border-4 border-pink-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              Shape & Color Detective
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Find the <span className="underline decoration-pink-500">{targetColor.name} {targetShape.name}</span>!
            </h3>
            <p className="text-xs font-urdu text-pink-700 font-bold mt-1">
              {targetColor.urduName} {targetShape.urduName} تلاش کریں!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto">
            {gameGrid.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleGameSelect(item.isTarget, item.color.name, item.shape.name)}
                className="aspect-square bg-white rounded-3xl border-4 border-slate-200 hover:border-pink-400 shadow-md flex items-center justify-center p-4 transition-all hover:scale-105 active:scale-95"
              >
                {renderShapeSvg(item.shape.id, item.color.hex)}
              </button>
            ))}
          </div>

          <button
            onClick={startFindGame}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Next Mystery Shape</span>
          </button>
        </div>
      )}

      {/* Mode 3: Magic Color Mixer */}
      {activeTab === 'mixer' && (
        <div className="bg-gradient-to-b from-purple-50 via-white to-pink-50 rounded-3xl p-6 sm:p-10 border-4 border-purple-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Magic Science Lab 🧪
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Mix Two Colors to Create a New One!
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-xl mx-auto py-4">
            {/* Color A Dropper */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-3xl shadow-lg border-4 border-white flex items-center justify-center text-3xl cursor-pointer"
                style={{ backgroundColor: mixA === 'red' ? '#EF4444' : mixA === 'blue' ? '#3B82F6' : '#EAB308' }}
              >
                🧪
              </div>
              <div className="flex gap-1 mt-3">
                {(['red', 'yellow', 'blue'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      sound.playPop();
                      setMixA(c);
                    }}
                    className={`w-6 h-6 rounded-full border-2 ${mixA === c ? 'border-black ring-2' : 'border-white'}`}
                    style={{ backgroundColor: c === 'red' ? '#EF4444' : c === 'blue' ? '#3B82F6' : '#EAB308' }}
                  />
                ))}
              </div>
            </div>

            <span className="text-4xl font-black text-purple-400">+</span>

            {/* Color B Dropper */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-3xl shadow-lg border-4 border-white flex items-center justify-center text-3xl cursor-pointer"
                style={{ backgroundColor: mixB === 'red' ? '#EF4444' : mixB === 'blue' ? '#3B82F6' : '#EAB308' }}
              >
                🧪
              </div>
              <div className="flex gap-1 mt-3">
                {(['red', 'yellow', 'blue'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      sound.playPop();
                      setMixB(c);
                    }}
                    className={`w-6 h-6 rounded-full border-2 ${mixB === c ? 'border-black ring-2' : 'border-white'}`}
                    style={{ backgroundColor: c === 'red' ? '#EF4444' : c === 'blue' ? '#3B82F6' : '#EAB308' }}
                  />
                ))}
              </div>
            </div>

            <span className="text-4xl font-black text-purple-400">=</span>

            {/* Result Flask */}
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center text-4xl animate-bounce-slow"
                style={{ backgroundColor: getMixResult().hex }}
              >
                ✨
              </div>
              <span className="mt-2 text-lg font-black text-slate-800">{getMixResult().name}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSuccess();
              showConfetti();
              addStars(5, 'Magic Color Mixing');
              completeActivity('color-mix', 'colors');
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-lg transition active:scale-95"
          >
            I Discovered This Color! ⭐
          </button>
        </div>
      )}
    </div>
  );
};

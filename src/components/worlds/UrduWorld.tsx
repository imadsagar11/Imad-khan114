import React, { useState } from 'react';
import { Volume2, Sparkles, PenTool, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { URDU_DATA } from '../../data/learningData';
import { TracingCanvas } from '../common/TracingCanvas';
import { sound } from '../../utils/audio';
import { UrduLetter } from '../../types';

export const UrduWorld: React.FC = () => {
  const { addStars, completeActivity, showConfetti, setMascot } = useGame();
  const [selectedLetter, setSelectedLetter] = useState<UrduLetter>(URDU_DATA[0]);
  const [mode, setMode] = useState<'learn' | 'trace' | 'game'>('learn');

  // Game state: Find the Urdu Letter
  const [targetLetter, setTargetLetter] = useState<UrduLetter>(URDU_DATA[0]);
  const [gameOptions, setGameOptions] = useState<UrduLetter[]>([]);

  const handleSelect = (item: UrduLetter) => {
    sound.playPop();
    setSelectedLetter(item);
    setMode('learn');
    sound.speak(`${item.name}. ${item.letter} se ${item.word}`, { lang: 'ur-PK' });
    setMascot(`${item.name}! ${item.letter} سے ${item.word} (${item.englishMeaning})`, 'talking', true, 'ur-PK');
  };

  const startUrduGame = () => {
    sound.playPop();
    const target = URDU_DATA[Math.floor(Math.random() * URDU_DATA.length)];
    const others = URDU_DATA.filter((l) => l.letter !== target.letter);
    const shuffled = [target, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)].sort(() => 0.5 - Math.random());

    setTargetLetter(target);
    setGameOptions(shuffled);
    setMode('game');

    sound.speak(`حرف ${target.name} تلاش کریں!`, { lang: 'ur-PK' });
    setMascot(`حرف "${target.name}" (${target.transliteration}) تلاش کریں! 🇵🇰`, 'happy', true, 'ur-PK');
  };

  const handleGameAnswer = (chosen: UrduLetter) => {
    if (chosen.letter === targetLetter.letter) {
      sound.playSuccess();
      showConfetti();
      addStars(5, `Urdu Letter ${targetLetter.name}`);
      completeActivity(`urdu-${targetLetter.letter}`, 'urdu');
      setMascot(`شاباش! بہت خوب! یہ ${targetLetter.name} ہے! ⭐`, 'cheering', true, 'ur-PK');
      setTimeout(() => {
        startUrduGame();
      }, 1500);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`یہ ${chosen.name} ہے۔ دوبارہ کوشش کریں!`, { lang: 'ur-PK' });
      setMascot(`یہ ${chosen.name} ہے، ${targetLetter.name} تلاش کریں!`, 'talking');
    }
  };

  const handleTracingComplete = () => {
    addStars(10, `Tracing Urdu ${selectedLetter.name}`);
    completeActivity(`urdu-trace-${selectedLetter.letter}`, 'urdu');
    showConfetti();
    setMascot(`بہت اچھے! آپ نے ${selectedLetter.name} خوبصورت لکھا! 🌟`, 'cheering', true, 'ur-PK');
    setMode('learn');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-emerald-300 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-700 flex items-center gap-2">
            <span>🇵🇰 اردو لرننگ (Urdu Learning)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold font-urdu">
            حروفِ تہجی، تلفظ، ٹریسنگ اور دلچسپ کھیل
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setMode('learn');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'learn' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            حروفِ تہجی
          </button>
          <button
            onClick={startUrduGame}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'game' ? 'bg-amber-400 text-amber-950 shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            حرف تلاش کریں 🎈
          </button>
        </div>
      </div>

      {/* Mode 1: Learn Alphabet */}
      {mode === 'learn' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Active Urdu Letter Showcase Card */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 shadow-lg border-4 border-emerald-300 flex flex-col items-center text-center relative">
            <button
              onClick={() => sound.speak(`${selectedLetter.name}. ${selectedLetter.letter} se ${selectedLetter.word}`, { lang: 'ur-PK' })}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
              title="آواز سنیں"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Urdu Letter Big Display */}
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl flex items-center justify-center text-7xl sm:text-8xl font-black text-white shadow-xl my-2 animate-bounce-slow font-urdu"
              style={{ backgroundColor: selectedLetter.color }}
            >
              {selectedLetter.letter}
            </div>

            {/* Letter Name & Transliteration */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl font-black text-emerald-800 font-urdu">{selectedLetter.name}</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                ({selectedLetter.transliteration})
              </span>
            </div>

            {/* Urdu Word & Meaning */}
            <div className="mt-4 flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-200">
              <span className="text-5xl">{selectedLetter.emoji}</span>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-900 font-urdu">{selectedLetter.word}</span>
                <p className="text-xs text-slate-600 font-semibold">{selectedLetter.englishMeaning}</p>
              </div>
            </div>

            {/* Practice Tracing Button */}
            <button
              onClick={() => {
                sound.playPop();
                setMode('trace');
              }}
              className="mt-6 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base rounded-2xl shadow-lg border-b-4 border-emerald-800 active:translate-y-1 transition flex items-center justify-center gap-2 font-urdu"
            >
              <PenTool className="w-5 h-5" />
              <span>حرف {selectedLetter.letter} کو ٹریس کریں!</span>
            </button>
          </div>

          {/* Urdu Letters Grid */}
          <div className="md:col-span-6 bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200" dir="rtl">
            <h3 className="text-sm font-extrabold text-slate-600 uppercase tracking-wider mb-3 font-urdu">
              حرف منتخب کریں:
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {URDU_DATA.map((item) => {
                const isSelected = selectedLetter.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    onClick={() => handleSelect(item)}
                    className={`aspect-square rounded-2xl font-black text-2xl sm:text-3xl transition active:scale-90 flex flex-col items-center justify-center font-urdu ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-lg scale-105 ring-4 ring-emerald-200'
                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-800'
                    }`}
                  >
                    <span>{item.letter}</span>
                    <span className="text-[10px] opacity-80 -mt-1 font-sans">{item.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Urdu Letter Tracing */}
      {mode === 'trace' && (
        <div className="space-y-4">
          <button
            onClick={() => setMode('learn')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>واپس (Back)</span>
          </button>

          <TracingCanvas
            letter={selectedLetter.letter}
            guideText={`حرف "${selectedLetter.letter}" کے اوپر انگلی سے لکیر کھینچیں!`}
            isUrdu={true}
            color={selectedLetter.color}
            onComplete={handleTracingComplete}
          />
        </div>
      )}

      {/* Mode 3: Urdu Find the Letter Game */}
      {mode === 'game' && (
        <div className="bg-gradient-to-b from-emerald-50 to-teal-100 rounded-3xl p-6 sm:p-10 border-4 border-emerald-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full font-urdu">
              حرف کی تلاش
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 font-urdu">
              حرف <span className="text-emerald-600 text-4xl">{targetLetter.name}</span> ({targetLetter.letter}) تلاش کریں!
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto" dir="rtl">
            {gameOptions.map((opt) => (
              <button
                key={opt.letter}
                onClick={() => handleGameAnswer(opt)}
                className="aspect-square rounded-3xl bg-white border-4 border-emerald-200 hover:border-amber-400 shadow-lg text-5xl sm:text-6xl font-black text-slate-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-float font-urdu"
              >
                {opt.letter}
              </button>
            ))}
          </div>

          <button
            onClick={startUrduGame}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>اگلا حرف (Next)</span>
          </button>
        </div>
      )}
    </div>
  );
};

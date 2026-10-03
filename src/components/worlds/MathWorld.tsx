import React, { useState } from 'react';
import { Volume2, Sparkles, RefreshCw, Trophy, ArrowRight, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

export const MathWorld: React.FC = () => {
  const { addStars, completeActivity, showConfetti, setMascot } = useGame();
  const [activeTab, setActiveTab] = useState<'count' | 'addition' | 'subtraction' | 'compare'>('count');

  // Interactive Counting State
  const [targetCount, setTargetCount] = useState<number>(5);
  const [countedItems, setCountedItems] = useState<number[]>([]);

  // Addition & Subtraction States
  const [addNum1, setAddNum1] = useState(2);
  const [addNum2, setAddNum2] = useState(3);
  const [addFruit] = useState('🍎');

  const [subNum1, setSubNum1] = useState(5);
  const [subNum2, setSubNum2] = useState(2);
  const [subFruit] = useState('🍌');

  // Compare States
  const [compA, setCompA] = useState(6);
  const [compB, setCompB] = useState(3);

  // Counting Activity handlers
  const handleItemTap = (idx: number) => {
    sound.playPop();
    if (!countedItems.includes(idx)) {
      const nextCount = countedItems.length + 1;
      setCountedItems([...countedItems, idx]);
      sound.speak(nextCount.toString());

      if (nextCount === targetCount) {
        sound.playSuccess();
        showConfetti();
        addStars(5, `Counting to ${targetCount}`);
        completeActivity(`count-${targetCount}`, 'math');
        setMascot(`Awesome! You counted all ${targetCount} juicy apples! 🍎`, 'cheering');
      }
    }
  };

  const nextCountLevel = () => {
    sound.playPop();
    const next = targetCount >= 10 ? 3 : targetCount + 1;
    setTargetCount(next);
    setCountedItems([]);
    sound.speak(`Count ${next} items! Tap each one!`);
  };

  // Addition activity handlers
  const handleAdditionAnswer = (ans: number) => {
    const correct = addNum1 + addNum2;
    if (ans === correct) {
      sound.playSuccess();
      showConfetti();
      addStars(5, `Addition ${addNum1} + ${addNum2}`);
      completeActivity(`add-${addNum1}-${addNum2}`, 'math');
      setMascot(`Hooray! ${addNum1} + ${addNum2} is equal to ${correct}! 🎉`, 'cheering');
      setTimeout(() => {
        setAddNum1(Math.floor(Math.random() * 4) + 1);
        setAddNum2(Math.floor(Math.random() * 4) + 1);
      }, 1500);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`Not quite! Let's count them together!`);
      setMascot(`Count all the apples together on the screen! You can do it! 😊`, 'talking');
    }
  };

  // Subtraction activity handlers
  const handleSubtractionAnswer = (ans: number) => {
    const correct = subNum1 - subNum2;
    if (ans === correct) {
      sound.playSuccess();
      showConfetti();
      addStars(5, `Subtraction ${subNum1} - ${subNum2}`);
      completeActivity(`sub-${subNum1}-${subNum2}`, 'math');
      setMascot(`Terrific! ${subNum1} take away ${subNum2} leaves ${correct}! ⭐`, 'cheering');
      setTimeout(() => {
        const n1 = Math.floor(Math.random() * 5) + 3;
        const n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
        setSubNum1(n1);
        setSubNum2(n2);
      }, 1500);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`Count how many bananas are left!`);
    }
  };

  // Comparison handler
  const handleCompareAnswer = (choice: 'A' | 'B') => {
    const isCorrect = (choice === 'A' && compA > compB) || (choice === 'B' && compB > compA);
    if (isCorrect) {
      sound.playSuccess();
      showConfetti();
      addStars(5, 'Bigger Number Match');
      completeActivity('compare-numbers', 'math');
      setMascot(`Spot on! That is the bigger number! 🌟`, 'cheering');
      setTimeout(() => {
        let a = Math.floor(Math.random() * 9) + 1;
        let b = Math.floor(Math.random() * 9) + 1;
        while (a === b) b = Math.floor(Math.random() * 9) + 1;
        setCompA(a);
        setCompB(b);
      }, 1500);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`Look which group has more!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-emerald-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-600 flex items-center gap-2">
            <span>🔢 Math Land</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Count, add, subtract & discover numbers with yummy fruits!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'count', label: '🍎 Count & Tap' },
            { id: 'addition', label: '➕ Plus (+)' },
            { id: 'subtraction', label: '➖ Minus (-)' },
            { id: 'compare', label: '⚖️ Bigger/Smaller' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(tab.id as unknown as typeof activeTab);
              }}
              className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE COUNTING */}
      {activeTab === 'count' && (
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800 bg-amber-200 px-3 py-1 rounded-full">
              Count With Finger
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Tap each apple to count to <span className="text-rose-500 text-4xl">{targetCount}</span>!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Counted: <strong className="text-emerald-600 text-lg">{countedItems.length}</strong> / {targetCount}
            </p>
          </div>

          {/* Fruit Orchard to Tap */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 max-w-xl mx-auto py-4">
            {Array.from({ length: targetCount }).map((_, idx) => {
              const isTapped = countedItems.includes(idx);
              const tapIndex = countedItems.indexOf(idx) + 1;

              return (
                <button
                  key={idx}
                  onClick={() => handleItemTap(idx)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center justify-center relative ${
                    isTapped
                      ? 'bg-emerald-100 border-emerald-400 scale-105 shadow-md'
                      : 'bg-white border-amber-300 hover:border-amber-400 shadow-lg hover:scale-105 active:scale-95 animate-bounce-slow'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl">{addFruit}</span>
                  {isTapped && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white w-7 h-7 rounded-full text-sm font-black flex items-center justify-center shadow">
                      {tapIndex}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                sound.playPop();
                setCountedItems([]);
              }}
              className="px-4 py-2 bg-white rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs"
            >
              Reset Counting
            </button>
            <button
              onClick={nextCountLevel}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-2xl font-black text-sm shadow flex items-center gap-1.5 transition active:scale-95"
            >
              <span>Next Number!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL ADDITION */}
      {activeTab === 'addition' && (
        <div className="bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl p-6 sm:p-10 border-4 border-sky-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-sky-800 bg-sky-200 px-3 py-1 rounded-full">
              Fruit Addition
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              How many apples in total?
            </h3>
          </div>

          {/* Visual Equation */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm max-w-xl mx-auto">
            {/* Group 1 */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 text-3xl sm:text-4xl">
                {Array.from({ length: addNum1 }).map((_, i) => (
                  <span key={i}>🍎</span>
                ))}
              </div>
              <span className="text-2xl font-black text-slate-800 mt-2">{addNum1}</span>
            </div>

            <span className="text-4xl font-black text-sky-500">+</span>

            {/* Group 2 */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 text-3xl sm:text-4xl">
                {Array.from({ length: addNum2 }).map((_, i) => (
                  <span key={i}>🍎</span>
                ))}
              </div>
              <span className="text-2xl font-black text-slate-800 mt-2">{addNum2}</span>
            </div>

            <span className="text-4xl font-black text-sky-500">=</span>

            {/* Question Mark Box */}
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-3 border-amber-300 flex items-center justify-center text-3xl font-black text-amber-700 animate-pulse">
              ?
            </div>
          </div>

          {/* Options to choose */}
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-500 mb-3">Choose the correct answer:</p>
            <div className="flex justify-center gap-3 sm:gap-4">
              {Array.from(new Set([addNum1 + addNum2, addNum1 + addNum2 + 1, Math.max(1, addNum1 + addNum2 - 1)]))
                .sort(() => 0.5 - Math.random())
                .map((ans) => (
                  <button
                    key={ans}
                    onClick={() => handleAdditionAnswer(ans)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border-4 border-sky-300 hover:border-emerald-400 text-3xl sm:text-4xl font-black text-slate-800 shadow-md hover:scale-105 active:scale-95 transition"
                  >
                    {ans}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VISUAL SUBTRACTION */}
      {activeTab === 'subtraction' && (
        <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl p-6 sm:p-10 border-4 border-purple-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-800 bg-purple-200 px-3 py-1 rounded-full">
              Banana Subtraction
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Take away <span className="text-rose-500">{subNum2}</span> bananas! How many left?
            </h3>
          </div>

          {/* Visual Equation */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="flex gap-1 text-3xl sm:text-4xl flex-wrap justify-center">
                {Array.from({ length: subNum1 }).map((_, i) => (
                  <span key={i} className={i >= subNum1 - subNum2 ? 'opacity-30 line-through' : ''}>
                    🍌
                  </span>
                ))}
              </div>
              <span className="text-xl font-black text-slate-800 mt-2">
                {subNum1} - {subNum2}
              </span>
            </div>

            <span className="text-4xl font-black text-purple-500">=</span>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-3 border-amber-300 flex items-center justify-center text-3xl font-black text-amber-700 animate-pulse">
              ?
            </div>
          </div>

          {/* Options */}
          <div>
            <p className="text-xs font-extrabold uppercase text-slate-500 mb-3">Pick the right number:</p>
            <div className="flex justify-center gap-3 sm:gap-4">
              {Array.from(new Set([subNum1 - subNum2, subNum1 - subNum2 + 1, Math.max(0, subNum1 - subNum2 - 1)]))
                .sort(() => 0.5 - Math.random())
                .map((ans) => (
                  <button
                    key={ans}
                    onClick={() => handleSubtractionAnswer(ans)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border-4 border-purple-300 hover:border-emerald-400 text-3xl sm:text-4xl font-black text-slate-800 shadow-md hover:scale-105 active:scale-95 transition"
                  >
                    {ans}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BIGGER VS SMALLER */}
      {activeTab === 'compare' && (
        <div className="bg-gradient-to-b from-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-10 border-4 border-teal-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-800 bg-teal-200 px-3 py-1 rounded-full">
              Bigger or Smaller
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Which jar has <span className="text-teal-600 uppercase underline">MORE</span> stars?
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-lg mx-auto">
            {/* Box A */}
            <button
              onClick={() => handleCompareAnswer('A')}
              className="p-6 rounded-3xl bg-white border-4 border-teal-200 hover:border-teal-400 shadow-xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <div className="flex flex-wrap gap-1 justify-center max-w-[140px] text-2xl mb-3 min-h-[60px] items-center">
                {Array.from({ length: compA }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <span className="text-4xl font-black text-slate-800">{compA}</span>
            </button>

            {/* Box B */}
            <button
              onClick={() => handleCompareAnswer('B')}
              className="p-6 rounded-3xl bg-white border-4 border-teal-200 hover:border-teal-400 shadow-xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <div className="flex flex-wrap gap-1 justify-center max-w-[140px] text-2xl mb-3 min-h-[60px] items-center">
                {Array.from({ length: compB }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <span className="text-4xl font-black text-slate-800">{compB}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

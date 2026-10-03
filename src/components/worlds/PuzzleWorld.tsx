import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, RefreshCw, Trophy, Brain } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

interface MemoryCard {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJI_POOL = [
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐶', name: 'Puppy' },
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🍌', name: 'Banana' },
  { emoji: '🚀', name: 'Rocket' },
  { emoji: '⭐', name: 'Star' },
];

export const PuzzleWorld: React.FC = () => {
  const { addStars, completeActivity, showConfetti, setMascot } = useGame();
  const [activeTab, setActiveTab] = useState<'memory' | 'odd-one'>('memory');

  // Memory Game State
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [pairsCount, setPairsCount] = useState<number>(3); // 3 pairs = 6 cards
  const [isWon, setIsWon] = useState(false);

  // Spot the Odd One Out State
  const [oddItems, setOddItems] = useState<{ id: number; emoji: string; isOdd: boolean }[]>([]);

  useEffect(() => {
    startMemoryGame(pairsCount);
    startOddOneGame();
  }, [pairsCount]);

  const startMemoryGame = (pairs: number) => {
    sound.playPop();
    const selected = [...EMOJI_POOL].sort(() => 0.5 - Math.random()).slice(0, pairs);
    const deck: MemoryCard[] = [];

    selected.forEach((item, idx) => {
      deck.push({ id: idx * 2, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: idx * 2 + 1, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
    });

    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlippedIndices([]);
    setIsWon(false);
    setMascot("Flip cards to find the matching animal and fruit pairs! 🧠", 'happy');
  };

  const handleCardClick = (idx: number) => {
    if (flippedIndices.length >= 2 || cards[idx].isFlipped || cards[idx].isMatched) return;

    sound.playPop();
    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (cards[i1].emoji === cards[i2].emoji) {
        // MATCH!
        sound.playSuccess();
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[i1].isMatched = true;
            updated[i2].isMatched = true;

            const allDone = updated.every((c) => c.isMatched);
            if (allDone) {
              setIsWon(true);
              sound.playFanfare();
              showConfetti();
              addStars(10, 'Memory Matcher Master');
              completeActivity('memory-game', 'puzzles');
              setMascot('Incredible memory! You matched all pairs! 🏆', 'cheering');
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // NO MATCH
        sound.playFriendlyBoing();
        setTimeout(() => {
          setCards((prev) => {
            const reset = [...prev];
            reset[i1].isFlipped = false;
            reset[i2].isFlipped = false;
            return reset;
          });
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // Spot the Odd One Out Logic
  const startOddOneGame = () => {
    const commonEmoji = ['🍎', '🐱', '⭐', '🎈', '🚗'][Math.floor(Math.random() * 5)];
    const oddEmoji = ['🍏', '🐶', '🌙', '🧸', '✈️'][Math.floor(Math.random() * 5)];

    const list = [
      { id: 1, emoji: commonEmoji, isOdd: false },
      { id: 2, emoji: commonEmoji, isOdd: false },
      { id: 3, emoji: oddEmoji, isOdd: true },
      { id: 4, emoji: commonEmoji, isOdd: false },
    ].sort(() => 0.5 - Math.random());

    setOddItems(list);
  };

  const handleOddSelect = (isOdd: boolean) => {
    if (isOdd) {
      sound.playSuccess();
      showConfetti();
      addStars(5, 'Spot the Difference');
      completeActivity('odd-one-out', 'puzzles');
      setMascot('Great eagle eyes! You found the different one! ⭐', 'cheering');
      setTimeout(() => {
        startOddOneGame();
      }, 1400);
    } else {
      sound.playFriendlyBoing();
      sound.speak('Look carefully, which one is not like the others?');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-indigo-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-700 flex items-center gap-2">
            <span>🧩 Puzzle & Memory Zone</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Boost memory, focus & visual problem-solving!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('memory');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'memory' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Memory Cards 🃏
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('odd-one');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'odd-one' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Spot Odd One 🔍
          </button>
        </div>
      </div>

      {/* Mode 1: Memory Cards */}
      {activeTab === 'memory' && (
        <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border-4 border-indigo-300 shadow-xl space-y-6 text-center">
          {/* Difficulty tier picker */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Cards:</span>
            {[2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setPairsCount(p)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  pairsCount === p
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {p * 2} Cards
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div
            className={`grid gap-3 sm:gap-4 max-w-lg mx-auto ${
              cards.length <= 4 ? 'grid-cols-2' : cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'
            }`}
          >
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-3xl border-4 text-4xl sm:text-5xl font-black flex items-center justify-center transition-all duration-300 transform select-none ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white border-indigo-400 rotate-0 shadow-md scale-100'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-white text-white shadow-lg hover:scale-105 active:scale-95'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '❓'}
              </button>
            ))}
          </div>

          {/* Win announcement */}
          {isWon && (
            <div className="bg-gradient-to-r from-amber-400 to-yellow-300 p-4 rounded-2xl border-2 border-amber-400 text-amber-950 font-black shadow-md flex items-center justify-center gap-2 animate-bounce-slow">
              <Trophy className="w-6 h-6 text-amber-900 fill-amber-700" />
              <span>You Matched All Pairs! Fantastic Memory! ⭐</span>
            </div>
          )}

          <button
            onClick={() => startMemoryGame(pairsCount)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}

      {/* Mode 2: Spot the Odd One Out */}
      {activeTab === 'odd-one' && (
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800 bg-amber-200 px-3 py-1 rounded-full">
              Detective Eyes
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Which one is <span className="text-rose-500 underline">DIFFERENT</span>?
            </h3>
            <p className="text-sm text-slate-600 mt-1">Tap the object that does not match the rest!</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
            {oddItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleOddSelect(item.isOdd)}
                className="aspect-square rounded-3xl bg-white border-4 border-amber-200 hover:border-amber-400 shadow-lg text-6xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-float"
              >
                {item.emoji}
              </button>
            ))}
          </div>

          <button
            onClick={startOddOneGame}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Puzzle</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Volume2, Sparkles, PenTool, Check, HelpCircle, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ABC_DATA } from '../../data/learningData';
import { TracingCanvas } from '../common/TracingCanvas';
import { sound } from '../../utils/audio';
import { AbcLetter } from '../../types';

export const AbcWorld: React.FC = () => {
  const { addStars, completeActivity, showConfetti, setMascot } = useGame();
  const [selectedLetter, setSelectedLetter] = useState<AbcLetter>(ABC_DATA[0]);
  const [mode, setMode] = useState<'learn' | 'trace' | 'game' | 'quiz'>('learn');

  // "Find the Letter" game state
  const [targetLetter, setTargetLetter] = useState<AbcLetter>(ABC_DATA[0]);
  const [gameOptions, setGameOptions] = useState<AbcLetter[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Picture quiz state
  const [quizTarget, setQuizTarget] = useState<AbcLetter>(ABC_DATA[1]);
  const [quizOptions, setQuizOptions] = useState<AbcLetter[]>([]);

  const handleSelectLetter = (item: AbcLetter) => {
    sound.playPop();
    setSelectedLetter(item);
    setMode('learn');
    sound.speak(`${item.letter}. ${item.letter} is for ${item.word}.`);
    setMascot(`${item.letter} is for ${item.word}! Phonics sound: "${item.phonics}"`, 'talking');
  };

  const startFindLetterGame = () => {
    sound.playPop();
    const randomTarget = ABC_DATA[Math.floor(Math.random() * ABC_DATA.length)];
    // Pick 3 random distractors
    const others = ABC_DATA.filter((l) => l.letter !== randomTarget.letter);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [randomTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());

    setTargetLetter(randomTarget);
    setGameOptions(options);
    setFeedback(null);
    setMode('game');

    sound.speak(`Can you find the letter ${randomTarget.letter}?`);
    setMascot(`Tap the bubble with the letter "${randomTarget.letter}"! 🎈`, 'happy');
  };

  const handleGameAnswer = (chosen: AbcLetter) => {
    if (chosen.letter === targetLetter.letter) {
      sound.playSuccess();
      showConfetti();
      addStars(5, `Finding letter ${targetLetter.letter}`);
      completeActivity(`find-${targetLetter.letter}`, 'abc');
      setFeedback('correct');
      setMascot(`Super job! That is ${targetLetter.letter}! ⭐`, 'cheering');
      setTimeout(() => {
        startFindLetterGame();
      }, 1500);
    } else {
      sound.playFriendlyBoing();
      setFeedback('wrong');
      sound.speak(`That is ${chosen.letter}. Try looking for ${targetLetter.letter}! You can do it!`);
      setMascot(`That was ${chosen.letter}! Look closely for ${targetLetter.letter}! 😊`, 'idle');
    }
  };

  const startPictureQuiz = () => {
    sound.playPop();
    const target = ABC_DATA[Math.floor(Math.random() * ABC_DATA.length)];
    const others = ABC_DATA.filter((l) => l.letter !== target.letter);
    const shuffled = [target, ...others.sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());

    setQuizTarget(target);
    setQuizOptions(shuffled);
    setMode('quiz');
    sound.speak(`Which item starts with the letter ${target.letter}?`);
    setMascot(`Which picture starts with "${target.letter}"? 🍎`, 'happy');
  };

  const handleQuizAnswer = (chosen: AbcLetter) => {
    if (chosen.letter === quizTarget.letter) {
      sound.playSuccess();
      showConfetti();
      addStars(5, `Picture Match ${quizTarget.word}`);
      completeActivity(`quiz-${quizTarget.letter}`, 'abc');
      setMascot(`Brilliant! ${quizTarget.letter} is for ${quizTarget.word}! ⭐`, 'cheering');
      setTimeout(() => {
        startPictureQuiz();
      }, 1500);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`That's ${chosen.word} for ${chosen.letter}. Let's find ${quizTarget.letter}!`);
    }
  };

  const handleTracingComplete = () => {
    addStars(10, `Tracing letter ${selectedLetter.letter}`);
    completeActivity(`trace-${selectedLetter.letter}`, 'abc');
    showConfetti();
    setMascot(`Wonderful handwriting! You traced ${selectedLetter.letter} perfectly! 🌟`, 'cheering');
    setMode('learn');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Controls & Mode Switcher */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-red-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-rose-600 flex items-center gap-2">
            <span>🔤 ABC Adventure</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Explore letters, phonics, tracing & fun games!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setMode('learn');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'learn' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Letters A-Z
          </button>
          <button
            onClick={startFindLetterGame}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'game' ? 'bg-amber-400 text-amber-950 shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Find Letter 🎈
          </button>
          <button
            onClick={startPictureQuiz}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'quiz' ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Picture Quiz 🧩
          </button>
        </div>
      </div>

      {/* Mode 1: Letters Grid & Detail Card */}
      {mode === 'learn' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Active Letter Big Card */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 shadow-lg border-4 border-rose-300 flex flex-col items-center text-center relative">
            <button
              onClick={() => sound.speak(`${selectedLetter.letter}. ${selectedLetter.letter} is for ${selectedLetter.word}`)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 transition"
              title="Hear Pronunciation"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Big Tactile Letter */}
            <div
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center text-6xl sm:text-7xl font-black text-white shadow-xl my-2 animate-bounce-slow"
              style={{ backgroundColor: selectedLetter.color }}
            >
              {selectedLetter.letter} {selectedLetter.lowercase}
            </div>

            {/* Phonics Sound Badge */}
            <div className="mt-2 bg-amber-100 border border-amber-300 px-4 py-1 rounded-full text-xs font-black text-amber-900">
              Phonics: "{selectedLetter.phonics}" sound
            </div>

            {/* Word Association */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-5xl">{selectedLetter.emoji}</span>
              <div className="text-left">
                <span className="text-2xl font-black text-slate-800">{selectedLetter.word}</span>
                <p className="text-sm font-urdu font-bold text-rose-600">{selectedLetter.urduMeaning}</p>
              </div>
            </div>

            {/* Action Buttons: Practice Tracing */}
            <button
              onClick={() => {
                sound.playPop();
                setMode('trace');
              }}
              className="mt-6 w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base rounded-2xl shadow-lg border-b-4 border-rose-700 active:translate-y-1 transition flex items-center justify-center gap-2"
            >
              <PenTool className="w-5 h-5" />
              <span>Practice Tracing {selectedLetter.letter}!</span>
            </button>
          </div>

          {/* Letters Grid A-Z */}
          <div className="md:col-span-6 bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-600 uppercase tracking-wider mb-3">
              Pick Any Letter:
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {ABC_DATA.map((item) => {
                const isSelected = selectedLetter.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    onClick={() => handleSelectLetter(item)}
                    className={`aspect-square rounded-2xl font-black text-xl sm:text-2xl transition active:scale-90 flex flex-col items-center justify-center relative ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-lg scale-105 ring-4 ring-rose-200'
                        : 'bg-slate-100 hover:bg-rose-100 text-slate-800'
                    }`}
                  >
                    <span>{item.letter}</span>
                    <span className="text-[10px] opacity-80 -mt-1">{item.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Letter Tracing */}
      {mode === 'trace' && (
        <div className="space-y-4">
          <button
            onClick={() => setMode('learn')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Letters</span>
          </button>

          <TracingCanvas
            letter={selectedLetter.letter}
            guideText={selectedLetter.traceGuide}
            color={selectedLetter.color}
            onComplete={handleTracingComplete}
          />
        </div>
      )}

      {/* Mode 3: "Find the Letter" Game */}
      {mode === 'game' && (
        <div className="bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl p-6 sm:p-10 border-4 border-sky-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-sky-700 bg-sky-200 px-3 py-1 rounded-full">
              Balloon Letter Hunt
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Find the letter <span className="text-rose-500 text-4xl">{targetLetter.letter}</span>!
            </h3>
            <p className="text-sm text-slate-600 mt-1">Tap the correct letter balloon:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
            {gameOptions.map((opt) => (
              <button
                key={opt.letter}
                onClick={() => handleGameAnswer(opt)}
                className="aspect-square rounded-3xl bg-white border-4 border-sky-200 hover:border-amber-400 shadow-lg text-5xl sm:text-6xl font-black text-slate-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-float"
              >
                {opt.letter}
              </button>
            ))}
          </div>

          <button
            onClick={startFindLetterGame}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Letter</span>
          </button>
        </div>
      )}

      {/* Mode 4: Picture Quiz */}
      {mode === 'quiz' && (
        <div className="bg-gradient-to-b from-purple-100 to-pink-50 rounded-3xl p-6 sm:p-10 border-4 border-purple-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-700 bg-purple-200 px-3 py-1 rounded-full">
              Picture Word Association
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Which item starts with <span className="text-purple-600 text-4xl">{quizTarget.letter}</span>?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            {quizOptions.map((opt) => (
              <button
                key={opt.letter}
                onClick={() => handleQuizAnswer(opt)}
                className="p-6 rounded-3xl bg-white border-4 border-purple-200 hover:border-purple-400 shadow-lg flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-6xl mb-2">{opt.emoji}</span>
                <span className="text-xl font-black text-slate-800">{opt.word}</span>
                <span className="text-xs font-urdu font-bold text-purple-600">{opt.urduMeaning}</span>
              </button>
            ))}
          </div>

          <button
            onClick={startPictureQuiz}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Next Question</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Volume2, Sparkles, RefreshCw, Trophy, Heart, HelpCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ANIMALS_DATA } from '../../data/learningData';
import { sound } from '../../utils/audio';
import { AnimalItem } from '../../types';

export const AnimalsWorld: React.FC = () => {
  const { addStars, completeActivity, showConfetti, setMascot } = useGame();
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem>(ANIMALS_DATA[0]);
  const [mode, setMode] = useState<'explore' | 'sound-quiz'>('explore');

  // Mini-game state: Guess the animal
  const [quizTarget, setQuizTarget] = useState<AnimalItem>(ANIMALS_DATA[0]);
  const [quizChoices, setQuizChoices] = useState<AnimalItem[]>([]);

  const handleSelectAnimal = (animal: AnimalItem) => {
    sound.playPop();
    setSelectedAnimal(animal);
    setMode('explore');

    sound.playAnimalSound(animal.soundAudioCue);
    setTimeout(() => {
      sound.speak(`This is a ${animal.name}. ${animal.soundDescription}`);
    }, 400);

    setMascot(`${animal.name} (${animal.urduName}) says: "${animal.soundDescription}" 🐾`, 'talking');
  };

  const startSoundQuiz = () => {
    sound.playPop();
    const target = ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
    const others = ANIMALS_DATA.filter((a) => a.id !== target.id);
    const shuffled = [target, ...others.sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());

    setQuizTarget(target);
    setQuizChoices(shuffled);
    setMode('sound-quiz');

    sound.playAnimalSound(target.soundAudioCue);
    setTimeout(() => {
      sound.speak(`Listen! Who makes this sound? ${target.soundDescription}`);
    }, 500);

    setMascot(`Who says "${target.soundName}"? Tap the right animal! 🐶`, 'happy');
  };

  const handleQuizAnswer = (chosen: AnimalItem) => {
    if (chosen.id === quizTarget.id) {
      sound.playSuccess();
      sound.playAnimalSound(quizTarget.soundAudioCue);
      showConfetti();
      addStars(5, `Animal Sound: ${quizTarget.name}`);
      completeActivity(`animal-${quizTarget.id}`, 'animals');
      setMascot(`Correct! The ${quizTarget.name} says ${quizTarget.soundName}! ⭐`, 'cheering');
      setTimeout(() => {
        startSoundQuiz();
      }, 1600);
    } else {
      sound.playFriendlyBoing();
      sound.speak(`That's the ${chosen.name}. Let's listen again!`);
      sound.playAnimalSound(quizTarget.soundAudioCue);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-300 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-800 flex items-center gap-2">
            <span>🐾 Animal World</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Meet adorable animals, listen to their sounds & learn where they live!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setMode('explore');
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'explore' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Animal Friends
          </button>
          <button
            onClick={startSoundQuiz}
            className={`px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition ${
              mode === 'sound-quiz' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Guess Sound Quiz 🔊
          </button>
        </div>
      </div>

      {/* Mode 1: Explore Animals */}
      {mode === 'explore' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Active Animal Card */}
          <div className="md:col-span-6 bg-gradient-to-b from-amber-50 via-white to-orange-50 rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 flex flex-col items-center text-center relative">
            <button
              onClick={() => {
                sound.playAnimalSound(selectedAnimal.soundAudioCue);
                sound.speak(selectedAnimal.soundDescription);
              }}
              className="absolute top-4 right-4 p-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 shadow transition active:scale-95"
              title="Play Animal Sound"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Animal Mascot Emoji */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-amber-200/60 border-4 border-white shadow-lg flex items-center justify-center text-7xl sm:text-8xl my-2 animate-bounce-slow">
              {selectedAnimal.emoji}
            </div>

            {/* Animal Names */}
            <div className="mt-3">
              <h3 className="text-3xl font-black text-slate-800">{selectedAnimal.name}</h3>
              <p className="text-lg font-urdu font-bold text-amber-700">{selectedAnimal.urduName}</p>
            </div>

            {/* Sound description */}
            <div className="mt-3 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-black text-amber-900">
              Sound: {selectedAnimal.soundDescription}
            </div>

            {/* Habitat & Fun Fact */}
            <div className="mt-5 w-full bg-white rounded-2xl p-4 border border-amber-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Habitat: {selectedAnimal.habitat}</span>
                <span className="font-urdu text-amber-800">{selectedAnimal.habitatUrdu}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-snug font-medium">
                💡 {selectedAnimal.funFact}
              </p>
              <p className="text-xs font-urdu text-amber-900 font-semibold text-right">
                {selectedAnimal.funFactUrdu}
              </p>
            </div>

            {/* Tap Sound button */}
            <button
              onClick={() => sound.playAnimalSound(selectedAnimal.soundAudioCue)}
              className="mt-5 w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black rounded-2xl shadow-md border-b-4 border-amber-600 active:translate-y-1 transition flex items-center justify-center gap-2"
            >
              <Volume2 className="w-5 h-5" />
              <span>Hear {selectedAnimal.name} Say "{selectedAnimal.soundName}"!</span>
            </button>
          </div>

          {/* Animals Grid */}
          <div className="md:col-span-6 bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-600 uppercase tracking-wider mb-3">
              Meet All Animals:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ANIMALS_DATA.map((animal) => {
                const isSelected = selectedAnimal.id === animal.id;
                return (
                  <button
                    key={animal.id}
                    onClick={() => handleSelectAnimal(animal)}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 shadow-md scale-105'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-4xl mb-1">{animal.emoji}</span>
                    <span className="text-xs font-black text-slate-800">{animal.name}</span>
                    <span className="text-[11px] font-urdu text-amber-700 font-bold">{animal.urduName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Guess the Sound Quiz */}
      {mode === 'sound-quiz' && (
        <div className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-xl text-center space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800 bg-amber-200 px-3 py-1 rounded-full">
              Sound Detective 🕵️
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Who makes this animal sound?
            </h3>
            <button
              onClick={() => {
                sound.playAnimalSound(quizTarget.soundAudioCue);
                sound.speak(`Sound: ${quizTarget.soundDescription}`);
              }}
              className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl shadow transition active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>Play Sound Again</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            {quizChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleQuizAnswer(choice)}
                className="p-6 rounded-3xl bg-white border-4 border-amber-200 hover:border-amber-400 shadow-lg flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-6xl mb-2">{choice.emoji}</span>
                <span className="text-lg font-black text-slate-800">{choice.name}</span>
                <span className="text-xs font-urdu font-bold text-amber-700">{choice.urduName}</span>
              </button>
            ))}
          </div>

          <button
            onClick={startSoundQuiz}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Next Animal</span>
          </button>
        </div>
      )}
    </div>
  );
};

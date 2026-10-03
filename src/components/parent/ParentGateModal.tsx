import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ParentGateModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({ onSuccess, onClose }) => {
  const [num1] = useState(() => Math.floor(Math.random() * 6) + 4);
  const [num2] = useState(() => Math.floor(Math.random() * 5) + 3);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const correctAnswer = num1 + num2;

  const handleKeyClick = (val: string) => {
    sound.playPop();
    if (userAnswer.length < 3) {
      setUserAnswer((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    sound.playPop();
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer, 10) === correctAnswer) {
      sound.playSuccess();
      onSuccess();
    } else {
      sound.playFriendlyBoing();
      setErrorMsg('Incorrect answer. Please try again.');
      setUserAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-4 border-slate-300 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-800">Parents Only</h3>
        <p className="text-sm text-slate-600 mt-1 mb-4">
          Please solve the math puzzle below to confirm you are a parent:
        </p>

        <div className="bg-slate-100 rounded-2xl p-4 mb-4 border-2 border-slate-200">
          <span className="text-2xl font-black text-slate-800 tracking-wider">
            {num1} + {num2} = ?
          </span>
          <div className="h-10 mt-2 flex items-center justify-center">
            <span className="text-2xl font-extrabold text-emerald-600 min-w-[40px] border-b-2 border-emerald-500">
              {userAnswer || '_'}
            </span>
          </div>
        </div>

        {errorMsg && <p className="text-xs font-semibold text-rose-500 mb-3">{errorMsg}</p>}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyClick(digit.toString())}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-lg font-bold text-slate-800 transition"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('0')}
            className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-bold text-slate-800 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition flex items-center justify-center"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          This check prevents young children from modifying parental settings.
        </p>
      </div>
    </div>
  );
};

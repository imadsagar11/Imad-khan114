import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  User,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

export const ParentDashboard: React.FC = () => {
  const { profile, setCurrentScreen, updateProfile, updateSettings, resetProgress } = useGame();
  const [childName, setChildName] = useState(profile.name);
  const [childAge, setChildAge] = useState(profile.age);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const completedCount = Object.keys(profile.completedLessons).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: childName, age: Number(childAge) });
    setSaveSuccess(true);
    sound.playSuccess();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-2 sm:p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">Parental Dashboard & Controls</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Monitor learning progress, time limits, and app preferences
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-3xl p-4 text-center">
          <div className="text-2xl sm:text-3xl mb-1">⭐</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">{profile.stars}</div>
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide">Total Stars</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-3xl p-4 text-center">
          <div className="text-2xl sm:text-3xl mb-1">🏅</div>
          <div className="text-2xl sm:text-3xl font-black text-purple-900">{profile.badges.length}</div>
          <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">Badges Earned</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-3xl p-4 text-center">
          <div className="text-2xl sm:text-3xl mb-1">📚</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">{completedCount}</div>
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Lessons Completed</div>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-300 rounded-3xl p-4 text-center">
          <div className="text-2xl sm:text-3xl mb-1">⏳</div>
          <div className="text-2xl sm:text-3xl font-black text-sky-900">{profile.settings.todayMinutesSpent}m</div>
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wide">Screen Time Today</div>
        </div>
      </div>

      {/* Child Profile Settings & Screen Limit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Profile Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">Child Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Child's Name / Nickname</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-bold text-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Age (Years: 3 - 8)</label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-bold text-slate-800 text-sm bg-white"
              >
                {[3, 4, 5, 6, 7, 8].map((age) => (
                  <option key={age} value={age}>
                    {age} Years Old
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition"
            >
              {saveSuccess ? 'Saved Successfully! ✓' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Screen Time & Audio Controls */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-800">Screen Time Limit & Safety</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Daily Usage Limit</label>
            <select
              value={profile.settings.dailyLimitMinutes}
              onChange={(e) => updateSettings({ dailyLimitMinutes: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none font-bold text-slate-800 text-sm bg-white"
            >
              <option value={0}>No Limit (Unlimited)</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes (Recommended)</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (1 Hour)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              When limit is reached, a calm "Rest your eyes" screen gently invites the child to take a break.
            </p>
          </div>

          {/* Audio Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-800">Sound Effects</span>
                <p className="text-xs text-slate-500">Pops, chimes, celebration fanfares</p>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ soundEffects: !profile.settings.soundEffects })}
                className={`w-12 h-7 flex items-center rounded-full p-1 transition duration-300 ${
                  profile.settings.soundEffects ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="bg-white w-5 h-5 rounded-full shadow-md transform" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-800">Child Voice Guidance</span>
                <p className="text-xs text-slate-500">Reads aloud letters, questions & encouragement</p>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ voiceGuidance: !profile.settings.voiceGuidance })}
                className={`w-12 h-7 flex items-center rounded-full p-1 transition duration-300 ${
                  profile.settings.voiceGuidance ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="bg-white w-5 h-5 rounded-full shadow-md transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Privacy Notice */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 text-emerald-900 text-xs sm:text-sm space-y-1.5">
        <div className="flex items-center gap-2 font-black text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Child Safety & Privacy Guarantee</span>
        </div>
        <p className="text-emerald-700">
          • 100% Kid Safe: Zero advertisements, zero third-party tracking, zero in-app purchases or gambling.
        </p>
        <p className="text-emerald-700">
          • Data is stored safely on this device. No personal information is collected or transmitted.
        </p>
      </div>

      {/* Reset Progress Section */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-rose-900 text-sm">Reset All Learning Progress</h4>
          <p className="text-xs text-rose-700">Clears stars, badges, and completed lessons back to fresh state.</p>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Yes, Reset Everything
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-300 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};

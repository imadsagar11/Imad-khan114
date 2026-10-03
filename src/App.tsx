/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/common/Header';
import { HomeScreen } from './components/home/HomeScreen';
import { AbcWorld } from './components/worlds/AbcWorld';
import { MathWorld } from './components/worlds/MathWorld';
import { UrduWorld } from './components/worlds/UrduWorld';
import { AnimalsWorld } from './components/worlds/AnimalsWorld';
import { ColorsShapesWorld } from './components/worlds/ColorsShapesWorld';
import { SpaceWorld } from './components/worlds/SpaceWorld';
import { PuzzleWorld } from './components/worlds/PuzzleWorld';
import { AvatarCustomizer } from './components/features/AvatarCustomizer';
import { BadgeCollection } from './components/features/BadgeCollection';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ScreenTimeAlertModal } from './components/parent/ScreenTimeAlertModal';

const AppRouter: React.FC = () => {
  const { currentScreen } = useGame();

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col selection:bg-amber-200">
      <Header />

      <main className="flex-1 pb-12">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'abc' && <AbcWorld />}
        {currentScreen === 'math' && <MathWorld />}
        {currentScreen === 'urdu' && <UrduWorld />}
        {currentScreen === 'animals' && <AnimalsWorld />}
        {currentScreen === 'colors-shapes' && <ColorsShapesWorld />}
        {currentScreen === 'space' && <SpaceWorld />}
        {currentScreen === 'puzzles' && <PuzzleWorld />}
        {currentScreen === 'avatar' && <AvatarCustomizer />}
        {currentScreen === 'badges' && <BadgeCollection />}
        {currentScreen === 'parent-dashboard' && <ParentDashboard />}
      </main>

      {/* Screen Time Healthy Rest Alert */}
      <ScreenTimeAlertModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  );
}

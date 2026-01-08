/**
 * SUDOKU GAME
 * A fun, mobile-first Sudoku experience
 */

import { useState } from 'react';
import Board from './components/Board';
import Confetti from './components/Confetti';
import ThemeToggle from './components/ThemeToggle';
import PastGames from './components/PastGames';
import ConfirmModal from './components/ConfirmModal';
import InstallModal from './components/InstallModal';
import { useGame } from './hooks/useGame';
import { DIFFICULTIES } from './constants';

function App() {
  const [showPastGames, setShowPastGames] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  
  // Confirmation modals
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    type: null, 
    data: null 
  });
  
  const {
    puzzle,
    board,
    difficulty,
    activeCell,
    errorCell,
    mistakes,
    isWon,
    showConfetti,
    isLoading,
    initializeGame,
    handleCellSelect,
    handleCellChange,
    handleKeyDown,
    handleSolve,
    handleNewGame,
    handleReset,
    handleLoadPastGame,
    handleNumberInput
  } = useGame();

  // Confirmation handlers
  const showConfirm = (type, data = null) => {
    setConfirmModal({ isOpen: true, type, data });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, type: null, data: null });
  };

  const handleConfirm = () => {
    switch (confirmModal.type) {
      case 'reset':
        handleReset();
        break;
      case 'solve':
        handleSolve();
        break;
      case 'newGame':
        handleNewGame();
        break;
      case 'difficulty':
        initializeGame(confirmModal.data);
        break;
    }
  };

  const onDifficultyClick = (diff) => {
    if (diff !== difficulty) {
      showConfirm('difficulty', diff);
    }
  };

  // Get confirmation modal content
  const getModalContent = () => {
    switch (confirmModal.type) {
      case 'reset':
        return {
          title: 'Reset Game?',
          message: 'This will clear all your progress and start over with the same puzzle.',
          confirmText: 'Reset',
          variant: 'danger'
        };
      case 'solve':
        return {
          title: 'Reveal Solution?',
          message: 'Are you sure? This will show the complete solution.',
          confirmText: 'Reveal',
          variant: 'default'
        };
      case 'newGame':
        return {
          title: 'Start New Game?',
          message: 'Your current game will be saved to history.',
          confirmText: 'New Game',
          variant: 'success'
        };
      case 'difficulty':
        return {
          title: 'Change Difficulty?',
          message: `Switching to ${confirmModal.data} will start a new game. Your current progress will be saved.`,
          confirmText: 'Change',
          variant: 'default'
        };
      default:
        return {};
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[100dvh] bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-teal-600 dark:text-teal-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-50 dark:bg-slate-900 
                    text-slate-800 dark:text-slate-100
                    flex flex-col overflow-hidden">
      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="flex-shrink-0 px-4 pt-3 pb-2">
        <div className="max-w-md mx-auto">
          {/* Top Row: Title + Icons */}
          <div className="flex items-center justify-between mb-2.5">
            <h1 className="text-xl font-bold text-teal-600 dark:text-teal-300">
              Play Sudoku
            </h1>
            <div className="flex items-center gap-1">
              {/* Install PWA Button */}
              <button
                onClick={() => setShowInstall(true)}
                className="p-1.5 text-slate-500 dark:text-slate-400 rounded-lg
                           bg-white dark:bg-slate-700
                           hover:bg-slate-100 dark:hover:bg-slate-600 
                           active:scale-95
                           transition-all duration-150"
                aria-label="Install app"
                title="Install app"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={() => setShowPastGames(true)}
                className="p-1.5 text-slate-500 dark:text-slate-400 rounded-lg
                           bg-white dark:bg-slate-700
                           hover:bg-slate-100 dark:hover:bg-slate-600 
                           active:scale-95
                           transition-all duration-150"
                aria-label="Game history"
                title="Game history"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Difficulty Selector + How to Play */}
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex bg-white dark:bg-slate-700 rounded-lg p-0.5 shadow-sm">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => onDifficultyClick(diff)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200
                    ${difficulty === diff
                      ? diff === 'easy' 
                        ? 'bg-emerald-500 text-white'
                        : diff === 'medium'
                        ? 'bg-amber-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
            <a
              href="https://bhamza.dev/blog/learning-how-to-solve-sudoku-the-easy-way/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-300 
                         hover:text-teal-700 dark:hover:text-teal-200
                         underline decoration-1 decoration-teal-400/50 dark:decoration-teal-400/30
                         hover:decoration-teal-500 dark:hover:decoration-teal-300
                         transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              How to play
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => showConfirm('reset')}
              disabled={isWon}
              className="px-3 py-1.5 text-xs font-bold rounded-lg
                         text-amber-700 dark:text-amber-200
                         bg-amber-100 dark:bg-amber-800/40
                         hover:bg-amber-200 dark:hover:bg-amber-800/60
                         active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-150"
            >
              🔄 Reset
            </button>
            <button
              onClick={() => showConfirm('newGame')}
              className="px-4 py-1.5 text-xs font-bold rounded-lg
                         text-white bg-teal-500 dark:bg-teal-600
                         hover:bg-teal-600 dark:hover:bg-teal-500
                         active:scale-95
                         transition-all duration-150"
            >
              ✨ New Game
            </button>
            <button
              onClick={() => showConfirm('solve')}
              disabled={isWon}
              className="px-3 py-1.5 text-xs font-bold rounded-lg
                         text-cyan-700 dark:text-cyan-200
                         bg-cyan-100 dark:bg-cyan-800/40
                         hover:bg-cyan-200 dark:hover:bg-cyan-800/60
                         active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-150"
            >
              💡 Solve
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-2 min-h-0">
        {/* Win Message */}
        {isWon && (
          <div className="w-full max-w-md mb-2 px-3 py-2 
                          bg-emerald-500 rounded-xl text-center">
            <p className="text-base font-bold text-white">
              🎉 {mistakes === 0 ? 'Perfect Game!' : `Victory! ${mistakes} mistake${mistakes !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}

        {/* Mistakes Counter */}
        {!isWon && mistakes > 0 && (
          <div className={`mb-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full
                          ${mistakes >= 3 
                            ? 'text-white bg-red-500' 
                            : 'text-amber-700 dark:text-amber-200 bg-amber-100 dark:bg-amber-800/40'}`}>
            {mistakes} mistake{mistakes !== 1 ? 's' : ''}
          </div>
        )}

        {/* Board */}
        <Board
          puzzle={puzzle}
          board={board}
          activeCell={activeCell}
          errorCell={errorCell}
          onCellSelect={handleCellSelect}
          onCellChange={handleCellChange}
          onKeyDown={handleKeyDown}
        />

        {/* Number Pad - 5 column grid */}
        <div className="w-full max-w-md mt-4">
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                disabled={!activeCell || isWon || (activeCell && puzzle[activeCell.row]?.[activeCell.col] !== 0)}
                className="aspect-square text-xl font-bold rounded-xl
                           bg-white dark:bg-slate-700 
                           border-2 border-slate-200 dark:border-slate-600
                           text-slate-700 dark:text-slate-200
                           hover:bg-teal-50 dark:hover:bg-teal-800/30 
                           hover:border-teal-400 dark:hover:border-teal-500
                           active:scale-90
                           disabled:opacity-25 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-teal-500
                           transition-all duration-100"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberInput(0)}
              disabled={!activeCell || isWon || (activeCell && puzzle[activeCell.row]?.[activeCell.col] !== 0)}
              className="aspect-square text-lg font-bold rounded-xl
                         bg-slate-100 dark:bg-slate-600 
                         border-2 border-slate-200 dark:border-slate-500
                         text-slate-500 dark:text-slate-300
                         hover:bg-red-50 dark:hover:bg-red-800/30 
                         hover:text-red-500 dark:hover:text-red-400
                         active:scale-90
                         disabled:opacity-25 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-red-500
                         transition-all duration-100"
              aria-label="Clear"
            >
              ⌫
            </button>
          </div>
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-1" />
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="max-w-md mx-auto text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Built by{' '}
            <a
              href="https://bhamza.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-teal-600 dark:text-teal-300 
                         underline decoration-1 decoration-teal-400/50 dark:decoration-teal-400/30
                         hover:text-teal-700 dark:hover:text-teal-200
                         transition-all"
            >
              B. Hamza
            </a>
          </span>
        </div>
      </footer>

      {/* Past Games Modal */}
      <PastGames
        isOpen={showPastGames}
        onClose={() => setShowPastGames(false)}
        onLoadGame={handleLoadPastGame}
      />

      {/* Install Modal */}
      <InstallModal
        isOpen={showInstall}
        onClose={() => setShowInstall(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        {...getModalContent()}
      />
    </div>
  );
}

export default App;

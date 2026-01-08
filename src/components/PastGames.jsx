import { useState, useEffect } from 'react';
import { loadPastGames, deletePastGame, clearAllPastGames } from '../utils/persistence';

export default function PastGames({ isOpen, onClose, onLoadGame }) {
  const [pastGames, setPastGames] = useState([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPastGames(loadPastGames());
      setShowConfirmClear(false);
    }
  }, [isOpen]);

  const handleLoadGame = (game) => {
    onLoadGame(game);
    onClose();
  };

  const handleDeleteGame = (gameId, e) => {
    e.stopPropagation();
    deletePastGame(gameId);
    setPastGames(loadPastGames());
  };

  const handleClearAll = () => {
    clearAllPastGames();
    setPastGames([]);
    setShowConfirmClear(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-modal-slide"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Game History</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {pastGames.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No saved games yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Your game history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pastGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleLoadGame(game)}
                  className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg
                             hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer
                             active:bg-gray-100 dark:active:bg-gray-700
                             transition-colors duration-150"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                          ${game.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : ''}
                          ${game.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' : ''}
                          ${game.difficulty === 'hard' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : ''}
                        `}>
                          {getDifficultyLabel(game.difficulty)}
                        </span>
                        {game.mistakes > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {game.mistakes} {game.mistakes === 1 ? 'mistake' : 'mistakes'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(game.savedAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteGame(game.id, e)}
                      className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      aria-label="Delete game"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Clear All */}
        {pastGames.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {showConfirmClear ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Clear all history?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300
                               bg-gray-100 dark:bg-gray-700 rounded-md
                               hover:bg-gray-200 dark:hover:bg-gray-600
                               focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1.5 text-sm font-medium text-white
                               bg-red-600 hover:bg-red-700 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400
                           bg-red-50 dark:bg-red-900/20 rounded-lg
                           hover:bg-red-100 dark:hover:bg-red-900/30
                           focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Clear All History
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

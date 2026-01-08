/**
 * LocalStorage persistence utilities
 * Handles game state, theme, and past games storage
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEY = 'sudoku-game-state';
const THEME_KEY = 'sudoku-theme';
const PAST_GAMES_KEY = 'sudoku-past-games';

// ============================================================================
// GAME STATE
// ============================================================================

export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return null;
}

export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}

// ============================================================================
// THEME
// ============================================================================

/**
 * Get system color scheme preference
 * @returns {'dark' | 'light'}
 */
function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Save theme preference
 * @param {'light' | 'dark' | 'system'} theme
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

/**
 * Load theme preference (defaults to 'system')
 * @returns {'light' | 'dark' | 'system'}
 */
export function loadThemePreference() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved;
    }
  } catch (error) {
    console.error('Failed to load theme:', error);
  }
  return 'system'; // Default to system preference
}

/**
 * Get the effective theme (resolves 'system' to actual value)
 * @param {'light' | 'dark' | 'system'} preference
 * @returns {'light' | 'dark'}
 */
export function getEffectiveTheme(preference) {
  if (preference === 'system') {
    return getSystemTheme();
  }
  return preference;
}

// ============================================================================
// PAST GAMES
// ============================================================================

export function savePastGame(game) {
  try {
    const pastGames = loadPastGames();
    const newGame = {
      ...game,
      id: Date.now().toString(),
      savedAt: new Date().toISOString()
    };
    pastGames.unshift(newGame);
    // Keep only last 20 games
    const limitedGames = pastGames.slice(0, 20);
    localStorage.setItem(PAST_GAMES_KEY, JSON.stringify(limitedGames));
  } catch (error) {
    console.error('Failed to save past game:', error);
  }
}

export function loadPastGames() {
  try {
    const saved = localStorage.getItem(PAST_GAMES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load past games:', error);
  }
  return [];
}

export function deletePastGame(gameId) {
  try {
    const pastGames = loadPastGames();
    const filtered = pastGames.filter(game => game.id !== gameId);
    localStorage.setItem(PAST_GAMES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete past game:', error);
  }
}

export function clearAllPastGames() {
  try {
    localStorage.removeItem(PAST_GAMES_KEY);
  } catch (error) {
    console.error('Failed to clear past games:', error);
  }
}

/**
 * Game constants
 */

export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;
export const EMPTY_CELL = 0;

export const DIFFICULTIES = ['easy', 'medium', 'hard'];

export const DIFFICULTY_CLUES = {
  easy: 45,    // Keep 45 numbers (~55% filled)
  medium: 35,  // Keep 35 numbers (~43% filled)
  hard: 28     // Keep 28 numbers (~35% filled)
};

export const STORAGE_KEYS = {
  GAME_STATE: 'sudoku-game-state',
  THEME: 'sudoku-theme',
  PAST_GAMES: 'sudoku-past-games'
};

export const MAX_PAST_GAMES = 20;


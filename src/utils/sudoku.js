/**
 * SUDOKU GAME LOGIC
 * 
 * Sudoku is a 9×9 grid divided into nine 3×3 boxes.
 * 
 * Rules:
 * 1. Every row must contain numbers 1–9 exactly once
 * 2. Every column must contain numbers 1–9 exactly once
 * 3. Every 3×3 box must contain numbers 1–9 exactly once
 */

import { BOARD_SIZE, BOX_SIZE, EMPTY_CELL, DIFFICULTY_CLUES } from '../constants';

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Check if a number can be placed at (row, col)
 * @param {number[][]} board - The game board
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {number} value - Value to check (1-9)
 * @returns {boolean}
 */
export function isValidMove(board, row, col, value) {
  if (value < 1 || value > 9) return false;
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;

  // Check row constraint
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c !== col && board[row][c] === value) return false;
  }

  // Check column constraint
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r !== row && board[r][col] === value) return false;
  }

  // Check 3×3 box constraint
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) return false;
    }
  }

  return true;
}

/**
 * Find conflicting cells for highlighting
 * @param {number[][]} board - The game board
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {Array<{row: number, col: number}>}
 */
export function getConflicts(board, row, col) {
  const conflicts = [];
  const value = board[row][col];
  if (!value) return conflicts;

  // Check row
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c !== col && board[row][c] === value) {
      conflicts.push({ row, col: c });
    }
  }

  // Check column
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r !== row && board[r][col] === value) {
      conflicts.push({ row: r, col });
    }
  }

  // Check box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        conflicts.push({ row: r, col: c });
      }
    }
  }

  return conflicts;
}

/**
 * Check if board is complete and valid
 * @param {number[][]} board - The game board
 * @returns {boolean}
 */
export function isBoardComplete(board) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col] || !isValidMove(board, row, col, board[row][col])) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if a puzzle has actual numbers (not all zeros)
 * @param {number[][]} puzzle - The puzzle to validate
 * @returns {boolean}
 */
export function isPuzzleValid(puzzle) {
  if (!puzzle || !Array.isArray(puzzle) || puzzle.length !== BOARD_SIZE) return false;
  let hasNumbers = false;
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (!puzzle[row] || puzzle[row].length !== BOARD_SIZE) return false;
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (puzzle[row][col] !== EMPTY_CELL) hasNumbers = true;
    }
  }
  return hasNumbers;
}

// ============================================================================
// SOLVING
// ============================================================================

/**
 * Solve board using backtracking
 * @param {number[][]} board - The game board (mutated in place)
 * @returns {boolean} - Whether the board was solved
 */
export function solveBoard(board) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(numbers);

  function solve() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === EMPTY_CELL) {
          for (const num of numbers) {
            if (isValidMove(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = EMPTY_CELL;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  return solve();
}

// ============================================================================
// GENERATION
// ============================================================================

/**
 * Create an empty 9x9 board
 * @returns {number[][]}
 */
function createEmptyBoard() {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY_CELL));
}

/**
 * Shuffle array in place (Fisher-Yates)
 * @param {any[]} arr - Array to shuffle
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Generate a complete valid solution
 * @returns {number[][]}
 */
export function generateSolvedBoard() {
  const board = createEmptyBoard();
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  function fill() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === EMPTY_CELL) {
          shuffleArray(numbers);
          for (const num of numbers) {
            if (isValidMove(board, row, col, num)) {
              board[row][col] = num;
              if (fill()) return true;
              board[row][col] = EMPTY_CELL;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fill();
  return board;
}

/**
 * Create puzzle by removing cells from solution
 * @param {number[][]} solution - Complete solution
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {number[][]}
 */
export function createPuzzle(solution, difficulty) {
  const puzzle = solution.map(row => [...row]);
  const keepCount = DIFFICULTY_CLUES[difficulty] || DIFFICULTY_CLUES.medium;
  
  // Create list of all 81 cells
  const cells = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      cells.push({ row, col });
    }
  }
  
  // Shuffle cells
  shuffleArray(cells);
  
  // Remove cells until we have the right number remaining
  const cellsToRemove = (BOARD_SIZE * BOARD_SIZE) - keepCount;
  for (let i = 0; i < cellsToRemove && i < cells.length; i++) {
    const { row, col } = cells[i];
    puzzle[row][col] = EMPTY_CELL;
  }
  
  return puzzle;
}

/**
 * Generate a new game
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {{puzzle: number[][], solution: number[][], difficulty: string}}
 */
export function generateNewGame(difficulty = 'medium') {
  const solution = generateSolvedBoard();
  const puzzle = createPuzzle(solution, difficulty);
  
  return {
    puzzle,
    solution,
    difficulty
  };
}

import { describe, it, expect } from 'vitest';
import {
  isValidMove,
  isBoardComplete,
  isPuzzleValid,
  generateSolvedBoard,
  createPuzzle,
  generateNewGame,
  getConflicts
} from '../utils/sudoku';
import { BOARD_SIZE, EMPTY_CELL } from '../constants';

describe('Sudoku Logic', () => {
  describe('isValidMove', () => {
    const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    
    it('should return true for valid moves on empty board', () => {
      expect(isValidMove(emptyBoard, 0, 0, 5)).toBe(true);
      expect(isValidMove(emptyBoard, 4, 4, 9)).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(isValidMove(emptyBoard, 0, 0, 0)).toBe(false);
      expect(isValidMove(emptyBoard, 0, 0, 10)).toBe(false);
      expect(isValidMove(emptyBoard, 0, 0, -1)).toBe(false);
    });

    it('should return false for out of bounds positions', () => {
      expect(isValidMove(emptyBoard, -1, 0, 5)).toBe(false);
      expect(isValidMove(emptyBoard, 0, 9, 5)).toBe(false);
      expect(isValidMove(emptyBoard, 9, 0, 5)).toBe(false);
    });

    it('should detect row conflicts', () => {
      const board = emptyBoard.map(row => [...row]);
      board[0][0] = 5;
      expect(isValidMove(board, 0, 8, 5)).toBe(false);
    });

    it('should detect column conflicts', () => {
      const board = emptyBoard.map(row => [...row]);
      board[0][0] = 5;
      expect(isValidMove(board, 8, 0, 5)).toBe(false);
    });

    it('should detect box conflicts', () => {
      const board = emptyBoard.map(row => [...row]);
      board[0][0] = 5;
      expect(isValidMove(board, 2, 2, 5)).toBe(false);
    });

    it('should allow same value in different box', () => {
      const board = emptyBoard.map(row => [...row]);
      board[0][0] = 5;
      expect(isValidMove(board, 3, 3, 5)).toBe(true);
    });
  });

  describe('getConflicts', () => {
    it('should return empty array for empty cell', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      expect(getConflicts(board, 0, 0)).toEqual([]);
    });

    it('should find row conflicts', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      board[0][0] = 5;
      board[0][5] = 5;
      const conflicts = getConflicts(board, 0, 0);
      expect(conflicts).toContainEqual({ row: 0, col: 5 });
    });

    it('should find column conflicts', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      board[0][0] = 5;
      board[5][0] = 5;
      const conflicts = getConflicts(board, 0, 0);
      expect(conflicts).toContainEqual({ row: 5, col: 0 });
    });

    it('should find box conflicts', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      board[0][0] = 5;
      board[2][2] = 5;
      const conflicts = getConflicts(board, 0, 0);
      expect(conflicts).toContainEqual({ row: 2, col: 2 });
    });
  });

  describe('isBoardComplete', () => {
    it('should return false for empty board', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      expect(isBoardComplete(board)).toBe(false);
    });

    it('should return false for partially filled board', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      board[0][0] = 5;
      expect(isBoardComplete(board)).toBe(false);
    });

    it('should return true for valid completed board', () => {
      const board = generateSolvedBoard();
      expect(isBoardComplete(board)).toBe(true);
    });
  });

  describe('isPuzzleValid', () => {
    it('should return false for null', () => {
      expect(isPuzzleValid(null)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(isPuzzleValid([])).toBe(false);
    });

    it('should return false for wrong size', () => {
      expect(isPuzzleValid(Array(8).fill([]))).toBe(false);
    });

    it('should return false for all zeros', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      expect(isPuzzleValid(board)).toBe(false);
    });

    it('should return true for valid puzzle', () => {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      board[0][0] = 5;
      expect(isPuzzleValid(board)).toBe(true);
    });
  });

  describe('generateSolvedBoard', () => {
    it('should generate a 9x9 board', () => {
      const board = generateSolvedBoard();
      expect(board.length).toBe(BOARD_SIZE);
      board.forEach(row => {
        expect(row.length).toBe(BOARD_SIZE);
      });
    });

    it('should generate a valid complete board', () => {
      const board = generateSolvedBoard();
      expect(isBoardComplete(board)).toBe(true);
    });

    it('should contain all numbers 1-9 in each row', () => {
      const board = generateSolvedBoard();
      board.forEach(row => {
        const sorted = [...row].sort((a, b) => a - b);
        expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });
    });

    it('should generate different boards on multiple calls', () => {
      const board1 = generateSolvedBoard();
      const board2 = generateSolvedBoard();
      // Boards should be different (extremely unlikely to be same)
      const board1Flat = board1.flat().join('');
      const board2Flat = board2.flat().join('');
      expect(board1Flat).not.toBe(board2Flat);
    });
  });

  describe('createPuzzle', () => {
    it('should create a puzzle with correct number of clues for easy', () => {
      const solution = generateSolvedBoard();
      const puzzle = createPuzzle(solution, 'easy');
      const clueCount = puzzle.flat().filter(c => c !== EMPTY_CELL).length;
      expect(clueCount).toBe(45);
    });

    it('should create a puzzle with correct number of clues for medium', () => {
      const solution = generateSolvedBoard();
      const puzzle = createPuzzle(solution, 'medium');
      const clueCount = puzzle.flat().filter(c => c !== EMPTY_CELL).length;
      expect(clueCount).toBe(35);
    });

    it('should create a puzzle with correct number of clues for hard', () => {
      const solution = generateSolvedBoard();
      const puzzle = createPuzzle(solution, 'hard');
      const clueCount = puzzle.flat().filter(c => c !== EMPTY_CELL).length;
      expect(clueCount).toBe(28);
    });

    it('should only contain values from solution', () => {
      const solution = generateSolvedBoard();
      const puzzle = createPuzzle(solution, 'medium');
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (puzzle[r][c] !== EMPTY_CELL) {
            expect(puzzle[r][c]).toBe(solution[r][c]);
          }
        }
      }
    });
  });

  describe('generateNewGame', () => {
    it('should return puzzle, solution, and difficulty', () => {
      const game = generateNewGame('easy');
      expect(game).toHaveProperty('puzzle');
      expect(game).toHaveProperty('solution');
      expect(game).toHaveProperty('difficulty');
      expect(game.difficulty).toBe('easy');
    });

    it('should generate valid puzzle', () => {
      const game = generateNewGame('medium');
      expect(isPuzzleValid(game.puzzle)).toBe(true);
    });

    it('should generate valid solution', () => {
      const game = generateNewGame('hard');
      expect(isBoardComplete(game.solution)).toBe(true);
    });

    it('should default to medium difficulty', () => {
      const game = generateNewGame();
      expect(game.difficulty).toBe('medium');
    });
  });
});


import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { generateNewGame, isBoardComplete, isPuzzleValid } from '../utils/sudoku';
import { saveGameState, loadGameState, clearGameState, savePastGame } from '../utils/persistence';

/**
 * Custom hook for managing Sudoku game state
 */
export function useGame() {
  const [gameState, setGameState] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [errorCell, setErrorCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const initialized = useRef(false);
  const errorTimerRef = useRef(null);

  // Derived state with useMemo to prevent unnecessary re-renders
  const puzzle = useMemo(() => gameState?.puzzle || [], [gameState?.puzzle]);
  const board = useMemo(() => gameState?.board || [], [gameState?.board]);
  const solution = useMemo(() => gameState?.solution || [], [gameState?.solution]);
  const difficulty = gameState?.difficulty || 'medium';

  // Initialize or create new game
  const initializeGame = useCallback((diff) => {
    const game = generateNewGame(diff);
    setGameState({
      puzzle: game.puzzle,
      board: game.puzzle.map(row => [...row]),
      solution: game.solution,
      difficulty: diff,
      mistakes: 0
    });
    setMistakes(0);
    setIsWon(false);
    setShowConfetti(false);
    setActiveCell(null);
    setErrorCell(null);
    initialized.current = true;
  }, []);

  // Load saved game or start new
  useEffect(() => {
    if (initialized.current) return;
    const saved = loadGameState();
    if (saved && isPuzzleValid(saved.puzzle) && isPuzzleValid(saved.solution)) {
      setGameState({
        puzzle: saved.puzzle,
        board: saved.board,
        solution: saved.solution,
        difficulty: saved.difficulty || 'medium',
        mistakes: saved.mistakes || 0
      });
      setMistakes(saved.mistakes || 0);
      initialized.current = true;
    } else {
      clearGameState();
      initializeGame('medium');
    }
  }, [initializeGame]);

  // Persist game state
  useEffect(() => {
    if (!initialized.current || !gameState) return;
    if (!isPuzzleValid(gameState.puzzle)) return;
    if (!isWon) {
      saveGameState({ ...gameState, mistakes, isWon: false });
    } else {
      clearGameState();
    }
  }, [gameState, mistakes, isWon]);

  // Check for win
  useEffect(() => {
    if (gameState && !isWon && board.length === 9 && isBoardComplete(board)) {
      setIsWon(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [board, isWon, gameState]);

  // Error feedback
  const triggerError = useCallback((row, col) => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setErrorCell({ row, col });
    setMistakes(prev => prev + 1);
    errorTimerRef.current = setTimeout(() => setErrorCell(null), 600);
  }, []);

  // Cell handlers
  const handleCellSelect = useCallback((row, col) => {
    if (!isWon) setActiveCell({ row, col });
  }, [isWon]);

  const handleCellChange = useCallback((row, col, value) => {
    if (isWon || puzzle[row]?.[col] !== 0) return;
    if (value !== 0 && (value < 1 || value > 9)) return;
    if (value !== 0 && solution[row]?.[col] !== value) {
      triggerError(row, col);
      return;
    }
    setGameState(prev => {
      if (!prev) return prev;
      const newBoard = prev.board.map(r => [...r]);
      newBoard[row][col] = value;
      return { ...prev, board: newBoard };
    });
    setActiveCell({ row, col });
  }, [isWon, puzzle, solution, triggerError]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!activeCell) return;
    const { row, col } = activeCell;
    let newRow = row, newCol = col;
    switch (e.key) {
      case 'ArrowUp': e.preventDefault(); newRow = Math.max(0, row - 1); break;
      case 'ArrowDown': e.preventDefault(); newRow = Math.min(8, row + 1); break;
      case 'ArrowLeft': e.preventDefault(); newCol = Math.max(0, col - 1); break;
      case 'ArrowRight': e.preventDefault(); newCol = Math.min(8, col + 1); break;
      default: return;
    }
    setActiveCell({ row: newRow, col: newCol });
  }, [activeCell]);

  // Game actions
  const handleSolve = useCallback(() => {
    if (isWon || !gameState) return;
    setGameState(prev => ({ ...prev, board: prev.solution.map(row => [...row]) }));
  }, [isWon, gameState]);

  const handleNewGame = useCallback(() => {
    if (gameState && isPuzzleValid(gameState.puzzle)) {
      savePastGame({ ...gameState, mistakes });
    }
    initializeGame(difficulty);
  }, [gameState, difficulty, mistakes, initializeGame]);

  const handleReset = useCallback(() => {
    if (isWon || !gameState) return;
    setGameState(prev => ({ ...prev, board: prev.puzzle.map(row => [...row]) }));
    setMistakes(0);
    setActiveCell(null);
    setErrorCell(null);
  }, [isWon, gameState]);

  const handleLoadPastGame = useCallback((game) => {
    if (!game?.puzzle) return;
    setGameState({
      puzzle: game.puzzle,
      board: game.board,
      solution: game.solution,
      difficulty: game.difficulty || 'medium'
    });
    setMistakes(game.mistakes || 0);
    setIsWon(false);
    setShowConfetti(false);
    setActiveCell(null);
    setErrorCell(null);
  }, []);

  const handleNumberInput = useCallback((num) => {
    if (!activeCell || isWon) return;
    if (puzzle[activeCell.row]?.[activeCell.col] !== 0) return;
    handleCellChange(activeCell.row, activeCell.col, num);
  }, [activeCell, isWon, puzzle, handleCellChange]);

  return {
    // State
    puzzle,
    board,
    solution,
    difficulty,
    activeCell,
    errorCell,
    mistakes,
    isWon,
    showConfetti,
    isLoading: !gameState || !isPuzzleValid(puzzle),
    
    // Actions
    initializeGame,
    handleCellSelect,
    handleCellChange,
    handleKeyDown,
    handleSolve,
    handleNewGame,
    handleReset,
    handleLoadPastGame,
    handleNumberInput
  };
}

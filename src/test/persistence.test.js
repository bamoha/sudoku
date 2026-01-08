import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveGameState,
  loadGameState,
  clearGameState,
  saveTheme,
  loadThemePreference,
  getEffectiveTheme,
  savePastGame,
  loadPastGames,
  deletePastGame,
  clearAllPastGames
} from '../utils/persistence';

describe('Persistence Utils', () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  describe('Game State', () => {
    const mockState = {
      puzzle: [[1, 0], [0, 2]],
      board: [[1, 3], [4, 2]],
      solution: [[1, 3], [4, 2]],
      difficulty: 'medium'
    };

    it('should save game state to localStorage', () => {
      saveGameState(mockState);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'sudoku-game-state',
        JSON.stringify(mockState)
      );
    });

    it('should load game state from localStorage', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify(mockState));
      const result = loadGameState();
      expect(result).toEqual(mockState);
    });

    it('should return null when no saved state', () => {
      localStorage.getItem.mockReturnValue(null);
      const result = loadGameState();
      expect(result).toBeNull();
    });

    it('should clear game state', () => {
      clearGameState();
      expect(localStorage.removeItem).toHaveBeenCalledWith('sudoku-game-state');
    });
  });

  describe('Theme', () => {
    it('should save theme preference', () => {
      saveTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('sudoku-theme', 'dark');
    });

    it('should load theme preference', () => {
      localStorage.getItem.mockReturnValue('dark');
      const result = loadThemePreference();
      expect(result).toBe('dark');
    });

    it('should default to system when no saved theme', () => {
      localStorage.getItem.mockReturnValue(null);
      const result = loadThemePreference();
      expect(result).toBe('system');
    });

    it('should resolve system theme to light/dark', () => {
      expect(getEffectiveTheme('light')).toBe('light');
      expect(getEffectiveTheme('dark')).toBe('dark');
      // System returns based on matchMedia mock (false = light)
      expect(getEffectiveTheme('system')).toBe('light');
    });
  });

  describe('Past Games', () => {
    const mockGame = {
      puzzle: [[1, 0]],
      board: [[1, 3]],
      solution: [[1, 3]],
      difficulty: 'easy',
      mistakes: 2
    };

    it('should save past game with id and timestamp', () => {
      localStorage.getItem.mockReturnValue('[]');
      savePastGame(mockGame);
      
      const savedCall = localStorage.setItem.mock.calls.find(
        call => call[0] === 'sudoku-past-games'
      );
      expect(savedCall).toBeDefined();
      
      const savedGames = JSON.parse(savedCall[1]);
      expect(savedGames.length).toBe(1);
      expect(savedGames[0]).toHaveProperty('id');
      expect(savedGames[0]).toHaveProperty('savedAt');
      expect(savedGames[0].difficulty).toBe('easy');
    });

    it('should load past games', () => {
      const games = [{ id: '1', difficulty: 'easy' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(games));
      const result = loadPastGames();
      expect(result).toEqual(games);
    });

    it('should return empty array when no past games', () => {
      localStorage.getItem.mockReturnValue(null);
      const result = loadPastGames();
      expect(result).toEqual([]);
    });

    it('should delete a specific past game', () => {
      const games = [
        { id: '1', difficulty: 'easy' },
        { id: '2', difficulty: 'hard' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(games));
      deletePastGame('1');
      
      const savedCall = localStorage.setItem.mock.calls.find(
        call => call[0] === 'sudoku-past-games'
      );
      const savedGames = JSON.parse(savedCall[1]);
      expect(savedGames.length).toBe(1);
      expect(savedGames[0].id).toBe('2');
    });

    it('should clear all past games', () => {
      clearAllPastGames();
      expect(localStorage.removeItem).toHaveBeenCalledWith('sudoku-past-games');
    });
  });
});


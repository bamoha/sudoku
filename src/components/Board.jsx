import { useMemo } from 'react';
import Cell from './Cell';
import { getConflicts } from '../utils/sudoku';

const BOARD_SIZE = 9;

export default function Board({
  puzzle,
  board,
  activeCell,
  errorCell,
  onCellSelect,
  onCellChange,
  onKeyDown
}) {
  // Calculate all conflicts for highlighting
  const conflicts = useMemo(() => {
    const conflictSet = new Set();
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row]?.[col]) {
          const cellConflicts = getConflicts(board, row, col);
          if (cellConflicts.length > 0) {
            conflictSet.add(`${row}-${col}`);
            cellConflicts.forEach(({ row: r, col: c }) => {
              conflictSet.add(`${r}-${c}`);
            });
          }
        }
      }
    }
    return conflictSet;
  }, [board]);

  // Determine highlight state for a cell
  const getHighlightInfo = (row, col) => {
    if (!activeCell) return { isHighlighted: false, isSameNumber: false };
    
    const { row: activeRow, col: activeCol } = activeCell;
    const activeValue = board[activeRow]?.[activeCol];
    const cellValue = board[row]?.[col];
    
    const sameRow = row === activeRow;
    const sameCol = col === activeCol;
    const sameBox = Math.floor(row / 3) === Math.floor(activeRow / 3) &&
                    Math.floor(col / 3) === Math.floor(activeCol / 3);
    
    const isHighlighted = sameRow || sameCol || sameBox;
    const isSameNumber = activeValue && cellValue === activeValue && 
                         !(row === activeRow && col === activeCol);
    
    return { isHighlighted, isSameNumber };
  };

  return (
    <div 
      className="w-full aspect-square"
      style={{ 
        maxWidth: 'min(100%, 22rem)',
        maxHeight: 'min(100%, 22rem)'
      }}
    >
      <div className="w-full h-full grid grid-cols-9 
                      border-[3px] border-teal-500 dark:border-teal-400 
                      bg-teal-100 dark:bg-teal-900/30 
                      rounded-xl overflow-hidden 
                      shadow-lg shadow-teal-500/20 dark:shadow-teal-400/10">
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const cellKey = `${row}-${col}`;
            const isInitial = puzzle[row]?.[col] !== 0;
            const isActive = activeCell?.row === row && activeCell?.col === col;
            const isConflict = conflicts.has(cellKey);
            const hasError = errorCell?.row === row && errorCell?.col === col;
            const { isHighlighted, isSameNumber } = getHighlightInfo(row, col);

            return (
              <Cell
                key={cellKey}
                value={board[row]?.[col]}
                row={row}
                col={col}
                isInitial={isInitial}
                isActive={isActive}
                isConflict={isConflict}
                isHighlighted={isHighlighted}
                isSameNumber={isSameNumber}
                hasError={hasError}
                onSelect={onCellSelect}
                onChange={onCellChange}
                onKeyDown={onKeyDown}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

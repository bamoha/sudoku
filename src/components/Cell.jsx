import { useEffect, useState } from 'react';

export default function Cell({
  value,
  row,
  col,
  isInitial,
  isActive,
  isConflict,
  isHighlighted,
  isSameNumber,
  hasError,
  onSelect,
  onChange,
  onKeyDown
}) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (hasError) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 400);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  const handleClick = () => onSelect(row, col);

  const handleChange = (e) => {
    const input = e.target.value;
    if (input === '' || (input.length === 1 && input >= '1' && input <= '9')) {
      onChange(row, col, input === '' ? 0 : parseInt(input, 10));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      if (!isInitial) onChange(row, col, 0);
      return;
    }
    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      if (!isInitial) onChange(row, col, parseInt(e.key, 10));
      return;
    }
    onKeyDown?.(e);
  };

  // 3x3 box boundaries
  const isBoxRight = col % 3 === 2 && col !== 8;
  const isBoxBottom = row % 3 === 2 && row !== 8;

  const displayValue = value ? value.toString() : '';

  const getBackgroundClass = () => {
    if (hasError || isConflict) return 'bg-red-200 dark:bg-red-800/60';
    if (isActive) return 'bg-teal-300 dark:bg-teal-600/80';
    if (isSameNumber && value) return 'bg-teal-200 dark:bg-teal-700/60';
    if (isHighlighted) return 'bg-teal-100/80 dark:bg-teal-800/40';
    if (isInitial) return 'bg-slate-100 dark:bg-slate-800';
    return 'bg-white dark:bg-slate-900';
  };

  const getTextClass = () => {
    if (hasError || isConflict) return 'text-red-700 dark:text-red-200';
    if (isInitial) return 'text-slate-800 dark:text-slate-100';
    return 'text-teal-600 dark:text-teal-300';
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[1-9]"
      value={displayValue}
      readOnly={isInitial}
      onClick={handleClick}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleClick}
      className={`
        w-full h-full text-center select-none
        text-sm sm:text-base font-bold
        border-teal-200/50 dark:border-teal-700/50
        border-t border-l
        ${isBoxRight ? 'border-r-2 border-r-teal-400 dark:border-r-teal-500' : 'border-r'}
        ${isBoxBottom ? 'border-b-2 border-b-teal-400 dark:border-b-teal-500' : 'border-b'}
        ${getBackgroundClass()}
        ${getTextClass()}
        ${isActive ? 'ring-2 ring-inset ring-teal-500 dark:ring-teal-400 z-10' : ''}
        ${isShaking ? 'animate-shake' : ''}
        ${isInitial ? 'cursor-default' : 'cursor-pointer'}
        focus:outline-none
        transition-colors duration-75
      `}
      maxLength={1}
      disabled={isInitial}
      aria-label={`Row ${row + 1}, Column ${col + 1}${isInitial ? ', given ' + value : value ? ', value ' + value : ''}`}
    />
  );
}

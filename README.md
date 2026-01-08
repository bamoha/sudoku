# Sudoku Game

A calm, thoughtfully built Sudoku web app built with React, Vite, and Tailwind CSS. Perfect for learning logic and patience.

## Features

- ✅ **Full Sudoku Rules Enforcement**: Validates rows, columns, and 3×3 boxes
- ✅ **Three Difficulty Levels**: Easy, Medium, and Hard
- ✅ **Game Controls**: Solve, Reshuffle, New Game, and Reset
- ✅ **Theme Support**: Light and dark modes with persistence
- ✅ **State Persistence**: Game state saved to localStorage
- ✅ **Win Celebration**: Confetti animation on completion
- ✅ **Keyboard Navigation**: Arrow keys to move between cells
- ✅ **Mobile Friendly**: Touch-friendly interface
- ✅ **Accessibility**: Keyboard navigation and screen-reader support

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Figtree Font** - Typography (via Google Fonts)

No external UI libraries, state managers, or canvas dependencies.

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
sudoku/
├── src/
│   ├── components/
│   │   ├── Board.jsx          # Main Sudoku board component
│   │   ├── Cell.jsx           # Individual cell component
│   │   ├── Controls.jsx       # Game control buttons
│   │   ├── Confetti.jsx       # Win celebration animation
│   │   └── ThemeToggle.jsx    # Dark/light mode toggle
│   ├── utils/
│   │   ├── sudoku.js          # Game logic (validation, generation, solving)
│   │   └── persistence.js     # LocalStorage utilities
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## How It Works

### Architecture

The app follows a clear separation of concerns:

1. **Game Logic** (`src/utils/sudoku.js`): Pure functions for validation, generation, and solving
2. **State Management** (`src/App.jsx`): React hooks manage board state, puzzle, solution, and difficulty
3. **UI Components**: Render the board, handle input, and display controls

### Sudoku Rules

Sudoku is a 9×9 grid divided into nine 3×3 boxes:

- Every row must contain numbers 1–9 exactly once
- Every column must contain numbers 1–9 exactly once
- Every 3×3 box must contain numbers 1–9 exactly once

A move is valid only if it does not break any of these rules. There is no guessing in Sudoku—every move must be logically valid.

### Core Functions (`src/utils/sudoku.js`)

- **`isValidMove(board, row, col, value)`**: Validates a move before applying it
- **`generateSolvedBoard()`**: Creates a complete valid Sudoku solution using backtracking
- **`createPuzzle(solvedBoard, difficulty)`**: Removes numbers based on difficulty while ensuring unique solution
- **`isBoardComplete(board)`**: Checks if board is complete and valid
- **`solveBoard(board)`**: Solves a puzzle using backtracking
- **`getConflicts(board, row, col)`**: Finds conflicting cells for visual highlighting

### State Management

- **`puzzle`**: Initial board with locked cells (Board type: `number[][]`)
- **`board`**: Current board state with user input (Board type: `number[][]`)
- **`solution`**: Complete valid solution (Board type: `number[][]`)
- **`difficulty`**: Current difficulty level ("easy" | "medium" | "hard")
- Uses React hooks (`useState`, `useEffect`) for state management
- Game state persists to localStorage automatically
- State clears on win condition

### Components

- **Board**: Renders the 9×9 grid with proper 3×3 box boundaries
- **Cell**: Individual input cell with validation and conflict highlighting
- **Controls**: Difficulty selector and game action buttons
- **Confetti**: Lightweight canvas-based celebration animation
- **ThemeToggle**: Switches between light and dark themes

### Persistence

Game state is automatically saved to localStorage:
- Current board state
- Initial puzzle
- Solution
- Difficulty level
- Theme preference

State persists until the puzzle is won, then clears automatically.

## Game Controls

- **Solve**: Instantly fills the board with the correct solution
- **New Game**: Saves current game to past games, then starts a fresh randomized puzzle
- **Reset**: Clears user inputs, restoring the original puzzle
- **Difficulty Selector**: Changes difficulty and generates a new puzzle

## Keyboard Shortcuts

- **Arrow Keys**: Navigate between cells
- **1-9**: Enter numbers
- **Backspace/Delete**: Clear cell

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Visible focus states
- High contrast in both themes
- Screen-reader friendly labels

## License

Built by Bashir Hamza - [bHamza.dev](https://bhamza.dev)


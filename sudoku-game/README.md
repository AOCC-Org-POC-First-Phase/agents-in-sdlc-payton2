# Sudoku Game

A beautiful, fully-featured Sudoku game built with HTML, CSS, and JavaScript, following the Tailspin Toys design guidelines.

## Features

- **Multiple Difficulty Levels**: Easy, Medium, and Hard
- **Interactive Grid**: Click to select cells, type numbers to fill them
- **Real-time Validation**: Invalid moves are highlighted in red
- **Hint System**: Get hints when you're stuck
- **Solution Viewer**: Reveal the complete solution
- **Keyboard Navigation**: Use arrow keys to navigate between cells
- **Modern Dark Theme**: Consistent with Tailspin Toys styling
- **Responsive Design**: Works on desktop and mobile devices

## How to Play

1. Open `index.html` in your web browser
2. Select your preferred difficulty level (Easy, Medium, or Hard)
3. Click "New Game" to generate a fresh puzzle
4. Click on any empty cell to select it
5. Type a number (1-9) to fill the cell
6. Use Delete or Backspace to clear a cell

### Game Rules

- Fill each row with numbers 1-9 (no repeats)
- Fill each column with numbers 1-9 (no repeats)  
- Fill each 3×3 box with numbers 1-9 (no repeats)
- The puzzle is complete when all cells are filled correctly

### Controls

- **New Game**: Generate a new puzzle
- **Check Solution**: Validate your current solution
- **Get Hint**: Fill in one correct number
- **Show Solution**: Reveal the complete solution
- **Arrow Keys**: Navigate between cells
- **Numbers 1-9**: Fill selected cell
- **Delete/Backspace**: Clear selected cell

## Technical Details

### Files

- `index.html`: Main game interface
- `sudoku.js`: Complete game logic and puzzle generation
- `README.md`: This documentation

### Technologies Used

- **HTML5**: Semantic structure
- **Tailwind CSS**: Modern styling framework via CDN
- **Vanilla JavaScript**: Game logic and interactivity
- **CSS Grid**: Responsive layout system

### Game Logic

The game includes:

- **Puzzle Generation**: Creates valid, solvable Sudoku puzzles
- **Backtracking Algorithm**: Ensures generated puzzles have unique solutions
- **Real-time Validation**: Checks moves as you make them
- **Smart Hint System**: Provides helpful hints when requested
- **Difficulty Scaling**: Removes different numbers of clues based on difficulty

## Running the Game

Simply open the `index.html` file in any modern web browser. No server or additional setup required.

```bash
# Navigate to the sudoku-game folder
cd sudoku-game

# Open in your default browser (on macOS)
open index.html

# Or on Linux
xdg-open index.html

# Or on Windows
start index.html
```

## Browser Compatibility

This game works in all modern browsers including:
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Future Enhancements

Potential improvements could include:
- Save/load game state
- Timer and scoring system
- Multiple puzzle packs
- Statistics tracking
- Undo/redo functionality
- Custom puzzle input

---

*Created as part of the Tailspin Toys project demonstration*
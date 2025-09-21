class SudokuGame {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initialGrid = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.difficulty = 'medium';
        this.isGameComplete = false;
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.createGrid();
        this.generateNewPuzzle();
    }

    createGrid() {
        const gridElement = document.getElementById('sudoku-grid');
        gridElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.maxLength = 1;
                cell.className = this.getCellClasses(row, col);
                cell.id = `cell-${row}-${col}`;
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add event listeners
                cell.addEventListener('click', () => this.selectCell(row, col));
                cell.addEventListener('input', (e) => this.handleInput(e, row, col));
                cell.addEventListener('keydown', (e) => this.handleKeyDown(e, row, col));
                
                gridElement.appendChild(cell);
            }
        }
    }

    getCellClasses(row, col) {
        let classes = 'w-12 h-12 text-center font-semibold text-lg border-2 ';
        classes += 'bg-slate-700 text-white focus:bg-slate-600 focus:outline-none ';
        classes += 'transition-all duration-200 ';
        
        // Add borders for 3x3 box separation
        if (col % 3 === 0 && col !== 0) classes += 'border-l-slate-400 ';
        if (row % 3 === 0 && row !== 0) classes += 'border-t-slate-400 ';
        if (col % 3 === 2 && col !== 8) classes += 'border-r-slate-400 ';
        if (row % 3 === 2 && row !== 8) classes += 'border-b-slate-400 ';
        
        classes += 'border-slate-600 rounded ';
        
        return classes;
    }

    bindEvents() {
        document.getElementById('new-game').addEventListener('click', () => this.generateNewPuzzle());
        document.getElementById('check-solution').addEventListener('click', () => this.checkSolution());
        document.getElementById('hint').addEventListener('click', () => this.giveHint());
        document.getElementById('solve').addEventListener('click', () => this.showSolution());
        
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => {
                    b.classList.remove('active', 'bg-slate-600');
                    b.classList.add('bg-slate-700');
                });
                e.target.classList.add('active', 'bg-slate-600');
                e.target.classList.remove('bg-slate-700');
                this.difficulty = e.target.dataset.difficulty;
                this.generateNewPuzzle();
            });
        });
    }

    selectCell(row, col) {
        // Remove previous selection
        if (this.selectedCell) {
            const prevCell = document.getElementById(`cell-${this.selectedCell.row}-${this.selectedCell.col}`);
            prevCell.classList.remove('ring-2', 'ring-blue-500');
        }
        
        // Select new cell
        this.selectedCell = { row, col };
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('ring-2', 'ring-blue-500');
        cell.focus();
    }

    handleInput(e, row, col) {
        const value = e.target.value;
        
        if (value === '' || (value >= '1' && value <= '9')) {
            this.grid[row][col] = value === '' ? 0 : parseInt(value);
            
            // Check if move is valid and update styling
            if (value !== '') {
                if (this.isValidMove(row, col, parseInt(value))) {
                    e.target.classList.remove('bg-red-800');
                    e.target.classList.add('text-green-400');
                } else {
                    e.target.classList.add('bg-red-800');
                    e.target.classList.remove('text-green-400');
                }
            } else {
                e.target.classList.remove('bg-red-800', 'text-green-400');
            }
            
            this.checkCompletion();
        } else {
            e.target.value = '';
        }
    }

    handleKeyDown(e, row, col) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (this.initialGrid[row][col] === 0) {
                this.grid[row][col] = 0;
                e.target.value = '';
                e.target.classList.remove('bg-red-800', 'text-green-400');
            }
        }
        
        // Arrow key navigation
        let newRow = row, newCol = col;
        switch(e.key) {
            case 'ArrowUp': newRow = Math.max(0, row - 1); break;
            case 'ArrowDown': newRow = Math.min(8, row + 1); break;
            case 'ArrowLeft': newCol = Math.max(0, col - 1); break;
            case 'ArrowRight': newCol = Math.min(8, col + 1); break;
            default: return;
        }
        
        e.preventDefault();
        this.selectCell(newRow, newCol);
    }

    generateNewPuzzle() {
        this.isGameComplete = false;
        this.updateStatus('Generating new puzzle...', 'text-blue-400');
        
        // Start with empty grids
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        
        // Generate a complete valid solution
        this.generateCompleteSolution();
        
        // Copy solution to grid
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.grid[i][j] = this.solution[i][j];
            }
        }
        
        // Remove numbers based on difficulty
        this.removeNumbersForDifficulty();
        
        // Store initial state
        this.initialGrid = this.grid.map(row => [...row]);
        
        // Update display
        this.updateDisplay();
        this.updateStatus('New puzzle generated! Good luck!', 'text-green-400');
    }

    generateCompleteSolution() {
        this.fillGrid(this.solution);
    }

    fillGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    
                    for (const num of numbers) {
                        if (this.isValidPlacement(grid, row, col, num)) {
                            grid[row][col] = num;
                            
                            if (this.fillGrid(grid)) {
                                return true;
                            }
                            
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    isValidPlacement(grid, row, col, num) {
        // Check row
        for (let j = 0; j < 9; j++) {
            if (grid[row][j] === num) return false;
        }
        
        // Check column
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (grid[i][j] === num) return false;
            }
        }
        
        return true;
    }

    removeNumbersForDifficulty() {
        const cellsToRemove = {
            easy: 40,
            medium: 50,
            hard: 60
        };
        
        const toRemove = cellsToRemove[this.difficulty];
        const cells = [];
        
        // Create array of all cell positions
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                cells.push([i, j]);
            }
        }
        
        // Shuffle and remove numbers
        this.shuffleArray(cells);
        for (let i = 0; i < toRemove && i < cells.length; i++) {
            const [row, col] = cells[i];
            this.grid[row][col] = 0;
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateDisplay() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                const value = this.grid[row][col];
                
                cell.value = value === 0 ? '' : value.toString();
                
                // Style initial numbers differently
                if (this.initialGrid[row][col] !== 0) {
                    cell.classList.add('text-slate-300', 'font-bold');
                    cell.classList.remove('text-white');
                    cell.readOnly = true;
                } else {
                    cell.classList.remove('text-slate-300', 'font-bold');
                    cell.classList.add('text-white');
                    cell.readOnly = false;
                }
                
                // Reset styling
                cell.classList.remove('bg-red-800', 'text-green-400');
            }
        }
    }

    isValidMove(row, col, num) {
        // Temporarily place the number
        const original = this.grid[row][col];
        this.grid[row][col] = num;
        
        const isValid = this.isValidPlacement(this.grid, row, col, num);
        
        // Restore original value
        this.grid[row][col] = original;
        
        return isValid;
    }

    checkSolution() {
        let isComplete = true;
        let hasErrors = false;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                const value = this.grid[row][col];
                
                if (value === 0) {
                    isComplete = false;
                } else if (!this.isValidMove(row, col, value) && this.initialGrid[row][col] === 0) {
                    hasErrors = true;
                    cell.classList.add('bg-red-800');
                } else {
                    cell.classList.remove('bg-red-800');
                }
            }
        }
        
        if (hasErrors) {
            this.updateStatus('There are errors in your solution! Red cells show conflicts.', 'text-red-400');
        } else if (isComplete) {
            this.updateStatus('Congratulations! Puzzle solved correctly!', 'text-green-400');
            this.isGameComplete = true;
        } else {
            this.updateStatus('Keep going! No errors so far.', 'text-yellow-400');
        }
    }

    checkCompletion() {
        let isComplete = true;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    isComplete = false;
                    break;
                }
            }
            if (!isComplete) break;
        }
        
        if (isComplete && !this.isGameComplete) {
            setTimeout(() => this.checkSolution(), 100);
        }
    }

    giveHint() {
        const emptyCells = [];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push([row, col]);
                }
            }
        }
        
        if (emptyCells.length === 0) {
            this.updateStatus('No more hints needed - puzzle is complete!', 'text-green-400');
            return;
        }
        
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const [row, col] = randomCell;
        const correctValue = this.solution[row][col];
        
        this.grid[row][col] = correctValue;
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.value = correctValue.toString();
        cell.classList.add('text-blue-400', 'font-semibold');
        
        this.updateStatus(`Hint: Cell at row ${row + 1}, column ${col + 1} is ${correctValue}`, 'text-blue-400');
        this.checkCompletion();
    }

    showSolution() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.initialGrid[row][col] === 0) {
                    this.grid[row][col] = this.solution[row][col];
                    const cell = document.getElementById(`cell-${row}-${col}`);
                    cell.value = this.solution[row][col].toString();
                    cell.classList.add('text-orange-400');
                    cell.classList.remove('bg-red-800');
                }
            }
        }
        
        this.updateStatus('Solution revealed! Start a new game to try again.', 'text-orange-400');
        this.isGameComplete = true;
    }

    updateStatus(message, colorClass) {
        const statusElement = document.getElementById('game-status');
        statusElement.textContent = message;
        statusElement.className = `text-center mb-6 text-lg font-medium ${colorClass}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
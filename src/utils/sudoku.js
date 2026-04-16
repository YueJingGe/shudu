const BOARD_SIZE = 9;
const BOX_SIZE = 3;

const BLANKS_BY_DIFFICULTY = {
  easy: 36,
  medium: 46,
  hard: 54,
};

export const DIFFICULTIES = Object.keys(BLANKS_BY_DIFFICULTY);

export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function isPlacementValid(board, row, col, num) {
  for (let i = 0; i < BOARD_SIZE; i += 1) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const rowStart = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const colStart = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = rowStart; r < rowStart + BOX_SIZE; r += 1) {
    for (let c = colStart; c < colStart + BOX_SIZE; c += 1) {
      if (board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

function fillBoard(board) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] !== 0) {
        continue;
      }

      const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const candidate of candidates) {
        if (!isPlacementValid(board, row, col, candidate)) {
          continue;
        }
        board[row][col] = candidate;
        if (fillBoard(board)) {
          return true;
        }
        board[row][col] = 0;
      }
      return false;
    }
  }

  return true;
}

export function generateSolvedBoard() {
  const board = createEmptyBoard();
  fillBoard(board);
  return board;
}

export function createPuzzleFromSolution(
  solution,
  difficulty = "easy",
) {
  const blanks =
    BLANKS_BY_DIFFICULTY[difficulty] ?? BLANKS_BY_DIFFICULTY.easy;
  const puzzle = cloneBoard(solution);

  const positions = shuffle(
    Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, idx) => idx),
  );

  for (let i = 0; i < blanks; i += 1) {
    const index = positions[i];
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    puzzle[row][col] = 0;
  }

  return puzzle;
}

export function generatePuzzle(difficulty = "easy") {
  const solution = generateSolvedBoard();
  const puzzle = createPuzzleFromSolution(solution, difficulty);
  return { puzzle, solution };
}

export function isBoardComplete(board) {
  return board.every((row) =>
    row.every((value) => value >= 1 && value <= 9),
  );
}

export function isBoardCorrect(board, solution) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

export function getConflicts(board) {
  const conflicts = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(false),
  );

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const seen = new Map();
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const value = board[row][col];
      if (value === 0) continue;
      if (!seen.has(value)) seen.set(value, []);
      seen.get(value).push([row, col]);
    }
    seen.forEach((cells) => {
      if (cells.length > 1) {
        cells.forEach(([r, c]) => {
          conflicts[r][c] = true;
        });
      }
    });
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    const seen = new Map();
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      const value = board[row][col];
      if (value === 0) continue;
      if (!seen.has(value)) seen.set(value, []);
      seen.get(value).push([row, col]);
    }
    seen.forEach((cells) => {
      if (cells.length > 1) {
        cells.forEach(([r, c]) => {
          conflicts[r][c] = true;
        });
      }
    });
  }

  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += BOX_SIZE) {
      const seen = new Map();
      for (let row = boxRow; row < boxRow + BOX_SIZE; row += 1) {
        for (let col = boxCol; col < boxCol + BOX_SIZE; col += 1) {
          const value = board[row][col];
          if (value === 0) continue;
          if (!seen.has(value)) seen.set(value, []);
          seen.get(value).push([row, col]);
        }
      }
      seen.forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach(([r, c]) => {
            conflicts[r][c] = true;
          });
        }
      });
    }
  }

  return conflicts;
}

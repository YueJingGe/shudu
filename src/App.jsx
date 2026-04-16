import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Controls from "./components/Controls";
import SudokuBoard from "./components/SudokuBoard";
import { useTimer } from "./hooks/useTimer";
import { loadGame, saveGame } from "./utils/storage";
import {
  cloneBoard,
  generatePuzzle,
  getConflicts,
  isBoardComplete,
  isBoardCorrect,
} from "./utils/sudoku";

function App() {
  const initialGame = useMemo(() => {
    const saved = loadGame();
    if (saved?.board && saved?.puzzle && saved?.solution) {
      return {
        difficulty: saved.difficulty ?? "easy",
        puzzle: saved.puzzle,
        board: saved.board,
        solution: saved.solution,
        status: saved.status ?? "已恢复上次进度。",
        elapsedSeconds: saved.elapsedSeconds ?? 0,
      };
    }

    const { puzzle, solution } = generatePuzzle("easy");
    return {
      difficulty: "easy",
      puzzle,
      board: cloneBoard(puzzle),
      solution,
      status: "新游戏已开始，祝你好运！",
      elapsedSeconds: 0,
    };
  }, []);

  const [difficulty, setDifficulty] = useState(initialGame.difficulty);
  const [puzzle, setPuzzle] = useState(initialGame.puzzle);
  const [board, setBoard] = useState(initialGame.board);
  const [solution, setSolution] = useState(initialGame.solution);
  const [status, setStatus] = useState(initialGame.status);

  const { seconds, formatted, isRunning, reset, pause } = useTimer(
    initialGame.elapsedSeconds,
    true,
  );

  useEffect(() => {
    saveGame({
      difficulty,
      puzzle,
      board,
      solution,
      elapsedSeconds: seconds,
      status,
    });
  }, [board, difficulty, puzzle, seconds, solution, status]);

  const conflicts = useMemo(() => getConflicts(board), [board]);

  function startNewGame(nextDifficulty) {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(
      nextDifficulty,
    );
    const newBoard = cloneBoard(newPuzzle);
    setDifficulty(nextDifficulty);
    setPuzzle(newPuzzle);
    setBoard(newBoard);
    setSolution(newSolution);
    setStatus("新游戏已开始，祝你好运！");
    reset(0, true);
  }

  function handleCellChange(row, col, rawValue) {
    if (puzzle[row][col] !== 0) return;

    const char = rawValue.trim().slice(-1);
    const nextValue = /^[1-9]$/.test(char) ? Number(char) : 0;

    setBoard((current) => {
      const next = cloneBoard(current);
      next[row][col] = nextValue;
      return next;
    });
    setStatus("继续填写中...");
  }

  function handleCheck() {
    if (!isBoardComplete(board)) {
      setStatus("还没填完，继续加油！");
      return;
    }

    if (isBoardCorrect(board, solution)) {
      setStatus("恭喜你，已完成本局数独！");
      pause();
      return;
    }

    setStatus("答案有误，请检查红色冲突格。");
  }

  return (
    <main className="app">
      <header className="header">
        <h1>数独游戏</h1>
        <p>填写 1-9，每行、每列、每个 3x3 宫都不能重复。</p>
      </header>

      <Controls
        difficulty={difficulty}
        timerText={formatted}
        isRunning={isRunning}
        onDifficultyChange={setDifficulty}
        onNewGame={() => startNewGame(difficulty)}
        onCheck={handleCheck}
      />

      <SudokuBoard
        puzzle={puzzle}
        board={board}
        conflicts={conflicts}
        onCellChange={handleCellChange}
      />

      <p className="status" aria-live="polite">
        {status}
      </p>
    </main>
  );
}

export default App;

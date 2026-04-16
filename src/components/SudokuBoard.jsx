function SudokuBoard({ puzzle, board, conflicts, onCellChange }) {
  return (
    <section className="board-wrapper">
      <div className="board" role="grid" aria-label="Sudoku board">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const fixed = puzzle[rowIndex][colIndex] !== 0;
            const conflict = conflicts[rowIndex][colIndex];
            const classNames = [
              "cell",
              fixed ? "fixed" : "editable",
              conflict ? "conflict" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={classNames}
                type="text"
                inputMode="numeric"
                pattern="[1-9]*"
                maxLength={1}
                value={value === 0 ? "" : value}
                readOnly={fixed}
                aria-label={`第${rowIndex + 1}行 第${colIndex + 1}列`}
                onChange={(event) =>
                  onCellChange(rowIndex, colIndex, event.target.value)
                }
              />
            );
          }),
        )}
      </div>
    </section>
  );
}

export default SudokuBoard;

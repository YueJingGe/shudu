const difficultyLabels = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

function Controls({
  difficulty,
  timerText,
  isRunning,
  onDifficultyChange,
  onNewGame,
  onCheck,
}) {
  return (
    <section className="controls">
      <div className="control-group">
        <label htmlFor="difficulty-select">难度</label>
        <select
          id="difficulty-select"
          value={difficulty}
          onChange={(event) => onDifficultyChange(event.target.value)}
        >
          {Object.entries(difficultyLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="timer" aria-live="polite">
        <span>计时</span>
        <strong>{timerText}</strong>
        <small>{isRunning ? "进行中" : "已暂停"}</small>
      </div>

      <div className="button-row">
        <button type="button" onClick={onNewGame}>
          新游戏
        </button>
        <button type="button" className="secondary" onClick={onCheck}>
          检查答案
        </button>
      </div>
    </section>
  );
}

export default Controls;

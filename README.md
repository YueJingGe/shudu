# React 数独游戏（JavaScript + Vite + React）

这是一个纯前端的数独游戏，实现了基础的可玩流程：生成题目、填写、冲突提示、答案检查、计时与本地保存/恢复。

## 功能

- 新游戏（随机生成题盘）
- 难度选择：简单 / 中等 / 困难
- 计时器：显示已用时间
- 检查答案：
  - 未填完会提示
  - 填完并正确会给出完成提示
  - 错误会高亮冲突格
- 本地保存进度：刷新页面后可恢复

## 启动

在项目目录运行：

```bash
npm run dev
```

浏览器打开：`http://localhost:5173/`

## 构建

```bash
npm run build
```

## 代码位置（快速了解）

- 数独算法：`src/utils/sudoku.js`
- 本地存档：`src/utils/storage.js`
- 棋盘组件：`src/components/SudokuBoard.jsx`
- 控件组件：`src/components/Controls.jsx`
- 入口与页面编排：`src/App.jsx`、`src/main.jsx`

const STORAGE_KEY = "react-sudoku-save";

export function saveGame(payload) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...payload,
        updatedAt: Date.now(),
      }),
    );
  } catch {
    // Ignore storage errors to avoid breaking gameplay.
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSavedGame() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors to avoid breaking gameplay.
  }
}

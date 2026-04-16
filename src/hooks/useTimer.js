import { useCallback, useEffect, useMemo, useState } from "react";

export function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useTimer(initialSeconds = 0, initialRunning = false) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(initialRunning);

  useEffect(() => {
    if (!isRunning) return undefined;
    const timerId = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [isRunning]);

  const formatted = useMemo(() => formatSeconds(seconds), [seconds]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((nextSeconds = 0, shouldRun = true) => {
    setSeconds(nextSeconds);
    setIsRunning(shouldRun);
  }, []);

  return {
    seconds,
    isRunning,
    formatted,
    start,
    pause,
    reset,
  };
}

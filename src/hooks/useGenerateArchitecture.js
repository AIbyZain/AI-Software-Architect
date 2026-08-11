import { useCallback, useRef, useState } from 'react';
import { generateArchitecture } from '../services/api';

const STORAGE_KEY = 'architect:lastResult';

export function saveResultToSession(result) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // sessionStorage can fail in private-browsing edge cases; non-critical.
  }
}

export function readResultFromSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useGenerateArchitecture() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef(null);

  const run = useCallback(async ({ projectName, userPrompt }) => {
    setStatus('loading');
    setError(null);
    setElapsedMs(0);

    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 250);

    try {
      const data = await generateArchitecture({ projectName, userPrompt });
      clearInterval(timerRef.current);
      setResult(data);
      saveResultToSession(data);
      setStatus('success');
      return data;
    } catch (err) {
      clearInterval(timerRef.current);
      setError(err);
      setStatus('error');
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setStatus('idle');
    setError(null);
    setResult(null);
    setElapsedMs(0);
  }, []);

  return { status, error, result, elapsedMs, run, reset };
}

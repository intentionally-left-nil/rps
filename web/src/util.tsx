import React, { useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    const existing = window.localStorage.getItem(key);
    return existing == null ? initial : JSON.parse(existing);
  });

  useEffect(() => {
    if (state == null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);
  return [state, setState];
}

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

export function useBackend<D, T>(
  path: string,
  method: string,
  data: D | void,
  onSuccess: (data: T) => void
) {
  useEffect(() => {
    if (data == null) {
      return;
    }

    let url = `http://localhost:5000/${path}`;
    let body = null;
    switch (method.toUpperCase()) {
      case 'GET':
        url += `?` + new URLSearchParams(data).toString();
        break;
      case 'PUT':
      case 'PATCH':
      case 'POST':
        body = JSON.stringify(data);
        break;
    }
    const headers = {
      'Content-Type': 'application/json',
    };
    fetch(url, { method, headers, body })
      .then((resp) => {
        if (resp.ok) {
          return resp.json().then((result) => onSuccess(result));
        } else {
          // TODO handle errors
          console.log(resp);
        }
      })
      .catch((resp) => {
        // TODO handle errors
        console.log(resp);
      });
  }, [data, method, onSuccess, path]);
}

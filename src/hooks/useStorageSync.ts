import { useEffect, useRef, useState } from 'react';
import { subscribe } from '../services/storage';

/**
 * Keeps React state in step with localStorage. `read` is re-run whenever one of `keys` changes
 * (in this tab or another tab) and whenever `dep` changes (for example, the signed-in user id).
 */
export function useStorageSync<T>(keys: string[], read: () => T, dep: string | number = 0): T {
  const [value, setValue] = useState<T>(read);
  const readRef = useRef(read);
  readRef.current = read;
  const keyList = keys.join('|');

  useEffect(() => {
    const update = () => setValue(readRef.current());
    update();
    const unsubscribers = keyList.split('|').map((k) => subscribe(k, update));
    return () => unsubscribers.forEach((u) => u());
  }, [keyList, dep]);

  return value;
}
import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(key: string, initial: T) => {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);

      if (item) {
        setValue(JSON.parse(item));
      }
    } catch {}
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
};

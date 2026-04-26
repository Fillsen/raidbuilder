'use client';

import { useMap } from '@/shared/hooks/use-map';

export const AboutWidget = () => {
  const [map, { set, remove, clear }] = useMap<string, string>([
    ['apples', '10'],
  ]);

  return (
    <div>
      <button
        onClick={() => set(Date.now().toString(), new Date().toISOString())}
      >
        Add
      </button>

      <button onClick={clear}>Reset</button>

      <button onClick={() => remove('apples')} disabled={!map.has('apples')}>
        Remove apples
      </button>

      <pre>{JSON.stringify(Object.fromEntries(map), null, 2)}</pre>
    </div>
  );
};

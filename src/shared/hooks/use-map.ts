/** example:
 * 'use client';

import { useMap } from '@/shared/hooks/use-map';

export const AboutPage = () => {
  const [map, actions] = useMap<string, string>();

  return (
    <div style={{ padding: 20 }}>
      ALO
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => actions.set('a', '1')}>set a</button>
        <button onClick={() => actions.set('b', '2')}>set b</button>
        <button onClick={() => actions.set('c', '3')}>set c</button>

        <button onClick={() => actions.remove('a')}>remove a</button>
        <button onClick={() => actions.remove('b')}>remove b</button>
        <button onClick={() => actions.remove('c')}>remove c</button>
        <button onClick={() => actions.clear()}>clear</button>
      </div>
      <hr />
      <pre>{JSON.stringify(Array.from(map.entries()), null, 2)}</pre>
    </div>
  );
};
 */
import { useMemo, useState } from 'react';

type TMapActions<K, V> = {
  set: (key: K, value: V) => void;
  remove: (key: K) => void;
  clear: () => void;
};

export function useMap<K, V>(
  initialValue?: Iterable<readonly [K, V]>
): [Map<K, V>, TMapActions<K, V>] {
  const [map, setMap] = useState<Map<K, V>>(() => new Map(initialValue));

  const actions = useMemo<TMapActions<K, V>>(
    () => ({
      set: (key, value) => {
        setMap((prev) => {
          const next = new Map(prev);
          next.set(key, value);
          return next;
        });
      },

      remove: (key) => {
        setMap((prev) => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
      },

      clear: () => {
        setMap(() => new Map());
      },
    }),
    []
  );

  return [map, actions];
}

'use client';

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

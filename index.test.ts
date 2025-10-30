import assert from 'node:assert';
import { test } from 'node:test';

import { splitArrayBy } from './lib/caroshark-utils';

test("sample test", (t: any) => {
  const value: string = "42";
  assert.strictEqual(1 + 1, value);
});

test("util test", (t: any) => {
  assert.deepEqual(
    splitArrayBy([1, 2, 0, 3, 4, 0, 5], (x) => x == 0),
    [[1, 2], [3, 4], [5]]
  );
});

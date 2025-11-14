import { setTimeout } from 'node:timers/promises';

import { InToJSParser } from 'in-to-js';

import { runCaroshark } from './lib/caroshark';

export const parser = (s: string[]) =>
  InToJSParser.create(s).number("n").lines("lines", "n").build();

runCaroshark({
  parser,
  main: async (data, subLevel) => {
    let result = await setTimeout(1000 * Math.pow(2, subLevel), subLevel);
    return 99 + 1 + subLevel;
  },
});

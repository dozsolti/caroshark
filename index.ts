import { InToJSParser } from 'in-to-js';

import { runCaroshark } from './lib/caroshark';

export const parser = (s: string[]) =>
  InToJSParser.create(s).number("n").lines("lines", "n").build();

runCaroshark({
  parser,
  main: async (data) => {
    let result = 0;


    return result;
  },
});

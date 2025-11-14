import { InToJSParser } from 'in-to-js';

import { runCaroshark } from './lib/caroshark';

export const parser = (s: string[]) =>
  InToJSParser.create(s)
    .number("n")
    .lines("lines", "n", (l) => l.split(" ").map((x) => +x))
    .build();

runCaroshark({
  parser,
  subLevelRange: [1,2],
  main: async (data) => {
    let result = [];
    for (const line of data.lines) {
      result.push(
        line.reduce((acc, curr) => acc + curr, 0)
      )
    }

    return result.join("\n");
  },
});

import { InToJSParser } from 'in-to-js';

import { runCaroshark } from './lib/caroshark';

export const parser = (s: string[]) =>
  InToJSParser.create(s)
    .number("n")
    .lines("lines", "n", (l) => l.split(" ").map((x) => +x))
    .build();

runCaroshark({
  parser,
  subLevelRange: [1, 2],
  main: async (data) => {
    let result = [];
    for (const line of data.lines) {
      let x = { sum: 0, pos: 0 };
      for (const v of line) {
        x.sum += Math.abs(v);
        if(v==0)
          x.sum += 1;

        if(v>0){
          x.pos += 1;
        }
        else if(v<0){
          x.pos -= 1;
        }
      }
      result.push(x.pos + " " + x.sum);
    }

    return result.join("\n");
  },
});

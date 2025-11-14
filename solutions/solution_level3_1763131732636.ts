import { InToJSParser } from 'in-to-js';

import { runCaroshark } from './lib/caroshark';

export const parser = (s: string[]) =>
  InToJSParser.create(s)
    .number("n")
    .arrayOfObject("lines", "n", (p) => p.numbers("spaceStation timeLimit"))
    .build();

runCaroshark({
  parser,
  subLevelRange: [1, 2],
  main: async (data) => {
    let result: any = [];

    for (let { spaceStation, timeLimit } of data.lines) {
      // spaceStation = -10;
      let s = [0];
      if (spaceStation == 1) {
        s = [0, 5, 0];
      } else if (spaceStation == -1) {
        s = [0, -5, 0];
      } else if (spaceStation == 2) {
        s = [0, 5, 5, 0];
      } else if (spaceStation == -2) {
        s = [0, -5, -5, 0];
      } else {
        const maxSpeed =
          Math.abs(spaceStation) > 10
            ? 1
            : 5 - Math.floor((Math.abs(spaceStation) - 1) / 2);

        let i = 6;
        while (i > maxSpeed) {
          i--;
          s.push(i);
        }

        if (Math.abs(spaceStation) > 10) {
          let unuCount = Math.abs(spaceStation) - 8;

          for (let j = 0; j < unuCount - 1; j++) {
            s.push(1);
          }
        } else {
          if (spaceStation % 2 == 0) {
            s.push(maxSpeed);
          }
        }

        i++;
        while (i <= 5) {
          s.push(i);
          i++;
        }

        s.push(0);
      }

      result.push(s.map((x) => (spaceStation < 0 ? -x : x)).join(" "));
    }

    return result.join("\n");
  },
});

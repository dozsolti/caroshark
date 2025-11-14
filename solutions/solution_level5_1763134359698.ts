import { InToJSParser } from 'in-to-js';

import { runCaroshark } from './lib/caroshark';

export const parser = (s: string[]) =>
  InToJSParser.create(s)
    .number("n")
    .arrayOfObject("lines", "n", (p) => p.lines("row", 2))
    .build();

runCaroshark({
  parser,
  subLevelRange: [1, 2],
  main: async (data) => {
    let max = 0;
    for (let line of data.lines) {
      let [l1, l2] = line.row;
      let l1Split = l1.split(" ");

      const posX = +l1Split[0].split(",")[0];
      const posY = +l1Split[0].split(",")[1];
      const timeLimit = +l1Split[1];
      const posAsteriodX = +l2.split(",")[0];
      const posAsteriodY = +l2.split(",")[1];

      console.log(
        `Position: (${posX}, ${posY}), Time Limit: ${timeLimit} Asteroid Position: (${posAsteriodX}, ${posAsteriodY})`
      );

      // let m = new Array(Math.abs(posX)).fill(0).map(() => new Array().fill(0));

      max = Math.max(
        max,
        Math.abs(posX),
        Math.abs(posY),
        Math.abs(posAsteriodX),
        Math.abs(posAsteriodY)
      );
      // printMatrix(m);
    }

    return max;
    /* let result: any = [];
    for (let row of data.lines) {
      let _v = row.split(" ");
      const posX = +_v[0].split(",")[0];
      const posY = +_v[0].split(",")[1];
      const timeLimit = +_v[1];

      result.push(calcSeq(posX));
      result.push(calcSeq(posY));
      result.push("");
    }

    return result.join("\n"); */
  },
});

function calcSeq(spaceStation: number) {
  if (spaceStation === 0) return "0 0";
  let s = [0];
  const maxSpeed = Math.min(
    5,
    Math.abs(spaceStation) > 10
      ? 1
      : 5 - Math.floor((Math.abs(spaceStation) - 1) / 2)
  );

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
  return s.map((x) => (spaceStation < 0 ? -x : x)).join(" ");
}

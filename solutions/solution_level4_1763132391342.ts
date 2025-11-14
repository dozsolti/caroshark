import { InToJSParser } from 'in-to-js';

import { runCaroshark } from './lib/caroshark';

export const parser = (s: string[]) =>
  InToJSParser.create(s).number("n").array("lines", "n").build();

runCaroshark({
  parser,
  subLevelRange: [1, 2],
  main: async (data) => {
    let result: any = [];

    for (let row of data.lines) {
      let _v = row.split(" ");
      const posX = +_v[0].split(",")[0];
      const posY = +_v[0].split(",")[1];
      const timeLimit = +_v[1];

      result.push(calcSeq(posX));
      result.push(calcSeq(posY));
      result.push("");
    }

    return result.join("\n");
  },
});
function calcSeq(spaceStation: number) {
  let s = [0];
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
  return s.map((x) => (spaceStation < 0 ? -x : x)).join(" ");
}

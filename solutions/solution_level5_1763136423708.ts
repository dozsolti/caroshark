import { InToJSParser } from 'in-to-js';
import PF from 'pathfinding';

import { runCaroshark } from './lib/caroshark';
import { findPath } from './lib/caroshark-utils';

export const parser = (s: string[]) =>
  InToJSParser.create(s)
    .number("n")
    .arrayOfObject("lines", "n", (p) => p.lines("row", 2))
    .build();

runCaroshark({
  parser,
  subLevelRange: 1,
  main: async (data) => {
    let result: any = [];

    let offsetX = 100;
    let offsetY = 100;

    for (let line of data.lines) {
      let rX = "",
        rY = "";
      let [l1, l2] = line.row;
      let l1Split = l1.split(" ");

      const posX = +l1Split[0].split(",")[0];
      const posY = +l1Split[0].split(",")[1];
      const timeLimit = +l1Split[1];
      const posAsteriodX = +l2.split(",")[0];
      const posAsteriodY = +l2.split(",")[1];

      // console.log(
      //   `Position: (${posX}, ${posY}), Time Limit: ${timeLimit} Asteroid Position: (${posAsteriodX}, ${posAsteriodY})`
      // );

      let m = new Array(offsetX * 2 + 1)
        .fill(0)
        .map(() => new Array(offsetY * 2 + 1).fill(0));

      for (let k = -2; k <= 2; k++) {
        for (let j = -2; j <= 2; j++) {
          m[offsetX + posAsteriodX + k][offsetY + posAsteriodY + j] = 1;
        }
      }
      // incepem de la offset offset
      let path = findPath(
        m,
        { x: offsetX, y: offsetY },
        { x: offsetX + posY, y: offsetY + posX }
      );

      let newPath = PF.Util.compressPath(path);
      console.log("after", newPath);

      /*     m[offsetX][offsetY] = 3;
      m[offsetX + posX][offsetY + posY] = 2;
      printMatrixWithPath(
        m,
        path.map((p) => ({
          x: p[0],
          y: p[1],
        }))
      );
      return 0; */

      for (let i = 0; i < newPath.length - 1; i++) {
        const curr = newPath[i];
        const next = newPath[i + 1];

        const deltaX = next[1] - curr[1];
        const deltaY = next[0] - curr[0];

        if (deltaX !== 0) {
          let sq = calcSeq(deltaX);
          rX += sq + " ";
          rY +=
            sq
              .split(" ")
              .map(() => "0")
              .join(" ") + " ";
        }
        if (deltaY !== 0) {
          let sq = calcSeq(deltaY);
          rY += sq + " ";
          rX +=
            sq
              .split(" ")
              .map(() => "0")
              .join(" ") + " ";
        }
      }

      result.push(rY.trim());
      result.push(rX.trim());
      result.push("");
    }
    return result.join("\n");
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

function calcSeq(spaceStation: number): string {
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

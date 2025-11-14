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
  subLevelRange: [1, 2],
  main: async (data) => {
    let result: any = [];

    let offset = 100;
    let m;
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

      m = new Array(offset * 2 + 1)
        .fill(0)
        .map(() => new Array(offset * 2 + 1).fill(0));

      for (let k = -2; k <= 2; k++) {
        for (let j = -2; j <= 2; j++) {
          m[offset + posAsteriodY + k][offset + posAsteriodX + j] = 1;
        }
      }
      // incepem de la offset offset
      let path = findPath(
        m,
        { x: offset, y: offset },
        { x: offset + posX, y: offset + posY }
      );
      // let path = leeAlgorithm(
      //   m,
      //   { x: offset, y: offset },
      //   { x: offset + posX, y: offset + posY }
      // );
      // console.log(path)
      m[offset][offset] = 3; // start
      m[offset + posY][offset + posX] = 2; // tinta

      /*result.push(
        printMatrixWithPath(
          m,
          path.map(([x, y]) => ({ x, y })),
          (value) => {
            if (value === 0) return ".";
            if (value === 1) return "#";
            if (value === 2) return "E";
            if (value === 3) return "S";
            return "*";
          }
        )
      );  */
      // return 0;

      let newPath = PF.Util.compressPath(path);
      // console.log(newPath);

      for (let i = 0; i < newPath.length - 1; i++) {
        const curr = newPath[i];
        const next = newPath[i + 1];

        // if (deltaX < 0) deltaX--;
        // else if (deltaX > 0) deltaX++;
        // if (deltaY < 0) deltaY--;
        // else if (deltaY > 0) deltaY++;
        let deltaX = next[0] - curr[0];
        let deltaY = next[1] - curr[1];

        if (deltaX !== 0) {
          let sqX = calcSeq(deltaX);
          rX += sqX + " ";

          if (deltaY === 0) {
            rY += sqX
              .split(" ")
              .map((x) => "0 ".repeat(Math.abs(+x)))
              .join(" ");
          } else {
            let sqY = calcSeq(deltaY);
            rY += sqY + " ";

            let durX = calcSeqDuration(sqX);
            let durY = calcSeqDuration(sqY);
            let diff = durX - durY -2;

            if (durX > durY) {
              rY += "0 ".repeat(diff) + " ";
            } else {
              rX += "0 ".repeat(-diff) + " ";
            }
          }
        }
        else if (deltaY !== 0) {
          let sqY = calcSeq(deltaY);
          rY += sqY + " ";

          if (deltaX === 0) {
            rX += sqY 
              .split(" ")
              .map((x) => "0 ".repeat(Math.abs(+x)))
              .join(" ");
          } else {
            let sqX = calcSeq(deltaX);
            rX += sqX + " ";

            let durX = calcSeqDuration(sqX);
            let durY = calcSeqDuration(sqY);
            let diff = durX - durY -2;

            if (durX > durY) {
              rY += "0 ".repeat(diff) + " ";
            } else {
              rX += "0 ".repeat(-diff) + " ";
            }
          }
        }
      }

      result.push(
        rX
          .trim()
          .split(" ")
          .filter((x) => x.length > 0)
          .join(" ")
      );
      result.push(
        rY
          .trim()
          .split(" ")
          .filter((x) => x.length > 0)
          .join(" ")
      );
      result.push("");
    }
    return result.join("\r\n");
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

function calcSeqDuration(s: string) {
  return s
    .trim()
    .split(" ")
    .map((x) => +x)
    .reduce((a, b) => a + Math.max(1, Math.abs(b)), 0);
}

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

function leeAlgorithm(
  matrix: number[][],
  start: { x: number; y: number },
  end: { x: number; y: number }
): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const distance = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(-1));
  const parent = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));
  const queue: { x: number; y: number; dist: number }[] = [];

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Mark start position
  distance[start.y][start.x] = 0;
  queue.push({ x: start.x, y: start.y, dist: 0 });

  while (queue.length > 0) {
    const current = queue.shift()!;

    // If we reached the end
    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      const path: number[][] = [];
      let curr = { x: end.x, y: end.y };

      while (curr) {
        path.unshift([curr.x, curr.y]);
        curr = parent[curr.y][curr.x];
      }

      return path;
    }

    // Explore neighbors
    for (const [dy, dx] of directions) {
      const newX = current.x + dx;
      const newY = current.y + dy;

      // Check bounds and if cell is accessible
      if (
        newX >= 0 &&
        newX < cols &&
        newY >= 0 &&
        newY < rows &&
        matrix[newY][newX] === 0 &&
        distance[newY][newX] === -1
      ) {
        distance[newY][newX] = current.dist + 1;
        parent[newY][newX] = { x: current.x, y: current.y };
        queue.push({ x: newX, y: newY, dist: current.dist + 1 });
      }
    }
  }

  return []; // No path found
}

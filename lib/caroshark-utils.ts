import PF from 'pathfinding';

type Position = { x: number; y: number };

export function moveDirection(
  position: Position,
  direction: "W" | "S" | "A" | "D"
): Position {
  let newPosition = { ...position };
  const dir = { W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };

  newPosition.x = dir[direction][0];
  newPosition.y = dir[direction][1];

  return newPosition;
}

export function printMatrix(
  m: any[][] | string[],
  mapFn?: (value: any, row: number, col: number) => string
) {
  if (!mapFn) mapFn = (v) => v + "";
  for (let i = 0; i < m.length; i++) {
    let s = "";
    for (let j = 0; j < m[i].length; j++) s += mapFn(m[i][j], i, j);
    console.log(s);
  }
  console.log("");
}

export function printMatrixWithPath(
  m: any[][] | string[],
  path: Position[],
  mapFn?: (value: any, row: number, col: number) => string
) {
  if (!mapFn) mapFn = (v) => v + "";
  for (let i = 0; i < m.length; i++) {
    let s = "";
    for (let j = 0; j < m[i].length; j++) {
      const isInPath = path.findIndex((p) => p.x == j && p.y == i) != -1;
      if (isInPath) {
        s += "+";
      } else {
        s += mapFn(m[i][j], i, j);
      }
    }
    console.log(s);
  }
  console.log("");
}

export function findPath(
  m: string[][],
  startPos: { x: number; y: number },
  endPos: { x: number; y: number }
) {
  const grid = new PF.Grid(
    m.map((row) =>
      row.map((cel) => {
        if ("WG".includes(cel)) return 1;
        return 0;
      })
    )
  );

  const finder = new PF.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: true,
  });

  const path = finder.findPath(
    startPos.x,
    startPos.y,
    endPos.x,
    endPos.y,
    grid
  );

  return path.map((p) => ({
    x: p[0],
    y: p[1],
  }));
}

/**
 * @description all arrangements of an array (with repetition)
 * @example [101, 202] => [101,101], [101,202], [202,101], [202,202]
 */
export function backtrack<T>(
  arr: T[],
  onSolution: (perm: T[]) => void,
  doCheck?: (element: T, curr: T[], i: number) => boolean,
  iteration: number = 0,
  curr: T[] = []
) {
  if (iteration == arr.length) {
    onSolution(curr.slice());
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    if (doCheck && !doCheck(arr[i], curr, i)) continue;
    curr.push(arr[i]);
    backtrack(arr, onSolution, doCheck, iteration + 1, curr);
    curr.pop();
  }
}

/// Permutations can be filtered only when it becomes a full array.
/**
 * @description array in every order
 * @example [101, 202, 303] => [101,202,303], [101,303,202], [202,101,303], [202,303,101], [303,101,202], [303,202,101]
 */
export function permutations<T>(
  arr: T[],
  onSolution: (perm: T[]) => void,
  doCheck?: (element: T, curr: T[], i: number) => boolean,
  iteration: number = 0,
  curr: T[] = [],
  visited: number[] = []
) {
  if (iteration == arr.length) {
    onSolution(curr.slice());
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    if (visited.includes(i) || (doCheck && !doCheck(arr[i], curr, i))) continue;
    curr.push(arr[i]);
    visited.push(i);
    permutations(arr, onSolution, doCheck, iteration + 1, curr, visited);
    curr.pop();
    visited.pop();
  }
}
/**
 *
 * @description all subsets of an array WITHOUT empty set
 * @example [101, 202, 303] => [101], [202], [303], [101,202], [101,303], [202,303], [101,202,303]
 */
export function subsets<T>(
  arr: T[],
  onSolution: (perm: T[]) => void,
  doCheck?: (element: T, curr: T[], i: number) => boolean,
  n = 0,
  curr: T[] = []
) {
  if (curr.length > 0) {
    onSolution(curr.slice());
  }
  for (let i = n; i < arr.length; ++i) {
    if (doCheck && !doCheck(arr[i], curr, i)) continue;
    curr.push(arr[i]);
    subsets(arr, onSolution, doCheck, i + 1, curr);
    curr.pop();
  }
}

/**
 *
 * @description like string.split but on array
 * @example splitArrayBy([1,2,0,3,4,0,5], x => x == 0) => [[1,2],[3,4],[5]]
 */
export function splitArrayBy(arr, predicate: (x: any) => boolean) {
  return arr
    .reduce((t, v) => {
      if (t.length == 0) t.push([]);

      if (predicate(v)) t.push([]);
      else t[t.length - 1].push(v);
      return t;
    }, [])
    .filter((x) => x.length > 0);
}

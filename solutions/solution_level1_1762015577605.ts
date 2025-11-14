import { setTimeout } from "node:timers/promises";

import { InToJSParser } from "in-to-js";

import { runCaroshark } from "./lib/caroshark";

export const parser = (s: string[]) =>
  InToJSParser.create(s)
    .numbers("n m")
    .lines("lines", "n", (l) => {
      const v = l.split(" ").map((x) => x.substring(0, x.length - 1));
      return {
        r: +v[0],
        p: +v[1],
        s: +v[2],
      };
    })
    .build();

runCaroshark({
  parser,
  main: async (data, subLevel) => {
    let text = "";
    for (const line of data.lines) {
      let result = "";
      // Part 1: worst case
      result += "P" + "R".repeat(data.m / 2 - 1);
      result += "S".repeat(line.s);
      if(result.length > data.m) {
        result = result.substring(0, data.m);
      }

      let count = line.s;
      while (count < data.m / 2) {
        let power = 1 << ((Math.log2(count) | 0) + 1);
        result += "R".repeat(power - count - 1) + "P";
        count = power;
      }

      // Part 2: correct the file
      let p = [...result].filter(c => c === "P").length;
      for(let i=0; i<data.m; i++) {
        if(p >= line.p)
          break;
        if(result[i] == "R"){
          let v = [...result];
          v[i] = "P";
          result = v.join('');
          p++;
        }
      }

      let s = [...result].filter(c => c === "S").length;
      for(let i = data.m/2-1; i > 0; i--) {
        if(s >= line.s)
          break;
        if(result[i] == "R"){
          let v = [...result];
          v[i] = "S";
          result = v.join('');
          s++;
        }
      }
      text += result + "\r\n";
    }
    return text.trimEnd();
  },
});

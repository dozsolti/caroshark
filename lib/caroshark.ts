import AdmZip from 'adm-zip';
import * as fs from 'fs';
import gitDiff from 'git-diff';
import * as path from 'path';

import { parser } from '../index';

const levelsFolder = path.join(path.resolve(), `levels`);

type RunType = "example" | "dev" | "solution";

export async function runCaroshark(config: {
  parser: typeof parser;
  runType?: RunType;

  subLevelRange?: number | [number, number];

  /**
   * Generates every subLevel.
   * Compares to existing out files from this range to match the current output.
   * If matches logs/print the subLevels outside of this range.
   * If not matches it logs the error.
   *
   */
  subLevelGoodRange?: number | [number, number];

  main: (data: ReturnType<typeof parser>, subLevel: number) => any;
  printFunc?: (result: any) => any;
  onFinish?: () => void;
}) {
  console.clear();
  const runType: RunType = config.runType || (process.argv[2] as RunType);
  const printFunc = config.printFunc || console.log;

  const level = findLevel();

  setupFolders(level);

  if (runType === "example") {
    await runExample();
    config.onFinish?.();
    return;
  }

  const inputFiles = readInputFile(level);

  let subLevelsToProcess =
    config.subLevelRange == undefined || config.subLevelGoodRange != undefined
      ? inputFiles
      : inputFiles.filter((x) => isInRange(x.subLevel, config.subLevelRange!));

  const parsedData = subLevelsToProcess.map((s) => ({
    subLevel: s.subLevel,
    fileContent: config.parser(s.fileContent),
  }));

  await runSublevels();
  config.onFinish?.();

  async function runSublevels() {
    const startTime = Date.now();

    await Promise.all(
      parsedData.map(async ({ subLevel, fileContent }) => {
        let output = await config.main(fileContent, subLevel);

        if (output === undefined || output === null) {
          throw Error(
            `No output generated for Level ${level}_${subLevel}, output is: ${output}`
          );
        }

        if (runType === "dev") {
          console.log(
            `Level ${level}_${subLevel} - duration: ${
              Date.now() - startTime
            }ms:`
          );
          printFunc(output);
          console.log("");
        } else if (runType === "solution") {
          output = typeof output === "string" ? output : JSON.stringify(output);
          const outputFilePath = path.join(
            levelsFolder,
            `level${level}_out`,
            `level${level}_${subLevel}.out`
          );
          if (
            config.subLevelGoodRange != undefined &&
            isInRange(subLevel, config.subLevelGoodRange)
          ) {
            if (!fs.existsSync(outputFilePath))
              throw new Error(
                `File doesn't exist ${outputFilePath} for subLevelGoodRange: ${config.subLevelGoodRange}`
              );
            // compare with the old results
            const oldOutput = fs.readFileSync(outputFilePath, {
              encoding: "utf-8",
            });

            detectDiff(
              oldOutput,
              output,
              `It does match old value for level${level}_${subLevel}:`,
              `Matches old level${level}_${subLevel}.out`
            );
          } else {
            await fs.writeFile(outputFilePath, output, (err) => {
              if (err) throw err;
            });

            console.log(
              `Output generated - Level ${level}_${subLevel} - duration: ${
                Date.now() - startTime
              }ms!`
            );
          }
        }
      })
    );
  }

  async function runExample() {
    const exampleIn = readInFile(
      path.join(levelsFolder, `level${level}_in`, `level${level}_0_example.in`)
    );
    const exampleOut = fs
      .readFileSync(
        path.join(
          levelsFolder,
          `level${level}_in`,
          `level${level}_0_example.out`
        ),
        { encoding: "utf-8" }
      )
      .trim();

    const startTime = Date.now();
    const parsedData = config.parser(exampleIn);
    const output = await config.main(parsedData, -1);
    console.log(
      `${new Date().toLocaleTimeString()} - Example level ${level} - duration: ${
        Date.now() - startTime
      }ms:`
    );
    if (output === undefined || output === null) {
      throw Error(`No output generated, output is: ${output}`);
    }

    printFunc(output);
    // detectDiff(exampleOut, output);
  }
}

export function findLevel(): number {
  if (!fs.existsSync(path.join(levelsFolder, `level1.zip`)))
    throw Error("levels/level1.zip not found.");

  let level = 1;
  do {
    const levelPath = path.join(levelsFolder, `level${level}_in`);
    const zipFilePath = path.join(levelsFolder, `level${level}.zip`);
    if (!fs.existsSync(zipFilePath)) {
      return level - 1;
    }
    if (fs.existsSync(zipFilePath) && !fs.existsSync(levelPath)) {
      return level;
    }
    level++;
    if (level > 20) throw Error("Level detection failed. Too many zips found.");
  } while (true);
}

function setupFolders(level: number) {
  // Checks for level1.zip
  const zipFilePath = path.join(levelsFolder, `level${level}.zip`);
  if (!fs.existsSync(zipFilePath))
    throw Error(`Level zip file not found: ${zipFilePath}`);

  // Unzips level1.zip
  const levelPath = path.join(levelsFolder, `level${level}_in`);

  if (!fs.existsSync(path.join(levelPath, `level${level}_1.in`))) {
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(levelPath, true);
  }

  // Create level1_out
  const outputFolder = path.join(levelsFolder, `level${level}_out`);
  if (fs.existsSync(outputFolder)) return;
  fs.mkdirSync(outputFolder);
}

function readInputFile(
  level: number
): { subLevel: number; fileContent: string[] }[] {
  return fs
    .readdirSync(path.join(levelsFolder, `level${level}_in`))
    .filter((f) => !f.includes("example"))
    .map((fileName) => ({
      subLevel: +fileName.split(".")[0].split("_")[1],
      fileContent: readInFile(
        path.join(levelsFolder, `level${level}_in`, fileName)
      ),
    }));
}

function readInFile(p: string) {
  return fs
    .readFileSync(p, { encoding: "utf-8" })
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function detectDiff(
  exampleOut: string,
  output: any,
  title: string = "\nNote: It does match the example.out:",
  matchText?: string
) {
  exampleOut = JSON.stringify(exampleOut);
  output = JSON.stringify(output + "");

  const matchesOut = exampleOut == output;

  if (!matchesOut) {
    console.log("\n" + title);
    console.log(
      gitDiff(exampleOut, output, {
        color: true,
        wordDiff: true,
      })
    );
    console.table({
      exampleOut: exampleOut,
      output: output,
    });
  } else {
    if (matchText) console.log(matchText);
  }
}

function isInRange(n: number, r: number | [number, number]) {
  if (typeof r === "number") return r === n;
  return n >= r[0] && n <= r[1];
}

import fs from 'fs';
import path from 'path';

import { findLevel } from './caroshark';

const oldSolutionPath = path.join(path.resolve(), "solutions");

if (!fs.existsSync(oldSolutionPath)) {
  fs.mkdirSync(oldSolutionPath);
}

const level = findLevel();
fs.copyFileSync(
    path.join(path.resolve(), `index.ts`),
    path.join(oldSolutionPath, `solution_level${level}_${Date.now()}.ts`)  
)
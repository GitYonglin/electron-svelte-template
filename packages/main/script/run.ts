import { spawn } from "child_process";
import electron from "electron";
import chalk from 'chalk';
import {resolve, join} from "path";
import { rootPath } from "./ulity";
import { electron_compile } from "./tsup.electron";
import { copy, pathExists } from "fs-extra";

/** 运行electron */
function runMainProcess(mainFile: string) {
  return spawn(electron as any, [mainFile],
    {
      cwd: rootPath(),
      stdio: 'inherit',
      shell: true
    }); // 执行electron 主程序
};
/** 运行 */
export async function runElectron(url: string, projectName: string = '') {
  const rootCwd = process.cwd();
  await electron_compile();
  // const port = Number(process.argv.slice(2)) || 3000;
  let loadingHtml = join(rootCwd, 'loading', projectName, 'loading.html');
  if (!await pathExists(loadingHtml)) {
    loadingHtml = join(rootCwd, 'loading', 'loading.html');
  }
  process.env.VITE_DEBUG_URL = url;
  process.env.VITE_LOADINGHTML = loadingHtml;
  console.log(chalk.yellow(`启动Electron监听 ${process.env.VITE_DEBUG_URL} ...`));
  runMainProcess(rootPath('dev', 'index.js'))
}

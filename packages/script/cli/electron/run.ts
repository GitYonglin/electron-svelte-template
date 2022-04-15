
import electron from "electron";
import chalk from 'chalk';
import { join, resolve } from "path";
import { getConfigFile, ifMainFile, rootPath } from "./ulity";
import { spawn } from "child_process";

/** 运行electron */
function runMainProcess(mainFile: string) {
  console.log('spawn cwd', process.cwd())
  return spawn(electron as any, [mainFile],
    {
      stdio: 'inherit',
      shell: true
    }); // 执行electron 主程序
};
/** 运行 */
export async function runElectron(build: boolean) {
  const runPath = process.cwd();
  // 获取 配置文件
  const config = (await getConfigFile(runPath))?.dev;
  console.log(config)
  // 判断主进程文件
  const runMainDir = join(runPath, config?.main || '.electron');
  await ifMainFile(runMainDir, build);

  // 监听选择进程调试端口
  process.env.VITE_PORT = config.port;
  console.log(chalk.yellow(`启动Electron监听 ${process.env.VITE_PORT} ...`));

  console.log('rootPath', rootPath(''))
  process.chdir(rootPath(''));
  runMainProcess(join(runMainDir, 'index.cjs'))
  // runMainProcess(rootPath('dev/electron/index.js'))
}

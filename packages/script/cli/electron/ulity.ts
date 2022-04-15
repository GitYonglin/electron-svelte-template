import { join, resolve } from "path";
import chalk from 'chalk';
import { copy, pathExists, writeFileSync, readFile } from "fs-extra";
import { electron_compile } from "./tsup.electron";

export async function getConfigFile(runPath: string) {
  try {
    const configFilePath= join(runPath, 'electron.config.json');
    return JSON.parse(await readFile(configFilePath, 'utf-8'));
  } catch (error) {
    console.log(chalk.red('获取配置文件错误'))
    console.log(error)
  }
}
/** 判断主执行文件是否存在 */
export async function ifMainFile(dirPath: string, build: boolean = false) {
  console.log(join(dirPath, 'index.cjs'))
  if(build || !(await pathExists(join(dirPath, 'index.cjs')))){
    await electron_compile(dirPath);
  }
  return;
}

/** 本项目根目录 */
export function rootPath(p: string): string {
  return join(resolve(__dirname), '../../', p).replaceAll("\\", "/");
}

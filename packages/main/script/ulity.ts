import {join, resolve} from "path";

/** 本项目根目录 */
export function rootPath(...paths: string[]): string {
  // return path.join(path.resolve(__dirname), '../../', p).replaceAll("\\", "/");
  return resolve(join(__dirname, '../', ...paths)).replaceAll("\\", "/");
}

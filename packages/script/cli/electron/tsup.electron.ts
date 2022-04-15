import { build } from "tsup";
import chalk from 'chalk';
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { copy, pathExists } from "fs-extra";
import { join, resolve } from "path";

/** 本项目根目录 */
export function rootPath(p: string): string {
  return join(resolve(__dirname), '../../', p).replaceAll("\\", "/");
}

/** 编译Electron */
export async function electron_compile(outDir: string) {
  console.log(chalk.yellow(`tsup 开始编译...`));
  await copyLoginHTML(outDir)
  return build({
    name: "electron",
    entry: [rootPath('src/electron/index.ts')],
    splitting: false,
    sourcemap: true,
    clean: false,
    dts: false,
    format: ["cjs"],
    platform: "node",
    outDir: outDir,
    external: ["electron", "@nestjs", "electron-serve"],
    bundle: true,
    esbuildPlugins: [
      esbuildDecorators({tsconfig: rootPath("tsconfig.json")})
    ]
  }).then(() => {
    console.log(chalk.green(`编译完成 -> ${outDir}`));
  })
}
/** 复制loading  HTML文件 */
export async function copyLoginHTML(dirPath: string) {
  const filePath = join(dirPath, 'loading.html');
  try {
    if (!await pathExists(filePath)) {
      await copy(rootPath(`loading.html`), filePath);
      console.log(chalk.green(`复制 loading.html 完成`));
    }
  } catch (r) {
    console.log(chalk.yellow(`复制loading.html 发生错误`));
    console.log(r)
  }
}







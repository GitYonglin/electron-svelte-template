import { build } from "tsup";
import chalk from 'chalk';
import { rootPath } from "./ulity";
import { esbuildDecorators } from "@anatine/esbuild-decorators";

/** 编译Electron */
export async function electron_compile() {
  console.log(chalk.yellow(`tsup 开始编译...`));
  console.log(process.cwd());
  console.log(rootPath(''))

  return await build({
    name: "electron",
    entry: [rootPath('src', 'index.ts')],
    splitting: false,
    sourcemap: true,
    clean: false,
    dts: false,
    format: ["cjs"],
    platform: "node",
    outDir: rootPath('dev'),
    external: ["electron", "@nestjs", "electron-serve"],
    bundle: true,
    esbuildPlugins: [
      esbuildDecorators({tsconfig: rootPath("tsconfig.json")})
    ]
  }).then(() => {
    console.log(chalk.green('编译完成'));
  })
}
/** 调试运行 */
// export async function devRun(PORT: number = NaN) {
//   await mainBuild();
//   runElectron(PORT);
// }






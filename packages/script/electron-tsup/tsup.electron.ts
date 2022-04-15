import { build } from "tsup";
import chalk from 'chalk';
import { copyLoginHTML, rootPath } from "./ulity";
import { esbuildDecorators } from "@anatine/esbuild-decorators";

/** 编译Electron */
export async function electron_compile() {
  console.log(chalk.yellow(`tsup 开始编译...`));
  console.log(process.cwd());
  console.log(rootPath(''))

  // await copyLoginHTML()
  function electronProjectPath(...paths: string[]){
    return rootPath('packages', 'electron', ...paths)
  }
  return build({
    name: "electron",
    entry: [electronProjectPath('src', 'index.ts')],
    splitting: false,
    sourcemap: true,
    clean: false,
    dts: false,
    format: ["cjs"],
    platform: "node",
    outDir: electronProjectPath('dev'),
    external: ["electron", "@nestjs", "electron-serve"],
    bundle: true,
    esbuildPlugins: [
      esbuildDecorators({tsconfig: electronProjectPath("tsconfig.json")})
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






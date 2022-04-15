import { compileFile } from "bytenode";
import { copy, pathExists, writeFileSync, readFile } from "fs-extra";
import { platform } from "os"
import {copyLoginHTML, rootPath, setChdir} from "./ulity";
import chalk from 'chalk';
import { join } from "path";
import { build as electronBuilder } from 'electron-builder';
import {OperationConfig} from "./model";


/** 运行根目录  */
const runPath = process.cwd().replaceAll("\\", "/");

/** 生成字节文件 */
async function afterEsbuildBuild() {
  console.log(chalk.yellow('开始 bytenode ...'));
  await compileFile({
    filename: rootPath('dev/electron/index.js'),
    output: rootPath('dist/electron/main.jsc'),
    electron: true,
  });

  writeFileSync(rootPath('dist/electron/index.js'), "require('bytenode');require('./main.jsc')");
  console.log(chalk.green('bytenode 完成'));
}

/** 复制渲染进程文件 */
export async function copyRenderFiles() {
  if (runPath !== rootPath('')) {
    await copy(join(runPath, 'dist/output'), rootPath(`dist/render`));
    console.log(chalk.green('复制渲染进程文件完成'));
  }
}
/** 复制electron 到 node_modules */
export async function copyElectronFiles() {
  if (runPath !== rootPath('')) {
    const rootElectronPath = rootPath('node_modules/electron/package.json');
    const runElectronPath = join(runPath, `node_modules/electron/package.json`);
    if (await pathExists(runElectronPath)) {
      if (await pathExists(rootElectronPath)) {
        // const rootVersion = (await ((await fetch(rootElectronPath))?.json()))?.version;
        // const runVersion = (await ((await fetch(runElectronPath))?.json()))?.version;
        const rootVersion =  JSON.parse(await readFile(rootElectronPath, 'utf-8'))?.version;
        const runVersion =  JSON.parse(await readFile(runElectronPath, 'utf-8'))?.version;
        console.log({rootVersion, runVersion})
        if (rootVersion !== runVersion) {
          await copy(join(runPath, `node_modules/electron`), rootPath(`node_modules/electron`));
        }
      } else {
        await copy(join(runPath, `node_modules/electron`), rootPath(`node_modules/electron`));
      }
    } else {
      console.log(chalk.red('请安装 electron 依赖'));
      return false;
    }
  }
}
/** 打包 */
export async function pack(config: OperationConfig) {
  setChdir();
  await copyElectronFiles();
  await copyLoginHTML('dist');
  // await copyRenderFiles();
  await afterEsbuildBuild();
  process.chdir(rootPath(''))
  console.log(chalk.yellow(`electronBuilder 开始打包${process.env.OS}...`));
  let packInfo = {}
  switch (platform()) {
    case 'win32':
      packInfo = {
        win: {
          icon: join(runPath, "electron/icons/256x256.ico"),
          target: [
            {
              target: "nsis",
              arch: [
                "x64"
              ]
            }
          ]
        },
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true
        }
      }
      break;
    case 'linux':
      packInfo = {
        linux: {
          target: [
            "deb"
          ],
          icon: join(runPath, "electron/icons")
        }
      }
      break;

    default:
      break;
  }
  await electronBuilder({
    // config: electronBuilderConfig
    config: {
      artifactName: "${productName}${buildVersion}.${ext}",
      buildVersion: config.buildVersion,
      appId: config.appId,
      copyright: config.copyright,
      productName: config.productName,
      extraResources: {
        "from": "./extraResources",
        "to": "extraResources"
      },
      directories: {
        output: join(runPath, 'pack')
      },
      npmRebuild: false,
      buildDependenciesFromSource: true,
      electronDownload: {
        mirror: 'https://npm.taobao.org/mirrors/electron/'
      },
      files: [
        "dist/electron/**/*",
        {
          "from": join(runPath, config.renderDir),
          "to":"dist/render"
        },
        // "dist/render/**/*",
        // join(runPath, "dist/render/**/*")
      ],
      asar: false,
      ...packInfo
    }
  });
  console.log(chalk.green('打包完成'));
}

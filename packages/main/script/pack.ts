import bytenode, { compileFile } from "bytenode";
import { writeFileSync } from "fs-extra";
import { platform } from "os"
import { rootPath } from "./ulity";
import chalk from 'chalk';
import { join } from "path";
import { build as electronBuilder } from 'electron-builder';
import { spawn } from "child_process";
import { electron_compile } from "./tsup.electron";

/** 生成字节文件 */
async function afterEsbuildBuild() {
  console.log(chalk.yellow('开始 bytenode ...'), process.cwd());
  await compileFile({
    filename: rootPath('dev/index.js'),
    output: rootPath('dist/main.jsc'),
    electron: true,
  });

  writeFileSync(rootPath('dist/index.js'), "require('bytenode');require('./main.jsc')");
  console.log(chalk.green('bytenode 完成'));
}
// const config = { appId: "svelte.test.peach", copyright: "@柳州凌桥", productName: "张拉测试程序", buildVersion: "2022.0" };
/** 打包 */
export async function pack(projectName: string, appInfo: {
  /** ID */
   appId: `${string}.${string}.${string}`;
   /** 版权 */
  //  copyright: "©YL.T",
   /** 产品名称 */
   productName: string,
   /** 版本号 */
   buildVersion: `${number}.${number}`
}) {
  console.log('process.cwd()', process.cwd())
  const rootCwd = process.cwd();
  await electron_compile();
  // 切换工作目录
  process.chdir(join(__dirname, '../'))
  const iconPath = join(rootCwd, 'icon', projectName)
  const packPath = join(rootCwd, 'pack', projectName)
  const renderDist = join(rootCwd, 'packages/render/dist', projectName)

  await afterEsbuildBuild();
  console.log(chalk.yellow(`electronBuilder 开始打包${process.env.OS}...`));
  let packInfo = {}
  switch (platform()) {
    case 'win32':
      packInfo = {
        win: {
          icon: join(iconPath, '256x256.ico'),
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
          icon: join(iconPath, '256x256.png')
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
      appId: appInfo.appId,
      buildVersion: appInfo.buildVersion,
      copyright: `©YL.T`,
      productName: appInfo.productName,
      extraResources: {
        "from": "./extraResources",
        "to": "extraResources"
      },
      directories: {
        output: packPath
      },
      npmRebuild: false,
      buildDependenciesFromSource: true,
      electronDownload: {
        mirror: 'https://npm.taobao.org/mirrors/electron/'
      },
      // appPackageFile:"",
      files: [
        "",
        {
          "from": rootPath('dist'),
          "to": "electron"
        },
        {
          "from": renderDist,
          "to": "render"
        },
      ],
      asar: false,
      ...packInfo
    }
  });
  console.log(chalk.green('打包完成'));
}

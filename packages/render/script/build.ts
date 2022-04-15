import { build } from 'vite';
import chalk from 'chalk';
import { join } from 'path'
import { ProjectNameS } from './projectNames';
import { copy, pathExists } from "fs-extra";

export async function renderBuild(projectName: ProjectNameS) {
  const rootCwd = process.cwd();
  console.log('process.cwd', rootCwd);
  console.log('__dirname', __dirname);
  console.log('__filename', __filename);
  console.log(chalk.blue("打包编译"));
  process.env.PROJECT_NAME = projectName;
  await build({configFile: join(__dirname, '../', 'vite.config.ts')});
  const baseLoadingHtml = join(rootCwd, 'loading', projectName, 'loading.html');
  if (await pathExists(baseLoadingHtml)) {
    await copy(baseLoadingHtml, join(__dirname, '../', 'dist', projectName, 'loading.html'));
    console.log(chalk.green(`复制 loading.html 完成`));
  } else {
    console.log(chalk.yellow(`没有可用的 loading.html`));
  }
  console.log(chalk.green(`${projectName} 编译完成`))
}

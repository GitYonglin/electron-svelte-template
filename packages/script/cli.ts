#!/usr/bin/env ts-node
import inquirer from 'inquirer';
import { program } from 'commander';
import { renderDev, renderBuild, ProjectNameS } from '../render/script'
import { runElectron, electron_compile, pack } from '../main/script';
import { join } from 'path';

function rootPath(...paths: string[]) {
  return join(__dirname, '../', ...paths);
}

program
  .command('dev')
  .description('调试')
  .alias('-d')
  .action((projectName, options) => {
    console.log("测试")
    // electron_compile()
  })
program
  .command('compile-electron')
  .description('编译调试')
  .alias('-cd')
  .action((projectName, options) => {
    console.log("测试")
    electron_compile()
  })
// program
//   .command('pack')
//   .description('打包')
//   .alias('-p')
//   .action(async (projectName, options) => {
//     console.log("打包")
//     await renderBuild('test')
//     pack({
//       dir: 'test',
//       root: rootPath('../'),
//       build: rootPath(`render/dist`)
//     })
//   })

program.action(() => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: "operation",
        choices: ['运行DEMO', 'render编译', '打包TEST']
      }
    ]).then(async t => {
      switch (t.operation) {
        case '运行DEMO':
          const renderUrl = await renderDev(ProjectNameS.demo);
          runElectron(renderUrl, ProjectNameS.demo)
          break;
        case '编译运行':
          console.log("测试")
          break;
        case 'render编译':
          console.log("render编译");
          await renderBuild(ProjectNameS.demo)
          break;
        case '打包TEST':
          console.log("打包 TEST");
          const projectName = ProjectNameS.demo;
          await renderBuild(projectName)
          await pack(projectName, {appId: 'svelte.demo.app', productName: 'E.S.DEMO测试', buildVersion: '2022.0'})
          break;
        default:
          break;
      }
    })
})
program.version('1.0.0').parse(process.argv)

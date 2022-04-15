#!/usr/bin/env ts-node
import inquirer from 'inquirer';
import { program } from 'commander';
// import { electron_compile } from './electron-tsup/tsup.electron';
import { spawn } from 'child_process';

program
  .command('dev')
  .description('调试')
  .alias('-d')
  .action((projectName, options) => {
    console.log("测试")
    // electron_compile()
  })
program
  .command('compile-dev')
  .description('编译调试')
  .alias('-cd')
  .action((projectName, options) => {
    console.log("测试")
  })
program
  .command('pack')
  .description('打包')
  .alias('-p')
  .action((projectName, options) => {
    console.log("测试")
  })

program.action(() => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: "operation",
        choices: ['运行', '编译运行']
      }
    ]).then(t => {
      switch (t.operation) {
        case '运行':
          console.log("运行")
          // const subProcess = spawn('node', ['./packages/render/my-app/script/dev.mjs'],{
          const subProcess = spawn('node', ['./packages/render/svelte-demo/script/dev.mjs'],{
              // stdio: 'inherit',
              shell: true
            });
            subProcess.stdout.on('data', (data) => {
              // 这里的log不会及时的输出到屏幕上
              const str = data.toString();
              if (str.indexOf('http://localhost') > -1) {
                console.log('cli render\r\n', str);
                console.log('port', str.split(':'))
                spawn('ts-node', ['./packages/electron/script/run.ts', `${str.split(':').pop()}`],{
                    stdio: 'inherit',
                    shell: true
                  }); // 执行electron 主程序
              }
            });
          break;
        case '编译运行':
          console.log("测试")
          break;

        default:
          break;
      }
    })
})
program.version('1.0.0').parse(process.argv)





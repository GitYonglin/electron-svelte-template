#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import {pack, runElectron} from '.';


program
  .command('dev')
  .description('任务')
  .alias('c')
  .action((projectName, options) => {
    createInquirer(options, (name) => {
      switch (name) {
        case "编译":
          runElectron();
          break;
        case "打包":
          // pack();
          break;
        default:
          break;
      }
    })
  })

function createInquirer(options, callback) {
  const { _name, _description } = options
  inquirer
    .prompt([
      {
        type: 'list',
        name: _name,
        message: `请选择${_description}`,
        choices: ['编译', '运行']
      }
    ])
    .then((answer) => {
      console.log('选择结果', _name, answer[_name]);
      // console.log('路径__dirname', __dirname);
      // console.log('路径__filename', __filename);
      callback(answer[_name])
    })
}
program.version('1.0.0').parse(process.argv)


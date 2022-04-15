import { createServer } from 'vite';
import { join } from 'path';
import { AddressInfo } from 'node:net';
import chalk from 'chalk';
import { ProjectNameS } from './projectNames';

console.log(__dirname)
console.log(__filename)

export async function renderDev(projectName: ProjectNameS) {
  process.env.PROJECT_NAME = projectName;
  const server = await createServer({ configFile: join(__dirname, '../', 'vite.config.ts') })
  const sv = await server.listen()
  const url = sv.httpServer?.address() as AddressInfo;
  const local = `http://${url?.address}:${url?.port}`;
  console.log(chalk.green(`local ${local}`))
  return local;
}

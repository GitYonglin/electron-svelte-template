import { NestFactory } from '@nestjs/core';
import { app as electronApp, BrowserWindow, protocol } from 'electron';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { ElectronIpcTransport } from './transport';
import { AppModule } from './nestjs/app.module.js';


console.log('__dirname', __dirname)
console.log('process.cwd()', process.cwd())
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new ElectronIpcTransport(),
    },
  );
  await app.listen();
}
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 macOS窗口全部关闭时,dock中程序不会退出
electronApp.on("window-all-closed", () => {
  process.platform !== "darwin" && electronApp.quit();
});
bootstrap().then(r => console.log('bootstrap run success')).catch((error) => console.error(`bootstrap run error(${error})`));

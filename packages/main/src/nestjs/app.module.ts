import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GlobalModule } from '../global/global.module.js';

@Module({
    imports: [GlobalModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

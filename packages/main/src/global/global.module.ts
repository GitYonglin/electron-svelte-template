import { Module, Global } from "@nestjs/common";
import { app } from "electron";
import { MianWindowModule } from "./mianWindow.module.js";

@Global()
@Module({
    providers: [{
        provide: 'IS_DEV',
        useValue: !app.isPackaged
    }],
    imports: [MianWindowModule],
    exports: [MianWindowModule, 'IS_DEV']
})
export class GlobalModule { }
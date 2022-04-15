import {Module} from '@nestjs/common';
import {app, BrowserWindow, protocol} from 'electron';
import {join} from 'path';
import {showLoading} from "../utils/loadingWindow.js";
import {mainWindow} from "../utils/mainWindow.js";

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

@Module({
    providers: [{
        provide: 'WEB_CONTENTS',
        async useFactory(isDev: boolean) {
            await app.whenReady()
            const loading = showLoading(isDev);

            const win = await mainWindow(loading, isDev);
            // 设置app菜单
            // Menu.setApplicationMenu(createAppMenu());
            // mianWindow(); // 创建窗口
            protocol.registerFileProtocol('files', (request, callback) => {
                const url = request.url.substr(8)
                let path = decodeURI(url.split('?')[0])
                callback({path})
            })
            // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他打开的窗口，那么程序会重新创建一个窗口。
            app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && mainWindow(loading, isDev));

            return win.webContents;
        },
        inject: ['IS_DEV']
    }],
    exports: ['WEB_CONTENTS']
})
export class MianWindowModule {
}

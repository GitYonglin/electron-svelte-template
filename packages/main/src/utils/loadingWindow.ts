import { app, BrowserWindow } from "electron";
import { join, resolve } from "path";

export const showLoading = (isDev: boolean) => {
    const loading = new BrowserWindow({
        show: false,
        frame: false, // 无边框（窗口、工具栏等），只包含网页内容
        width: 640,
        height: 640,
        resizable: false,
        transparent: true, // 窗口是否支持透明，如果想做高级效果最好为true
        alwaysOnTop: true,
    });

    // loading.once("show", cb);
    const htmlPath = process.env.VITE_LOADINGHTML || "render/loading.html";
    console.log('VITE_LOADINGHTML', process.env.VITE_LOADINGHTML)
    console.log('htmlPath', htmlPath);
    loading.loadFile(htmlPath);
    loading.once("ready-to-show", () => {
        loading.show(); // 显示窗口
    });
    return loading;
};

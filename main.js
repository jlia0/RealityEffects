const { app, BrowserWindow, nativeImage } = require('electron');
// const url = require('url');
const path = require('path');

function createWindow () {
    let mainWindow = new BrowserWindow({
        width: 1500, // 窗口宽度
        height: 1000, // 窗口高度
        title: "Electron", // 窗口标题,如果由loadURL()加载的HTML文件中含有标签<title>，该属性可忽略
        icon: nativeImage.createFromPath('src/public/favicon.ico'), // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
        webPreferences: { // 网页功能设置
            nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
            webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
            webSecurity: false, // 禁用同源策略
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: true, // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
            preload: path.resolve(__dirname, './preload.js'),
            // contextIsolation: false
        }
    });

    mainWindow.webContents.openDevTools()


    // 加载应用 --开发阶段  需要运行 npm run start
    mainWindow.loadURL('http://localhost:3000/');

    // // 解决应用启动白屏问题
    // mainWindow.on('ready-to-show', () => {
    //     mainWindow.show();
    //     mainWindow.focus();
    // });
    //
    // // 当窗口关闭时发出。在你收到这个事件后，你应该删除对窗口的引用，并避免再使用它。
    // mainWindow.on('closed', () => {
    //     mainWindow = null;
    // });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
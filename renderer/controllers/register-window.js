const Window = require('../../Window')

exports.registerWindow = ({ mainWindow, ipcMain, openedWindows, window }) => {
    let { file, name, event } = window;
    ipcMain.on(event, () => {
        if (openedWindows.hasOwnProperty(name)) return;
        openedWindows[name] = new Window({
            file,
            width: 700,
            height: 900,
            resizable: false,
            titleBarStyle: 'hidden',
            parent: mainWindow
        })
        openedWindows[name].on('closed', () => {
            delete openedWindows[name];
        })
    });
};
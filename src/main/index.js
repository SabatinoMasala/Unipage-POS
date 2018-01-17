require('electron-debug')({ showDevTools: false, enabled: true})

import Raven from 'raven';
Raven.config('https://5ad90cc5806d47f98270c1d39783a007:fb9708093a064d72a324b0db21b6961f@sentry.io/257702').install();

import { app, BrowserWindow, Menu, ipcMain, autoUpdater, dialog  } from 'electron'
import log from 'electron-log';
import os from 'os';

let deeplink = false;

ipcMain.on('get-deeplink', (event) => {
    event.returnValue = deeplink;
});

log.transports.file.level = true;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow () {

    log.info('Create window');

    let template = [{
        label: 'Unipage POS',
        submenu: [{
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function() { app.quit(); }
        }]
    }, {
        label: 'Edit',
        submenu: [{
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            selector: 'undo:'
        }, {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            selector: 'redo:'
        }, {
            type: 'separator'
        }, {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            selector: 'cut:'
        }, {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            selector: 'copy:'
        }, {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            selector: 'paste:'
        }, {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:'
        }]
    }, {
        role: 'help',
        submenu: [
            {role: 'toggledevtools'}
        ]
    }];
    let osxMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(osxMenu);

    // let installExtension = require('electron-devtools-installer')
    // installExtension.default(installExtension.VUEJS_DEVTOOLS)
    //     .then(() => {
    //         log.info('installed');
    //     })
    //     .catch(err => {
    //         log.info('Unable to install', err);
    //     });

    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

// The first time around the event won't be received my the renderer, so when the renderer (renderer/main.js) initialises, we check if a deeplink has been set
app.on('open-url', (e, url) => {
    e.preventDefault();
    deeplink = url;
    if (mainWindow !== null && mainWindow !== undefined) {
        mainWindow.webContents.send('open-url', url);
    }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// if (process.env.NODE_ENV === 'production') {
//     let platform = os.platform() + '_' + os.arch();
//     let version = app.getVersion();
//     let url = 'https://apps.wonderlus.be/nuts/myos-print/update/' + platform + '/' + version;
//
//     autoUpdater.setFeedURL(url);
//
//     autoUpdater.on('error', (event, error) => {
//         dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
//     });
//
//     autoUpdater.on('update-downloaded', () => {
//         dialog.showMessageBox({
//             title: 'Install Updates',
//             message: 'Updates downloaded, restart?',
//             buttons: ['Sure', 'No']
//         }, (buttonIndex) => {
//             if (buttonIndex === 0) {
//                 setImmediate(() => autoUpdater.quitAndInstall())
//             }
//         })
//     });
//
//     app.on('ready', () => {
//         autoUpdater.checkForUpdates()
//     });
//
// }

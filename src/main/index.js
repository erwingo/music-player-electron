require('../../.env');
const path = require('path');
const url = require('url');
// eslint-disable-next-line
const { app, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron');
const electronStore = require('../_singletons/electronStore');
const constantEvents = require('../_constants/events');
const { defaults } = require('../_constants/userPreferences');
const { menu } = require('../_singletons/mainMenu');

const isProd = process.env.NODE_ENV === 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/** @type {Electron.BrowserWindow | undefined} */
let mainWindow;
const mainWindowSize = electronStore.store.get(electronStore.SIZE);
const mainWindowPosition = electronStore.store.get(electronStore.POSITION);

// TODO: Create a more modular createWindow function
// Create the browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: (mainWindowSize && mainWindowSize.width) || defaults.mainWindowMinWidth,
    height: (mainWindowSize && mainWindowSize.height) || defaults.mainWindowMinHeight,
    webPreferences: {
      webSecurity: false
    },
    minWidth: defaults.mainWindowMinWidth,
    minHeight: defaults.mainWindowMinHeight,
    x: (mainWindowPosition && mainWindowPosition.x) || undefined,
    y: (mainWindowPosition && mainWindowPosition.y) || undefined,
    backgroundColor: '#000',
    titleBarStyle: 'hidden'
  });

  // Load the index.html of the app.
  if (isProd) {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../../dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    mainWindow.loadURL(url.format({
      protocol: 'http',
      // TODO: Pass the port or host
      host: 'localhost:8080',
      pathname: 'index.html'
    }));
  }

  mainWindow.on('resize', () => {
    const size = mainWindow.getSize();
    electronStore.store.set(electronStore.SIZE, { width: size[0], height: size[1] });
  });

  mainWindow.on('move', () => {
    const pos = mainWindow.getPosition();
    electronStore.store.set(electronStore.POSITION, { x: pos[0], y: pos[1] });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  Menu.setApplicationMenu(menu);
  createWindow();

  if (!isProd) { mainWindow.webContents.openDevTools(); }

  ipcMain.on(constantEvents.NEW_ROOT_PATH_SELECTED, dirPath => {
    mainWindow.webContents.send(constantEvents.NEW_ROOT_PATH_SELECTED, dirPath);
  });

  ipcMain.on(constantEvents.SYNC_GET_WINDOW_FOCUS_STATUS, evt => {
    evt.returnValue = mainWindow.isFocused();
  });

  // Media keys events
  // Copied from https://gist.github.com/twolfson/0a03820e27583cc9ad6e
  globalShortcut.register('medianexttrack', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_NEXT_TRACK);
  });

  globalShortcut.register('mediaprevioustrack', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_PREV_TRACK);
  });

  globalShortcut.register('mediaplaypause', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_PLAY_PAUSE);
  });

  // Devtools

  globalShortcut.register('CommandOrControl+Alt+I', () => {
    mainWindow.webContents.toggleDevTools();
  });

  globalShortcut.register('CommandOrControl+Shift+C', () => {
    mainWindow.webContents.removeAllListeners('devtools-opened');
    const inspect = () => {
      mainWindow.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
    };

    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.on('devtools-opened', inspect);
      mainWindow.webContents.openDevTools();
    } else {
      inspect();
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    console.log('All windows closed but not exiting because OSX');
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

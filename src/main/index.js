const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
// eslint-disable-next-line
const electron = require('electron');
const electronStore = require('../_singletons/electronStore');
const constantEvents = require('../_constants/events');
const { defaults } = require('../_constants/userPreferences');
const { menu } = require('../_singletons/mainMenu');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

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
    minWidth: defaults.mainWindowMinWidth,
    minHeight: defaults.mainWindowMinHeight,
    x: (mainWindowPosition && mainWindowPosition.x) || undefined,
    y: (mainWindowPosition && mainWindowPosition.y) || undefined,
    backgroundColor: '#000',
    titleBarStyle: 'hidden'
  });

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL(url.format({
      protocol: 'http',
      // TODO: Pass the port or host
      host: 'localhost:8080',
      pathname: 'index.html'
    }));
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './dist/index.html'),
      protocol: 'file:',
      slashes: true
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
  electron.Menu.setApplicationMenu(menu);
  createWindow();

  if (isDev) { mainWindow.webContents.openDevTools(); }

  electron.ipcMain.on(constantEvents.SYNC_GET_WINDOW_FOCUS_STATUS, evt => {
    evt.returnValue = mainWindow.isFocused();
  });

  // Media keys events
  // Copied from https://gist.github.com/twolfson/0a03820e27583cc9ad6e
  electron.globalShortcut.register('medianexttrack', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_NEXT_TRACK);
  });

  electron.globalShortcut.register('mediaprevioustrack', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_PREV_TRACK);
  });

  electron.globalShortcut.register('mediaplaypause', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_PLAY_PAUSE);
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

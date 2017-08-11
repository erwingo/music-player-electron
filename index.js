// I can't control how this file is called so I set default env variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
const url = require('url');
// eslint-disable-next-line
const electron = require('electron');
const electronStore = require('./src/_singletons/electronStore');
const constantEvents = require('./src/_constants/events');
const { defaults } = require('./src/_constants/userPreferences');
const { menu } = require('./src/_singletons/mainMenu');

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
  mainWindow.loadURL(url.format({
    pathname: path.join(
      __dirname,
      process.env.NODE_ENV === 'production' ?
        'src/mainWindow/index.html' :
        'src/mainWindow/index.dev.html'
    ),
    protocol: 'file:',
    slashes: true
  }));

  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
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
  createWindow();
  electron.Menu.setApplicationMenu(menu);

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

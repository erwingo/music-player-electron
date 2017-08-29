// eslint-disable-next-line
const { app, Menu, shell, BrowserWindow, dialog, ipcMain } = require('electron');
const pkg = require('../../package');
const { NEW_ROOT_PATH_SELECTED } = require('../_constants/events');
const { setFilesRootPath } = require('./main');
const electronStore = require('./electronStore');

function toggleDevTools(win) {
  win = win || BrowserWindow.getFocusedWindow();
  if (win) { win.toggleDevTools(); }
}

function refresh(win) {
  win = win || BrowserWindow.getFocusedWindow();
  if (win) { win.webContents.reloadIgnoringCache(); }
}

function inspectElements() {
  const win = BrowserWindow.getFocusedWindow();

  const inspect = () => {
    win.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');
  };

  if (win) {
    if (win.webContents.isDevToolsOpened()) {
      inspect();
    } else {
      win.webContents.once('devtools-opened', inspect);
      win.openDevTools();
    }
  }
}

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Select Root Directory',
        click() {
          dialog.showOpenDialog(
            BrowserWindow.getFocusedWindow(),
            {
              message: 'Select Root Directory',
              properties: ['openDirectory'],
              buttonLabel: 'Select'
            },
            dirPaths => {
              const dirPath = dirPaths && dirPaths[0];
              if (!dirPath) { return; }
              setFilesRootPath(dirPath);
              ipcMain.emit(NEW_ROOT_PATH_SELECTED, dirPath);
              electronStore.store.set(electronStore.ROOT_PATH, dirPath);
            }
          );
        }
      },
      {
        label: 'Restore Defaults',
        click() {
          electronStore.store.deleteAll();
          app.quit();
          app.relaunch();
        }
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { shell.openExternal(pkg.homepage); }
      }
    ]
  },
  {
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle Dev Tools',
        click() { toggleDevTools(); },
        accelerator: 'CmdOrCtrl+Alt+I'
      },
      {
        label: 'Reload Page',
        click() { refresh(); },
        accelerator: 'CmdOrCtrl+R'
      },
      {
        label: 'Inspect Element',
        click() { inspectElements(); },
        accelerator: 'CmdOrCtrl+Shift+C'
      }
    ]
  }
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  });
}

exports.menu = Menu.buildFromTemplate(template);

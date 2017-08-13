// eslint-disable-next-line
const { app, Menu, shell, BrowserWindow } = require('electron');
const pkg = require('../../package');
const electronStore = require('./electronStore');

function toggleDevTools(win) {
  win = win || BrowserWindow.getFocusedWindow();
  if (win) { win.toggleDevTools(); }
}

function openDevTools(win, showDevTools) {
  win = win || BrowserWindow.getFocusedWindow();

  if (win) {
    const mode = showDevTools === true ? undefined : showDevTools;
    win.webContents.openDevTools({ mode });
  }
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
      win.webContents.on('devtools-opened', inspect);
      win.openDevTools();
    }
  }
}

const template = [
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
  }
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      {
        label: 'Restore Defaults',
        click() {
          electronStore.store.deleteAll();
          app.quit();
          app.relaunch();
        }
      },

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

if (process.env.NODE_ENV !== 'production') {
  template.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle Dev Tools',
        click() { toggleDevTools(); },
        accelerator: 'Cmd+Alt+I'
      },
      {
        label: 'Reload Page',
        click() { refresh(); },
        accelerator: 'Cmd+R'
      },
      {
        label: 'Inspect Element',
        click() { inspectElements(); },
        accelerator: 'Cmd+Shift+C'
      }
    ]
  });
}

exports.menu = Menu.buildFromTemplate(template);

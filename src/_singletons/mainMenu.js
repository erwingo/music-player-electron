const { app, Menu, shell } = require('electron');
const pkg = require('../../package');

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
      // {
      //   label: 'About',
      //   click: () => {
      //     openAboutWindow({
      //       icon_path: path.join(__dirname, '../_images/mac/appicon_512x512.png'),
      //       win_options: {
      //         backgroundColor: '#eee',
      //         resizable: false
      //       }
      //     });
      //   }
      // },
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

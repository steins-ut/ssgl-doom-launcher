// Modules to control application life and create native browser window
const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');
const createMenu = require('./menu');
const windowStateKeeper = require('electron-window-state');
const {
  initialize: remoteInitialize,
  enable: remoteEnable
} = require('@electron/remote/main');

const whenProd = (whenProd, notProd) =>
  app.name.toLowerCase() === 'electron' ? notProd : whenProd;

let mainWindow;

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1075,
    defaultHeight: 610
  });

  remoteInitialize();

  mainWindow = new BrowserWindow({
    //x: mainWindowState.x,
    //y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,

    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: whenProd(true, false)
    }
  });

  remoteEnable(mainWindow.webContents);

  mainWindowState.manage(mainWindow);

  const url = whenProd(
    `file://${path.join(__dirname, '../production.html')}`,
    'http://localhost:1666'
  );

  mainWindow.loadURL(url);
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  const menu = createMenu(mainWindow, url);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (mainWindow === null) createWindow();
});

require('./handlers/main');
require('./handlers/sourceports');
require('./handlers/settings');
require('./handlers/packages');
require('./handlers/oblige');

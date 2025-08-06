const { BrowserWindow } = require('electron');
const path = require('path');


function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // fullscreen: true, 
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      devTools: process.env.NODE_ENV === 'development',
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  return mainWindow;
}

module.exports = { createMainWindow }; 
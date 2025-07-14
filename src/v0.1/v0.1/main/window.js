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
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      devTools: false
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  return mainWindow;
}

module.exports = { createMainWindow }; 
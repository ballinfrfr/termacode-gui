const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('view/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Handle file open events
app.on('open-file', function (event, path) {
  // Assuming you have a function in your renderer process to handle opening files
  mainWindow.webContents.send('open-file', path);
});

// Listen for the 'open-file-dialog' message from the renderer process
// Triggered when the user clicks an "Open File" button in your HTML file editor
ipcMain.on('open-file-dialog', (event) => {
  // Show a file dialog
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }).then((result) => {
    // result.canceled is true if the user didn't select any files
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      // Send the selected file path to the renderer process
      mainWindow.webContents.send('open-file', filePath);
    }
  }).catch((err) => {
    console.error(err);
  });
});

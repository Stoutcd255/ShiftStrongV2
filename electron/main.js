const { app, BrowserWindow } = require('electron')
const path = require('path')

const APP_ID = 'com.shiftstrong.desktop'
const isDev = !app.isPackaged

app.setAppUserModelId(APP_ID)

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#05070a',
    autoHideMenuBar: true,
    show: false,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
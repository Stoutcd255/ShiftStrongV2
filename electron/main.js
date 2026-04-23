const { app, BrowserWindow, dialog } = require('electron')
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
    autoHideMenuBar: false,
    show: false,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('did-fail-load:', { errorCode, errorDescription, validatedURL })

    dialog.showErrorBox(
      'Renderer failed to load',
      `Code: ${errorCode}\n${errorDescription}\nURL: ${validatedURL}`
    )
  })

  win.webContents.on('render-process-gone', (_event, details) => {
    console.error('render-process-gone:', details)

    dialog.showErrorBox(
      'Renderer crashed',
      JSON.stringify(details, null, 2)
    )
  })

  win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    console.log(`Renderer console [${level}]: ${message} (${sourceId}:${line})`)
  })

  win.once('ready-to-show', () => {
    win.show()
    win.webContents.openDevTools()
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
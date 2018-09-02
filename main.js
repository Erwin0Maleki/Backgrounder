const {app, BrowserWindow,Tray,Menu} = require('electron')
const path = require('path');
const wallpaper = require('wallpaper');
const axios = require('axios');
const download = require('image-downloader');
const electronInstaller = require('electron-winstaller');
const shell = require('electron').shell;
let photographLink = 'https://github.com/Erwin0Maleki/Backgrounder'; // it will change when next clicked
//building
// let build = electronInstaller.createWindowsInstaller({
//   appDirectory: __dirname + '/build/Backgrounder-win32-x64',
//   outputDirectory: __dirname + '/build/installer64',
//   authors: 'Erwin0maleki',
//   exe: 'Backgrounder.exe'
// });
// build.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
let mainWindow,splashWindow,tray;
  const options = {
    url: '',
    dest: __dirname + '/wallpaper.png'
  }
  async function getImg() {
      let data = await axios.get('https://api.unsplash.com/photos/random?client_id=f8ffd3da820be03e50c49dc0c0a0a6a531d504ddbb27760a138c1e324511a822');
      await( options.url = data.data.urls.raw);
      await(photographLink = data.data.links.html);
      return data;
  }
  async function downloadImg(){
    await (getImg());
    tray.setToolTip('downloading...');
    tray.setImage(__dirname +'/icon/loading.png')
    let { filename, image } = await download.image(options);
    tray.setToolTip('downloading...');
    console.log(photographLink + '////' + photographName);
  
  }
  async function setWallpaper(){
    await(downloadImg());
    let test = await wallpaper.set(options.dest)
    await(tray.setImage(__dirname +'/icon/tray.png'))
    await(tray.setToolTip(''))

  }
  const TrayMenu = Menu.buildFromTemplate([
    {
      label:'link on Unsplash',
      click() {shell.openExternal(photographLink)}
    },
    {
      label:'Next',
      click() {setWallpaper()}
    },
    {role:'quit'},
  ])
  function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    show: false,
    resizable: false
  })
  splashWindow = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    resizable: false,
    icon: __dirname +'/icon/icon64.png'
  })
  splashWindow.loadURL(__dirname +'/index.html');
  setTimeout(() => splashWindow.close(), 5000)
  mainWindow.on('closed', function () {
    mainWindow = null;
  })
  splashWindow.on('closed', function () {
    mainWindow = null;
  })

  tray = new Tray(__dirname +'/icon/tray.png');
  tray.setContextMenu(TrayMenu);
  }
 
  app.on('ready', createWindow)
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })



const { app, BrowserWindow, dialog } = require("electron");
const fs = require("fs");

const windows = new Set();
let mainWindow = null;

app.on("ready", () => {
  createWindow();
});

const createWindow = (exports.createWindow = () => {
  let x, y;

  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  let newWindow = new BrowserWindow({
    x,
    y,
    show: false,
    width: 800,
    height: 600
  });
  newWindow.webContents.loadURL(`file://${__dirname}/index.html`);

  newWindow.once("ready-to-show", () => {
    newWindow.show();
  });

  newWindow.on("closed", () => {
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
});

const getFileFromUser = (exports.getFileFromUser = targetWindow => {
  const files = dialog.showOpenDialog(targetWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Markdown Files", extensions: ["md", "markdown"] },
      { name: "Text Files", extensions: ["txt"] }
    ]
  });
  if (files) {
    openFile(targetWindow, files[0]);
  } else {
    return;
  }
});

const openFile = (exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  targetWindow.webContents.send("file-opened", file, content);
});

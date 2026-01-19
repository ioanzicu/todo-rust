const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");


function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "Oh! My Gorgeous Todo List!",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    let isDev = process.env.NODE_ENV === "development";

    if (isDev) {
        win.loadURL("http://localhost:5173");
    } else {
        win.loadFile("../dist/index.html");
    }

    const menu = Menu.buildFromTemplate([
        {
            label: "View",
            submenu: [
                {
                    label: "Refresh",
                    accelerator: "CmdOrCtrl+R", // shortcut
                    click: () => {
                        win.reload(); // reloads the renderer
                    },
                },
                { role: "toggleDevTools" },
            ],
        },
    ]);

    Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

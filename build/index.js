"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const url_1 = require("url");
const electron_updater_1 = require("electron-updater");
const logger_1 = __importDefault(require("./utils/logger"));
const settings_1 = __importDefault(require("./utils/settings"));
const isProd = process.env.NODE_ENV === "production" || !/[\\/]electron/.exec(process.execPath); // !process.execPath.match(/[\\/]electron/);
logger_1.default.info("App starting...");
settings_1.default.set("check", true);
logger_1.default.info("Checking if settings store works correctly.");
logger_1.default.info(settings_1.default.get("check") ? "Settings store works correctly." : "Settings store has a problem.");
let mainWindow;
let notification;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            devTools: isProd ? false : true,
            contextIsolation: true,
            enableRemoteModule: false
        },
    });
    const url = 
    // process.env.NODE_ENV === "production"
    isProd
        ? // in production, use the statically build version of our application
            `file://${path_1.join(__dirname, "public", "index.html")}`
        : // in dev, target the host and port of the local rollup web server
            "http://localhost:5000";
    mainWindow.loadURL(url).catch((err) => {
        logger_1.default.error(JSON.stringify(err));
        electron_1.app.quit();
    });
    if (!isProd)
        mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};
electron_1.app.on("ready", createWindow);
// those two events are completely optional to subscrbe to, but that's a common way to get the
// user experience people expect to have on macOS: do not quit the application directly
// after the user close the last window, instead wait for Command + Q (or equivalent).
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", () => {
    if (mainWindow === null)
        createWindow();
});
electron_1.app.on("web-contents-created", (e, contents) => {
    logger_1.default.info(e);
    // Security of webviews
    contents.on("will-attach-webview", (event, webPreferences, params) => {
        logger_1.default.info(event, params);
        // Strip away preload scripts if unused or verify their location is legitimate
        delete webPreferences.preload;
        // Disable Node.js integration
        webPreferences.nodeIntegration = false;
        // Verify URL being loaded
        // if (!params.src.startsWith(`file://${join(__dirname)}`)) {
        //   event.preventDefault(); // We do not open anything now
        // }
    });
    contents.on("will-navigate", (event, navigationUrl) => {
        const parsedURL = url_1.parse(navigationUrl);
        // In dev mode allow Hot Module Replacement
        if (parsedURL.host !== "localhost:5000" && !isProd) {
            logger_1.default.warn("Stopped attempt to open: " + navigationUrl);
            event.preventDefault();
        }
        else if (isProd) {
            logger_1.default.warn("Stopped attempt to open: " + navigationUrl);
            event.preventDefault();
        }
    });
});
if (isProd)
    electron_updater_1.autoUpdater.checkForUpdates().catch((err) => {
        logger_1.default.error(JSON.stringify(err));
    });
electron_updater_1.autoUpdater.logger = logger_1.default;
electron_updater_1.autoUpdater.on("update-available", () => {
    notification = new electron_1.Notification({
        title: "Fluide",
        body: "Updates are available. Click to download.",
        silent: true,
        // icon: nativeImage.createFromPath(join(__dirname, "..", "assets", "icon.png"),
    });
    notification.show();
    notification.on("click", () => {
        electron_updater_1.autoUpdater.downloadUpdate().catch((err) => {
            logger_1.default.error(JSON.stringify(err));
        });
    });
});
electron_updater_1.autoUpdater.on("update-not-available", () => {
    notification = new electron_1.Notification({
        title: "Fluide",
        body: "Your software is up to date.",
        silent: true,
        // icon: nativeImage.createFromPath(join(__dirname, "..", "assets", "icon.png"),
    });
    notification.show();
});
electron_updater_1.autoUpdater.on("update-downloaded", () => {
    notification = new electron_1.Notification({
        title: "Fluide",
        body: "The updates are ready. Click to quit and install.",
        silent: true,
        // icon: nativeImage.createFromPath(join(__dirname, "..", "assets", "icon.png"),
    });
    notification.show();
    notification.on("click", () => {
        electron_updater_1.autoUpdater.quitAndInstall();
    });
});
electron_updater_1.autoUpdater.on("error", (err) => {
    notification = new electron_1.Notification({
        title: "Fluide",
        body: JSON.stringify(err),
        // icon: nativeImage.createFromPath(join(__dirname, "..", "assets", "icon.png"),
    });
    notification.show();
});
//# sourceMappingURL=index.js.map
/** @format */

// /** @format */

// const { app, BrowserWindow, shell } = require("electron");

// function createWindow() {
// 	const win = new BrowserWindow({
// 		width: 800,
// 		height: 600,
// 		webPreferences: {
// 			nodeIntegration: true,
// 			contextIsolation: false, // Allow the use of Node.js features
// 		},
// 	});

// 	win.loadURL("http://localhost:3000"); // Your React app URL
// }

// app.whenReady().then(createWindow);

// app.on("window-all-closed", () => {
// 	if (process.platform !== "darwin") app.quit();
// });

// app.on("activate", () => {
// 	if (BrowserWindow.getAllWindows().length === 0) createWindow();
// });

// // Open the file explorer for the given path
// const openFileExplorer = (path) => {
// 	shell.openPath(path);
// };

// // Expose the function to the renderer process
// module.exports = { openFileExplorer };

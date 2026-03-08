import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  const rendererUrl = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173';
  void win.loadURL(rendererUrl);
};

void app.whenReady().then(() => {
  createWindow();
});

import { spawn } from "child_process";
import { BrowserWindow } from "electron";

export interface LaunchVlcProps {
  path: string
  startTime: number
}

export function launchVLC({ path, startTime }: LaunchVlcProps, win: BrowserWindow) {
  const vlc = spawn(`vlc`, [
    '--extraintf',
    'http',
    '--http-host 127.0.0.1',
    '--http-port 9090',
    '--http-password joyplayer',
    '--fullscreen',
    `--start-time=${startTime}`,
    '--qt-start-minimized',
    '--no-snapshot-preview',
    '--no-osd',
    path
  ], { shell: true });
  vlc.setMaxListeners(2)
  vlc.stderr.on('data', (data) => {
    if (data.toString().includes('access stream error')) {
      vlc.kill()
      win.webContents.send('vlc-status', { running: false, error: data.toString() })
    }
  });

  vlc.on('close', () => {
    win.webContents.send('vlc-status', { running: false })
  })

  return vlc.pid
}
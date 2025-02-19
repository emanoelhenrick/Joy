import { spawn } from "child_process";
import { BrowserWindow } from "electron";

export interface LaunchVlcProps {
  path: string;
  startTime: number;
}

export function launchVLC({ path, startTime }: LaunchVlcProps, win: BrowserWindow) {
  let vlc: ReturnType<typeof spawn>;
  const args = [
    "--extraintf",
    "http",
    "--http-host",
    "127.0.0.1",
    "--http-port",
    "9090",
    "--http-password",
    "joi",
    "--fullscreen",
    "--start-time",
    startTime.toString(),
    path,
  ];

  if (process.platform === "win32") {
    const vlcExePath = "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe";
    vlc = spawn(vlcExePath, args);
  } else {
    vlc = spawn("vlc", args);
  }

  vlc.setMaxListeners(2);

  vlc.stderr!.on("data", (data) => {
    const errorMessage = data.toString();
    if (errorMessage.includes("access stream error")) {
      vlc.kill();
      win.webContents.send("vlc-status", { running: false, error: errorMessage });
    }
  });

  vlc.on("close", () => {
    win.webContents.send("vlc-status", { running: false });
  });

  return vlc.pid;
}

import { spawn } from "child_process";
import { BrowserWindow } from "electron";
import { getMetadata } from "../getMetadata";

export interface LaunchVlcProps {
  path: string;
  startTime: number;
}

export async function launchVLC({ path, startTime }: LaunchVlcProps, win: BrowserWindow) {
  let vlc: ReturnType<typeof spawn>;
  const args = [
    "--extraintf",
    "http",
    "--http-host",
    "127.0.0.1",
    "--http-port",
    "9090",
    "--http-password",
    "joy",
    "--fullscreen",
    "--start-time",
    startTime.toString(),
    path,
  ];

  const metadata = await getMetadata()

  vlc = spawn(metadata.vlcPath, args);

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

import { spawn } from "child_process";
import { BrowserWindow } from "electron";
import { getMetadata } from "../playlist/getMetadata";
import * as filePath from "path";
import { getSnapshotsFolder } from "../utils/paths";
import crypto from 'crypto'

export interface LaunchVlcProps {
  path: string;
  startTime: number;
  seriesId?: string
}

export async function launchVLC({ path, startTime, seriesId }: LaunchVlcProps, win: BrowserWindow) {
  let vlc: ReturnType<typeof spawn>;
  let nameToHash = ''

  if (seriesId) {
    const url = new URL(path)
    nameToHash = url.origin + seriesId
  } else {
    nameToHash = path
  }
  
  const filename = crypto.createHash('md5').update(nameToHash, 'utf8').digest('hex')
  const snapshotPath = filePath.join(getSnapshotsFolder(), filename)

  const args = [
    "--extraintf", "http",
    "--http-host", "127.0.0.1",
    "--http-port", "9090",
    "--http-password", "joy",
    "--no-snapshot-preview",
    "--no-osd",
    "--snapshot-format=jpg",
    "--snapshot-width=500",
    "--snapshot-height=0",
    "--snapshot-path" + `=${snapshotPath}.jpg`,
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

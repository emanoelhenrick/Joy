import { Worker } from "worker_threads";
import { BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { writeAsync } from "fs-jetpack";
import { getPlaylistFolderPath } from "./paths";
import { getMetadata } from "./getMetadata";
import { getLocalVodPlaylist } from "./vod/getLocalVodPlaylist";

// No topo do arquivo:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let trendingWorkerPromise: Promise<any> | null = null;

export async function runFetchTmdbTrendingInWorker(apiKey: string, win: BrowserWindow) {
  if (trendingWorkerPromise) return trendingWorkerPromise;

  trendingWorkerPromise = (async () => {
    const metadata = await getMetadata();
    const currentPlaylist = metadata.currentPlaylist.name;
    const vodPlaylist = await getLocalVodPlaylist(currentPlaylist);

    if (!apiKey) return;
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve(__dirname, "./fetchTmdbTrending.worker.js"),
        { workerData: { apiKey, vodPlaylist } }
      );
      worker.on("message", async (msg) => {
        trendingWorkerPromise = null;
        if (msg.isSuccess) {
          await writeAsync(path.join(getPlaylistFolderPath(currentPlaylist), 'trending.json'), msg.tmdbData);
          win.webContents.send("trending", { isSuccess: true, data: msg.result });
          resolve(msg.isSuccess);
          worker.terminate();
        } else {
          reject(msg.error);
        }
      });
      worker.on("error", (err) => {
        trendingWorkerPromise = null;
        reject(err);
      });
      worker.on("exit", (code) => {
        trendingWorkerPromise = null;
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  })();

  return trendingWorkerPromise;
}
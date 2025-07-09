import { Worker } from "worker_threads";
import { BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { writeAsync } from "fs-jetpack";
import { getPlaylistFolderPath } from "../utils/paths";
import { getMetadata } from "../playlist/getMetadata";
import { getLocalVodPlaylist } from "../vod/getLocalVodPlaylist";
import { getUrls } from "../utils/getUrls";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let trendingWorkerPromise: Promise<any> | null = null;

export async function runFetchTmdbTrendingInWorker(apiKey: string, win: BrowserWindow) {
  if (trendingWorkerPromise) return trendingWorkerPromise;

  trendingWorkerPromise = (async () => {
    const metadata = await getMetadata();
    const currentPlaylist = metadata.currentPlaylist.name;
    const vodPlaylist = await getLocalVodPlaylist(currentPlaylist);
    const urls = await getUrls(currentPlaylist);

    if (!apiKey || !urls) {
      trendingWorkerPromise = null;
      return Promise.reject(new Error("API key or URLs missing"));
    }

    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve(__dirname, "./fetchTmdbTrending.worker.js"),
        { workerData: { apiKey, vodPlaylist, url: urls.getVodInfoUrl } }
      );

      let settled = false;

      worker.on("message", async (msg) => {
        if (settled) return;
        if (msg.isSuccess) {
          try {
            await writeAsync(
              path.join(getPlaylistFolderPath(currentPlaylist), "trending.json"),
              msg.tmdbData
            );
            win.webContents.send("trending", { isSuccess: true, data: msg.result });
            settled = true;
            resolve(msg.isSuccess);
          } catch (err) {
            settled = true;
            reject(err);
          } finally {
            trendingWorkerPromise = null;
            worker.terminate();
          }
        } else {
          settled = true;
          trendingWorkerPromise = null;
          reject(msg.error);
          worker.terminate();
        }
      });

      worker.on("error", (err) => {
        if (settled) return;
        settled = true;
        trendingWorkerPromise = null;
        reject(err);
        worker.terminate();
      });

      worker.on("exit", (code) => {
        if (settled) return;
        settled = true;
        trendingWorkerPromise = null;
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  })();

  return trendingWorkerPromise;
}
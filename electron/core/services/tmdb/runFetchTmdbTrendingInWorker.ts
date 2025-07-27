import { Worker } from "worker_threads";
import { BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { writeAsync } from "fs-jetpack";
import { getPlaylistFolderPath } from "../utils/paths";
import { getMetadata } from "../playlist/getMetadata";
import { getLocalVodPlaylist } from "../vod/getLocalVodPlaylist";
import { getUrls } from "../utils/getUrls";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runFetchTmdbTrendingInWorker(win: BrowserWindow) {

  const metadata = await getMetadata();
  const currentPlaylist = metadata.currentPlaylist.name;
  const vodPlaylist = await getLocalVodPlaylist(currentPlaylist);
  const urls = await getUrls(currentPlaylist);

  if (!TMDB_API_KEY) return Promise.reject(new Error("API key missing"))
  if (!urls) return Promise.reject(new Error("URLs missing"));

  win.webContents.send("trending", { status: 'fetching' });

  const worker = new Worker(
    path.resolve(__dirname, "fetchTmdbTrending.worker.js"),
    { workerData: { apiKey: TMDB_API_KEY, vodPlaylist, url: urls.getVodInfoUrl } }
  );

  worker.on("message", async (msg) => {
    if (msg.isSuccess) {
      try {
        await writeAsync(
          path.join(getPlaylistFolderPath(currentPlaylist), "trending.json"),
          msg.tmdbData
        );
        win.webContents.send("trending", { status: 'success', data: msg.result });
        return msg.isSuccess;
      } catch (err) {
        win.webContents.send("trending", { status: 'error', data: msg.result });
      } finally {
        worker.terminate();
      }
    } else {
      worker.terminate();
      win.webContents.send("trending", { status: 'error', data: msg.result });
    }
  });

  worker.on("error", (err) => {
    worker.terminate();
    win.webContents.send("trending", { status: 'error'});
    throw new Error();
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      throw new Error(`Worker stopped with exit code ${code}`);
    } else {
      return false;
    }
  });
}
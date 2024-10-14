import { ipcMain } from "electron";
import { getMetadata } from "./services/getMetadata";
import { addNewPlaylist } from "./services/addNewPlaylist";
import { updateVod } from "./services/vod/updateVod";
import { updateSeries } from "./services/series/updateSeries";
import { updateLive } from "./services/live/updateLive";
import { authenticateUser } from "./services/authenticateUser";
import { addPlaylistToMeta } from "./services/addPlaylistToMeta";
import { getLocalVodPlaylist } from "./services/vod/getLocalVodPlaylist";
import { getLocalSeriesPlaylist } from "./services/series/getLocalSeriesPlaylist";
import { getLocalLivePlaylist } from "./services/live/getLocalLivePlaylist";
import { getPlaylistInfo } from "./services/getPlaylistInfo";
import { getVodInfo } from "./services/vod/getVodInfo";
import { getSerieInfo } from "./services/series/getSerieInfo";
import { getUserData } from "./services/getUserData";
import { updateUserData } from "./services/updateUserData";

export default function CoreControllers() {
  ipcMain.handle('get-metadata', getMetadata)
  ipcMain.handle('add-new-playlist', async (_event, args) => await addNewPlaylist(args))
  ipcMain.handle('authenticate-user', async (_event, args) => await authenticateUser(args))

  ipcMain.handle('update-vod', async (_event, args) => await updateVod(args))
  ipcMain.handle('update-series', async (_event, args) => await updateSeries(args))
  ipcMain.handle('update-live', async (_event, args) => await updateLive(args))
  
  ipcMain.handle('add-playlist-to-meta', async (_event, args) => await addPlaylistToMeta(args))

  ipcMain.handle('get-local-vod-playlist', async (_event, args) => await getLocalVodPlaylist(args))
  ipcMain.handle('get-local-series-playlist', async (_event, args) => await getLocalSeriesPlaylist(args))
  ipcMain.handle('get-local-live-playlist', async (_event, args) => await getLocalLivePlaylist(args))

  ipcMain.handle('get-playlist-info', async (_event, args) => await getPlaylistInfo(args))
  ipcMain.handle('get-vod-info', async (_event, args) => await getVodInfo(args))
  ipcMain.handle('get-serie-info', async (_event, args) => await getSerieInfo(args))

  ipcMain.handle('get-user-data', async (_event, args) => await getUserData(args))
  ipcMain.handle('update-user-data', async (_event, args) => await updateUserData(args))
}
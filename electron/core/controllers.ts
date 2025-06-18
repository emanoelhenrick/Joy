import { BrowserWindow, ipcMain } from "electron";
import { getMetadata } from "./services/playlist/getMetadata";
import { updateVod } from "./services/vod/updateVod";
import { updateSeries } from "./services/series/updateSeries";
import { updateLive } from "./services/live/updateLive";
import { authenticateUser } from "./services/playlist/authenticateUser";
import { addPlaylistToMeta } from "./services/playlist/addPlaylistToMeta";
import { getLocalVodPlaylist } from "./services/vod/getLocalVodPlaylist";
import { getLocalSeriesPlaylist } from "./services/series/getLocalSeriesPlaylist";
import { getLocalLivePlaylist } from "./services/live/getLocalLivePlaylist";
import { getPlaylistInfo } from "./services/playlist/getPlaylistInfo";
import { getVodInfo } from "./services/vod/getVodInfo";
import { getSerieInfo } from "./services/series/getSerieInfo";
import { getUserData } from "./services/userdata/getUserData";
import { updateUserData } from "./services/userdata/updateUserData";
import { changeCurrentPlaylist } from "./services/playlist/changeCurrentPlaylist";
import { updatedAtPlaylist } from "./services/playlist/updatedAtPlaylist";
import { createProfile } from "./services/userdata/createProfile";
import { switchProfile } from "./services/userdata/switchProfile";
import { renameProfile } from "./services/userdata/renameProfile";
import { removeProfile } from "./services/userdata/removeProfile";
import { removePlaylist } from "./services/playlist/removePlaylist";
import { launchVLC } from "./services/vlc/launchVLC";
import { getVLCState } from "./services/vlc/getVLCState";
import { editPlaylistInfo } from "./services/playlist/editPlaylistInfo";
import { updateCurrentPlaylist } from "./services/playlist/updateCurrentPlaylist";
import { getLocalTmdbTrending } from "./services/tmdb/getLocalTmdbTrending";
import { runFetchTmdbTrendingInWorker } from "./services/tmdb/runFetchTmdbTrendingInWorker";
import { updateVLCPath } from "./services/vlc/updateVLCPath";
import { getSnapshot } from "./services/vlc/getSnapshot";
import { takeSnapshot } from "./services/vlc/takeSnapshot";

export default function CoreControllers(win: BrowserWindow) {
  const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY

  ipcMain.handle('get-platform', () => process.platform)

  ipcMain.handle('get-metadata', getMetadata)
  ipcMain.handle('authenticate-user', async (_event, args) => await authenticateUser(args))
  ipcMain.handle('fetch-tmdb-trending', async (_event) => await runFetchTmdbTrendingInWorker(TMDB_API_KEY!, win))
  ipcMain.handle('get-local-tmdb-trending', async (_event) => await getLocalTmdbTrending())

  ipcMain.handle('update-current-playlist', async (_event) => {
    const response = await updateCurrentPlaylist()
    if (response.isSuccess) await runFetchTmdbTrendingInWorker(TMDB_API_KEY!, win)
    return response
  })

  ipcMain.handle('take-snapshot', async (_event) => await takeSnapshot())
  ipcMain.handle('get-snapshot', async (_event, args) => await getSnapshot(args))

  ipcMain.handle('update-vod', async (_event, args) => await updateVod(args))
  ipcMain.handle('update-series', async (_event, args) => await updateSeries(args))
  ipcMain.handle('update-live', async (_event, args) => await updateLive(args))
  
  ipcMain.handle('add-playlist-to-meta', async (_event, args) => await addPlaylistToMeta(args))
  ipcMain.handle('edit-playlist-info', async (_event, args) => await editPlaylistInfo(args))
  ipcMain.handle('remove-playlist', async (_event, args) => await removePlaylist(args))

  ipcMain.handle('get-local-vod-playlist', async (_event, args) => await getLocalVodPlaylist(args))
  ipcMain.handle('get-local-series-playlist', async (_event, args) => await getLocalSeriesPlaylist(args))
  ipcMain.handle('get-local-live-playlist', async (_event, args) => await getLocalLivePlaylist(args))

  ipcMain.handle('get-playlist-info', async (_event, args) => await getPlaylistInfo(args))
  ipcMain.handle('get-vod-info', async (_event, args) => await getVodInfo(args))
  ipcMain.handle('get-serie-info', async (_event, args) => await getSerieInfo(args))

  ipcMain.handle('get-user-data', async (_event, args) => await getUserData(args))
  ipcMain.handle('update-user-data', async (_event, args) => await updateUserData(args))

  ipcMain.handle('change-current-playlist', async (_event, args) => await changeCurrentPlaylist(args))
  ipcMain.handle('updated-at-playlist', async (_event, args) => await updatedAtPlaylist(args))

  ipcMain.handle('create-profile', async (_event, args) => await createProfile(args))
  ipcMain.handle('switch-profile', async (_event, args) => await switchProfile(args))
  ipcMain.handle('rename-profile', async (_event, args) => await renameProfile(args))
  ipcMain.handle('remove-profile', async (_event, args) => await removeProfile(args))

  ipcMain.handle('update-vlc-path', async (_event) => updateVLCPath())
  ipcMain.handle('launch-vlc', async (_event, args) => launchVLC(args, win))
  ipcMain.handle('get-vlc-state', async (_event) => await getVLCState())
}
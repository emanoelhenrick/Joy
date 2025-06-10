import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
  getMetadata: () => ipcRenderer.invoke('get-metadata'),

  updateCurrentPlaylist: async (args: any) => await ipcRenderer.invoke('update-current-playlist', args),

  updateVod: async (args: any) => await ipcRenderer.invoke('update-vod', args),
  updateSeries: async (args: any) => await ipcRenderer.invoke('update-series', args),
  updateLive: async (args: any) => await ipcRenderer.invoke('update-live', args),

  authenticateUser: async (args: any) => await ipcRenderer.invoke('authenticate-user', args),
  fetchTmdbTrending: async (args: any) => await ipcRenderer.invoke('fetch-tmdb-trending', args),

  addPlaylistToMeta: async (args: any) => await ipcRenderer.invoke('add-playlist-to-meta', args),
  editPlaylistInfo: async (args: any) => await ipcRenderer.invoke('edit-playlist-info', args),
  removePlaylist: async (args: any) => await ipcRenderer.invoke('remove-playlist', args),

  getLocalVodPlaylist: async (args: any) => await ipcRenderer.invoke('get-local-vod-playlist', args),
  getLocalSeriesPlaylist: async (args: any) => await ipcRenderer.invoke('get-local-series-playlist', args),
  getLocalLivePlaylist: async (args: any) => await ipcRenderer.invoke('get-local-live-playlist', args),

  getPlaylistInfo: async (args: any) => await ipcRenderer.invoke('get-playlist-info', args),
  getVodInfo: async (args: any) => await ipcRenderer.invoke('get-vod-info', args),
  getSerieInfo: async (args: any) => await ipcRenderer.invoke('get-serie-info', args),

  getUserData: async (args: any) => await ipcRenderer.invoke('get-user-data', args),
  updateUserData: async (args: any) => await ipcRenderer.invoke('update-user-data', args),

  changeCurrentPlaylist: async (args: any) => await ipcRenderer.invoke('change-current-playlist', args),
  updatedAtPlaylist: async (args: any) => await ipcRenderer.invoke('updated-at-playlist', args),

  createProfile: async (args: any) => await ipcRenderer.invoke('create-profile', args),
  switchProfile: async (args: any) => await ipcRenderer.invoke('switch-profile', args),
  renameProfile: async (args: any) => await ipcRenderer.invoke('rename-profile', args),
  removeProfile: async (args: any) => await ipcRenderer.invoke('remove-profile', args),

  launchVLC: async (args: any) => await ipcRenderer.invoke('launch-vlc', args),
  getVLCState: async (args: any) => await ipcRenderer.invoke('get-vlc-state', args),
  removeAllListeners: (args: any) => ipcRenderer.removeAllListeners(args),
})

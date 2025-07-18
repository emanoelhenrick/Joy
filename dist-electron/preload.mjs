"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  // ...
  getPlatform: () => electron.ipcRenderer.invoke("get-platform"),
  getMetadata: () => electron.ipcRenderer.invoke("get-metadata"),
  updateCurrentPlaylist: async (args) => await electron.ipcRenderer.invoke("update-current-playlist", args),
  takeSnapshot: async (args) => await electron.ipcRenderer.invoke("take-snapshot", args),
  getSnapshot: async (args) => await electron.ipcRenderer.invoke("get-snapshot", args),
  updateVod: async (args) => await electron.ipcRenderer.invoke("update-vod", args),
  updateSeries: async (args) => await electron.ipcRenderer.invoke("update-series", args),
  updateLive: async (args) => await electron.ipcRenderer.invoke("update-live", args),
  authenticateUser: async (args) => await electron.ipcRenderer.invoke("authenticate-user", args),
  fetchTmdbTrending: async (args) => await electron.ipcRenderer.invoke("fetch-tmdb-trending", args),
  getLocalTmdbTrending: async (args) => await electron.ipcRenderer.invoke("get-local-tmdb-trending", args),
  addPlaylistToMeta: async (args) => await electron.ipcRenderer.invoke("add-playlist-to-meta", args),
  editPlaylistInfo: async (args) => await electron.ipcRenderer.invoke("edit-playlist-info", args),
  removePlaylist: async (args) => await electron.ipcRenderer.invoke("remove-playlist", args),
  getLocalVodPlaylist: async (args) => await electron.ipcRenderer.invoke("get-local-vod-playlist", args),
  getLocalSeriesPlaylist: async (args) => await electron.ipcRenderer.invoke("get-local-series-playlist", args),
  getLocalLivePlaylist: async (args) => await electron.ipcRenderer.invoke("get-local-live-playlist", args),
  getPlaylistInfo: async (args) => await electron.ipcRenderer.invoke("get-playlist-info", args),
  getVodInfo: async (args) => await electron.ipcRenderer.invoke("get-vod-info", args),
  getSerieInfo: async (args) => await electron.ipcRenderer.invoke("get-serie-info", args),
  getUserData: async (args) => await electron.ipcRenderer.invoke("get-user-data", args),
  updateUserData: async (args) => await electron.ipcRenderer.invoke("update-user-data", args),
  changeCurrentPlaylist: async (args) => await electron.ipcRenderer.invoke("change-current-playlist", args),
  updatedAtPlaylist: async (args) => await electron.ipcRenderer.invoke("updated-at-playlist", args),
  createProfile: async (args) => await electron.ipcRenderer.invoke("create-profile", args),
  switchProfile: async (args) => await electron.ipcRenderer.invoke("switch-profile", args),
  renameProfile: async (args) => await electron.ipcRenderer.invoke("rename-profile", args),
  removeProfile: async (args) => await electron.ipcRenderer.invoke("remove-profile", args),
  launchVLC: async (args) => await electron.ipcRenderer.invoke("launch-vlc", args),
  getVLCState: async (args) => await electron.ipcRenderer.invoke("get-vlc-state", args),
  updateVLCPath: async (args) => await electron.ipcRenderer.invoke("update-vlc-path", args),
  removeAllListeners: (args) => electron.ipcRenderer.removeAllListeners(args)
});

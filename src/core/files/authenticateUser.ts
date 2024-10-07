import axios from "axios";
import { PlaylistInfo } from "../models/PlaylistInfo";

export async function authenticateUser(playlistInfo: PlaylistInfo) {
  const res = await axios.get(`${playlistInfo.url}/player_api.php?username=${playlistInfo.username}&password=${playlistInfo.password}`)
  if (res.status === 200) return true
  return false
}
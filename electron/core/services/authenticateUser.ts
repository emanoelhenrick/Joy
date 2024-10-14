import axios from "axios";

export async function authenticateUser(url: string) {
  const res = await axios.get(url)
  if (res.status === 200) return true
  return false
}
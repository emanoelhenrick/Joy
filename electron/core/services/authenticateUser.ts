import axios from "axios";

export interface AuthRes {
  status: boolean
  message: string
}

export async function authenticateUser(url: string) {
  const res = await axios.get(url)
  if (res.status !== 200) return { status: false, message: res.statusText }
  if (res.data.user_info.status === 'Expired') return { status: false, message: 'Access denied, account expired.' }
  return { status: true, message: 'Validated' }
}
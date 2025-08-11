import axios from "axios";

export interface AuthRes {
  status: boolean
  message: string
}

export async function authenticateUser(url: string) {
  try {
    const res = await axios.get(url)
    if (res.status !== 200) return { status: false, message: res.statusText }
    if (res.data.user_info.status === 'Expired') return { status: false, message: 'Access denied, account expired.' }
    return { status: true, message: 'Validated' }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message) return { status: false, message: error.message }
      return { status: false, message: 'Unknown error' }
    }
  }
}
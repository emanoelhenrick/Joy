import axios from "axios";

export interface UserInfo {
  status: string
  exp_date: string
}

export interface AuthRes {
  status: boolean
  message: string
  user_info?: UserInfo
}

export async function authenticateUser(url: string) {
  try {
    const res = await axios.get(url)
    if (res.status !== 200) return { status: false, message: res.statusText }
    if (res.data.user_info.status === 'Expired') return { status: false, message: 'Access denied, account expired.', user_info: res.data.user_info }
    return { status: true, message: 'Validated', user_info: res.data.user_info }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message) return { status: false, message: error.message }
      return { status: false, message: 'Unknown error' }
    }
  }
}
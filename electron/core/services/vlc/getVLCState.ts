import axios from 'axios';

export interface VlcState {
  time: number
  length: number
  state: string
}

export async function getVLCState(): Promise<VlcState | undefined> {
  const res = await axios.get('http://127.0.0.1:9090/requests/status.json', {
    auth: {
      username: '',
      password: 'joy'
    },
    timeout: 500
  })
  return res.data
}
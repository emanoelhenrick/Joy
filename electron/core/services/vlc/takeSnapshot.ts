import axios from "axios"

export async function takeSnapshot(): Promise<boolean> {
  try {
    await axios.get('http://127.0.0.1:9090/requests/status.xml?command=snapshot', {
      auth: {
        username: '',
        password: 'joy'
      },
      timeout: 500
    })

    return true;
  } catch (error) {
    console.log('erro snapshot');
    return false;
  }
}
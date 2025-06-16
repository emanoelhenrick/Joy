import path from "path"
import crypto from 'crypto'
import fs from "fs"
import { getSnapshotsFolder } from "./paths"

export async function getSnapshot(url: string) {
  const filename = crypto.createHash('md5').update(url, 'utf8').digest('hex')
  const snapshotPath = path.join(getSnapshotsFolder(), filename + '.jpg')
  try {
    const data = await fs.promises.readFile(snapshotPath);
    return `data:image/png;base64,${data.toString('base64')}`
  } catch (error) {
    return ''
  }
}
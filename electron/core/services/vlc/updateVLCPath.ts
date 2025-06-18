import { dialog } from "electron";
import { MetaProps } from "../../models/MetaProps";
import { readAsync, writeAsync } from "fs-jetpack";
import { META_PATH } from "../utils/paths";

export async function updateVLCPath() {
  const result = await dialog.showOpenDialog({
    title: 'Selecione o executável do programa',
    properties: ['openFile'],
    filters: [
      { name: 'Executáveis', extensions: ['exe', 'app', 'bat', 'sh', '*'] },
    ],
  })
  
  if (result.filePaths.length === 0) return
  const path = result.filePaths[0]

  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  metadata.vlcPath = path

  await writeAsync(META_PATH, metadata)

  return path
}
import { BaseDirectory, create, exists, mkdir, readFile } from '@tauri-apps/plugin-fs';
import axios from 'axios';
import Resizer from "react-image-file-resizer";
import * as path from '@tauri-apps/api/path';
import { fetch } from '@tauri-apps/plugin-http';
import { Base64 } from 'js-base64';

interface ImageProps {
  playlistName: string
  type: string
  id: string
  url: string
}

const AppLocalData = { baseDir: BaseDirectory.AppLocalData }

export async function getCompressImage({ playlistName, type, id, url}: ImageProps) {
  const imageExists = await exists(`cache/${playlistName}/${type}/${id}.jpg`, AppLocalData);

  if (imageExists) {
    const byteImage = await readFile(`cache/${playlistName}/${type}/${id}.jpg`, AppLocalData);
    return Base64.fromUint8Array(byteImage)
  }

  const res = await fetch(url, { method: 'GET' });

  const resizeFile = (file: Blob): Promise<Blob> =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        154,
        231,
        "JPG",
        1,
        0,
        (uri) => resolve(uri as Blob),
        "blob"
    );
  });

  const blobImage = await resizeFile(await res.blob())

  const binaryImage = new Uint8Array(await blobImage.arrayBuffer())

  // const cacheFolderExists = await exists('cache', AppLocalData);
  // if (!cacheFolderExists) await mkdir('cache', AppLocalData);

  // const playlistFolderExists = await exists(`cache/${playlistName}`, AppLocalData);
  // if (!playlistFolderExists) await mkdir('cache', AppLocalData);

  // const typeFolderExists = await exists(`cache/${playlistName}/${type}`, AppLocalData);
  // if (!typeFolderExists) await mkdir('cache', AppLocalData);

  const file = await create(`cache/${playlistName}/${type}/${id}.jpg`, AppLocalData)
  await file.write(binaryImage);
  await file.close();

  return Base64.fromUint8Array(binaryImage)
}
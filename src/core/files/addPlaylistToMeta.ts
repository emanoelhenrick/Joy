import { BaseDirectory, create, exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

interface MetaProps {
  playlists: string[]
}

export async function addPlaylistToMeta(playlistName: string) {
  const metaExists = await exists('playlists/meta.json', { baseDir: BaseDirectory.AppLocalData })

  if (!metaExists) {
    const metadata = { playlists: [playlistName] }
    const meta = await create(`playlists/meta.json`, { baseDir: BaseDirectory.AppLocalData })
    await meta.write(new TextEncoder().encode(JSON.stringify(metadata)));
    return await meta.close();
  }

  const metajson = await readTextFile('playlists/meta.json', { baseDir: BaseDirectory.AppLocalData });
  const metadata: MetaProps = JSON.parse(metajson)

  if (metadata.playlists.includes(playlistName)) return
  metadata.playlists.push(playlistName)

  console.log(metadata);
  console.log(metadata.playlists.includes(playlistName));
  
  

  const contents = JSON.stringify(metadata);
  await writeTextFile('playlists/meta.json', contents, { baseDir: BaseDirectory.AppLocalData });
}
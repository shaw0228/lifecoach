import axios from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const musicList = [
  {
    name: 'healing-music.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
  }
];

async function downloadMusic() {
  for (const music of musicList) {
    const filePath = join(__dirname, '../public', music.name);
    const response = await axios({
      method: 'GET',
      url: music.url,
      responseType: 'stream'
    });

    response.data.pipe(createWriteStream(filePath));
    console.log(`下载完成: ${music.name}`);
  }
}

downloadMusic().catch(console.error);
import { HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';

const buff = Buffer.alloc(100);
const header = Buffer.from('mvhd');

export async function getVideoLength(filePath: string) {
  try {
    if (filePath) {
      console.log(filePath);
      const file = await fs.open(filePath, 'r');
      const { buffer } = await file.read(buff, 0, 100, 0);

      await file.close();

      const start = buffer.indexOf(header) + 16;
      const timeScale = buffer.readUInt32BE(start);
      const duration = buffer.readUInt32BE(start + 4);

      const videoLength = Math.floor((duration / timeScale) * 1000) / 1000;
      return videoLength;
    } else {
      throw new HttpException(
        `Failed to get file`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  } catch (error) {
    throw new HttpException(error, 400, { cause: new Error(error.message) });
  }
}
// const r = getVideoLength('uploads/video-1688212729396-198802749.mp4');
// r.then((r) => console.log(r));

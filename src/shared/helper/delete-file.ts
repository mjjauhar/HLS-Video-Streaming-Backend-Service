import { HttpException } from '@nestjs/common';
import { promises as fs } from 'fs';

export async function deleteFile(
  filePath: string,
  retryCount = 3,
  delay = 1000,
) {
  try {
    return await fs.unlink(filePath);
  } catch (error) {
    if (retryCount > 0 && error.code === 'EBUSY') {
      console.log(
        `File is busy or locked. Retrying in ${delay / 1000} seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      await deleteFile(filePath, retryCount - 1, delay);
    } else {
      console.error('Error deleting file:', error.message);
    }
  }
}

// deleteFile('uploads\\video-1688206263847-334977013.mp4').then((d) =>
//   console.log(d),
// );

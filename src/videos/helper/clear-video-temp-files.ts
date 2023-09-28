import { HttpException } from '@nestjs/common';
import { promisify } from 'util';
import { unlinkSync, rmdirSync, readdirSync, lstatSync ,readdir} from 'fs';
import { join } from 'path';

const readdirAsync = promisify(readdir);

export async function ClearVideoTempFiles() {
  try {
    const tempFolderPath = 'temp';
    const uploadsFolder = 'uploads';
    const hlsFolder = 'hls';

    // Construct the path to the "uploads" folder
    const uploadsFolderPath = join(tempFolderPath, uploadsFolder);

    // Construct the path to the "hls" folder
    const hlsFolderPath = join(tempFolderPath, hlsFolder);

    // Check if the "uploads" folder exists
    if (folderExists(uploadsFolderPath)) {
      // Delete the files and folders inside the "uploads" folder recursively
      deleteFilesAndFolders(uploadsFolderPath);
      console.log(`Files and folders inside 'uploads' deleted successfully.`);
    } else {
      console.log(`Folder 'uploads' not found. Nothing to delete.`);
    }

    // Check if the "hls" folder exists
    if (folderExists(hlsFolderPath)) {
      // Delete the entire "hls" folder recursively
      deleteFilesAndFolders(hlsFolderPath);
      console.log(`'hls' folder deleted successfully.`);
    } else {
      console.log(`Folder 'hls' not found. Nothing to delete.`);
    }

    console.log('All video folders deleted successfully.');
    return true;
  } catch (err) {
    console.error('Error while clearing video temp files:', err);
    throw new HttpException('Error while clearing video temp files', 500);
  }
}

export function deleteFilesAndFolders(path: string) {
  if (readdirSync(path).length > 0) {
    readdirSync(path).forEach((file) => {
      const curPath = join(path, file);

      if (lstatSync(curPath).isDirectory()) {
        // Recursively delete subdirectories
        deleteFilesAndFolders(curPath);
        // After deleting all files and subfolders, delete the current folder
        rmdirSync(curPath);
      } else {
        // Delete the file
        unlinkSync(curPath);
      }
    });
  }
}

export function folderExists(path: string): boolean {
  try {
    return readdirSync(path).length > 0;
  } catch (err) {
    return false;
  }
}
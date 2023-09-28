import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const thumbnailUploadInterceptor = () =>
  // Here `'video'` is the variable name where the uploaded file details will be stored
  FileInterceptor('file', {
    storage: diskStorage({
      destination: 'temp/thumbnail/', // specify where to store the file here
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
      },
    }),
  });

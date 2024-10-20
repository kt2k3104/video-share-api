import * as path from 'path';
import * as fs from 'fs';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const folderPath = `e-commerce/images/`;

    try {
      const cloudFile = await v2.uploader.upload(file.path, {
        folder: folderPath,
        resource_type: 'auto',
      });
      if (cloudFile) {
        this.clearFile(file.path);
      }
      return cloudFile;
    } catch (error) {
      throw new InternalServerErrorException('Could not upload file');
    }
  }

  async destroyFile(url: string): Promise<CloudinaryResponse> {
    // agora/images/avatars/ --> path in cloudiary folder
    const publish_id: string =
      `e-commerce/images/` + url.split(`e-commerce/images/`)[1].split('.')[0];

    try {
      const response = await v2.uploader.destroy(publish_id);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Could not remove file');
    }
  }

  public clearFile(filePath: string): boolean {
    filePath = path.join(__dirname, '..', '..', filePath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fs.unlink(filePath, (err) => {});

    return true;
  }
}

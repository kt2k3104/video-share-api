import { promises as fs } from 'fs';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return this.uploadToCloudinary(file, 'image', 'video-share/images/');
  }

  async uploadVideo(
    file: Express.Multer.File,
    startTime: number = 0,
  ): Promise<CloudinaryResponse> {
    return this.uploadToCloudinary(
      file,
      'video',
      'video-share/videos/',
      startTime,
    );
  }

  async uploadToCloudinary(
    file: Express.Multer.File,
    resourceType: 'image' | 'video' | 'auto',
    folderPath: string,
    startTime: number = 0,
  ): Promise<CloudinaryResponse> {
    try {
      const cloudFile = await v2.uploader.upload(file.path, {
        folder: folderPath,
        resource_type: resourceType,
        eager: [
          {
            format: 'jpg',
            width: 1080,
            height: 1440,
            crop: 'fill',
            bgravity: 'auto',
            start_offset: startTime,
          },
        ],
      });
      if (cloudFile) {
        await this.clearFile(file.path);
      }
      return cloudFile;
    } catch (error) {
      throw new InternalServerErrorException('Could not upload file');
    }
  }

  // Hàm để cập nhật thumbnail của video với start_offset mới
  async updateThumbnailStartOffset(
    publicId: string, // ID công khai của video trên Cloudinary
    startOffset: number, // Thời gian start offset mới
  ): Promise<CloudinaryResponse> {
    try {
      const updatedFile = await v2.uploader.explicit(publicId, {
        type: 'upload',
        resource_type: 'video',
        eager: [
          {
            format: 'jpg',
            width: 1080,
            height: 1440,
            crop: 'fill',
            bgravity: 'auto',
            start_offset: startOffset,
          },
        ],
      });

      return updatedFile;
    } catch (error) {
      throw new InternalServerErrorException('Could not update thumbnail');
    }
  }

  async destroyFileVideo(url: string): Promise<CloudinaryResponse> {
    const publish_id: string =
      `video-share/videos/` + url.split(`video-share/videos/`)[1].split('.')[0];
    try {
      const response = await v2.uploader.destroy(publish_id, {
        resource_type: 'video',
      });
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Could not remove file');
    }
  }

  async destroyFileImage(url: string): Promise<CloudinaryResponse> {
    const publish_id: string =
      `video-share/images/` + url.split(`video-share/images/`)[1].split('.')[0];

    try {
      const response = await v2.uploader.destroy(publish_id);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Could not remove file');
    }
  }

  public async clearFile(filePath: string): Promise<boolean> {
    try {
      // Tạo đường dẫn tuyệt đối tới tệp (dùng trong môi trường production)
      // filePath = path.join(__dirname, '..', '..', filePath);

      // Kiểm tra xem tệp có tồn tại không trước khi xóa
      try {
        await fs.access(filePath); // Kiểm tra quyền truy cập tệp
      } catch {
        console.warn(`File not found: ${filePath}`);
        return false; // Tệp không tồn tại, không cần xóa
      }

      // Xóa tệp và xử lý lỗi nếu có
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error(
        `An error occurred while deleting file at ${filePath}:`,
        error,
      );
      return false;
    }
  }
}

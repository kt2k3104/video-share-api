import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/entities/video.entity';

@Injectable()
export class VideoRepository extends Repository<Video> {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {
    super(
      videoRepository.target,
      videoRepository.manager,
      videoRepository.queryRunner,
    );
  }
}

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoTag } from 'src/entities/video-tag.entity';

@Injectable()
export class VideoTagRepository extends Repository<VideoTag> {
  constructor(
    @InjectRepository(VideoTag)
    private videoTagRepository: Repository<VideoTag>,
  ) {
    super(
      videoTagRepository.target,
      videoTagRepository.manager,
      videoTagRepository.queryRunner,
    );
  }
}

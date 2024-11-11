import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';

@Injectable()
export class LikeRepository extends Repository<Like> {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {
    super(
      likeRepository.target,
      likeRepository.manager,
      likeRepository.queryRunner,
    );
  }
}

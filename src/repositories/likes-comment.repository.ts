import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesComments } from 'src/entities/likes- comments.entity';

@Injectable()
export class LikesCommentRepository extends Repository<LikesComments> {
  constructor(
    @InjectRepository(LikesComments)
    private likesCommentsRepository: Repository<LikesComments>,
  ) {
    super(
      likesCommentsRepository.target,
      likesCommentsRepository.manager,
      likesCommentsRepository.queryRunner,
    );
  }
}

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/entities/follow.entity';

@Injectable()
export class FollowRepository extends Repository<Follow> {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {
    super(
      followRepository.target,
      followRepository.manager,
      followRepository.queryRunner,
    );
  }
}

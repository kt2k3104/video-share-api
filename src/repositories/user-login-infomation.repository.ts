import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginInformation } from 'src/entities/user-login-infomations.entity';

@Injectable()
export class UserLoginInformationRepository extends Repository<UserLoginInformation> {
  constructor(
    @InjectRepository(UserLoginInformation)
    private userLoginInformationRepository: Repository<UserLoginInformation>,
  ) {
    super(
      userLoginInformationRepository.target,
      userLoginInformationRepository.manager,
      userLoginInformationRepository.queryRunner,
    );
  }

  async findOneByUserId(userId: number): Promise<UserLoginInformation> {
    return await this.userLoginInformationRepository.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async findOneByAccessToken(
    accessToken: string,
  ): Promise<UserLoginInformation> {
    return await this.userLoginInformationRepository.findOne({
      where: {
        access_token: accessToken,
      },
    });
  }

  async findOneByRefreshToken(
    refreshToken: string,
  ): Promise<UserLoginInformation> {
    return await this.userLoginInformationRepository.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
  }
}

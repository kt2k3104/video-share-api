import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { Type } from 'class-transformer';
import { SuccessRes } from 'src/common/types/response';
import { TokenInfoRes } from './token-info.req';

class LoginInfo extends TokenInfoRes {
  @ApiResponseProperty({ type: User })
  user: User;
}

export class LoginRes extends SuccessRes {
  @ApiResponseProperty({ type: LoginInfo })
  @Type(() => LoginInfo)
  data: LoginInfo;
}

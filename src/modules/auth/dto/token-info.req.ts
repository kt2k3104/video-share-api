import { ApiResponseProperty } from '@nestjs/swagger';

export class TokenInfoRes {
  @ApiResponseProperty({ type: String })
  access_token: string;

  @ApiResponseProperty({ type: String })
  refresh_token: string;
}

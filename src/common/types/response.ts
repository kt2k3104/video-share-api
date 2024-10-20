import { ApiResponseProperty } from '@nestjs/swagger';

export class SuccessRes {
  constructor(message: string) {
    this.success = true;
    this.message = message;
  }

  @ApiResponseProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiResponseProperty({ type: String, example: 'success!!' })
  message: string;
}

export class PaginationMetadata {
  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  limit: number;

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  total: number;

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  page: number;
}

export class PaginationRes {
  @ApiResponseProperty({ type: Array })
  data: any[];

  @ApiResponseProperty({ type: PaginationMetadata })
  metadata: PaginationMetadata;
}

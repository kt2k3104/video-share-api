import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IsExisted } from 'src/common/validator/existed.validation';

export class CreateCommentReq {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  content: string; // Nội dung của bình luận

  @ApiProperty({
    type: Number,
    required: false,
    description: 'ID của comment chính nếu đây là reply',
  })
  @IsInt()
  @IsOptional()
  @IsExisted('comments', 'id')
  parent_id?: number; // ID của comment chính nếu đây là trả lời cho comment chính

  @ApiProperty({
    type: Number,
    required: false,
    description:
      'ID của comment được trả lời nếu đây là reply trong một comment chính',
  })
  @IsInt()
  @IsOptional()
  @ValidateIf((o) => o.parent_id != null) // reply_id chỉ có giá trị nếu parent_id tồn tại
  @IsExisted('comments', 'id')
  reply_id?: number; // ID của comment được trả lời trong trường hợp này là một reply
}

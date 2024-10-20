import { ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class TimestampEntity {
  @ApiResponseProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ApiResponseProperty({ type: Date })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;
}

export class NotSelectTimestampEntity {
  @ApiResponseProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  created_at: Date;

  @ApiResponseProperty({ type: Date })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updated_at?: Date;
}

export class NotSelectTimestampCommonEntity extends NotSelectTimestampEntity {
  @ApiResponseProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'int' })
  @Type(() => Number)
  id: number;
}

export class CommonEntity extends TimestampEntity {
  @ApiResponseProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'int' })
  @Type(() => Number)
  id: number;
}

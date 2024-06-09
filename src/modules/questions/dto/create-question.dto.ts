import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty()
  tag_ids: number[];
}

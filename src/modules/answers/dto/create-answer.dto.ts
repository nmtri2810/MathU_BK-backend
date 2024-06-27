import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsOptional()
  @ApiProperty()
  parent_id: number;

  @IsNotEmpty()
  @ApiProperty()
  question_id: number;

  @IsNotEmpty()
  @ApiProperty()
  user_id: number;
}

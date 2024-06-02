import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
}

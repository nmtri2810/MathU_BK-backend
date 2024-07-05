import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVoteDto {
  @IsNotEmpty()
  @ApiProperty()
  is_upvoted: boolean;

  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsOptional()
  @ApiProperty()
  question_id: number;

  @IsOptional()
  @ApiProperty()
  answer_id: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Answers } from '@prisma/client';

export class Answer implements Answers {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  is_accepted: boolean;

  @ApiProperty()
  question_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;
}

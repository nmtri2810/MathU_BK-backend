import { ApiProperty } from '@nestjs/swagger';
import { Votes } from '@prisma/client';

export class Vote implements Votes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  is_upvoted: boolean;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  question_id: number;

  @ApiProperty()
  answer_id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;
}

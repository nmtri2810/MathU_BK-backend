import { ApiProperty } from '@nestjs/swagger';
import { LikeableTypes, Votes } from '@prisma/client';

export class Vote implements Votes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  is_upvoted: boolean;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  likeable_id: number;

  @ApiProperty()
  likeable_type: LikeableTypes;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { LikeableTypes } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @IsNotEmpty()
  @ApiProperty()
  is_upvoted: boolean;

  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  likeable_id: number;

  @IsNotEmpty()
  @ApiProperty()
  likeable_type: LikeableTypes;
}

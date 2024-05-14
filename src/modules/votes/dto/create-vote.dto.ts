import { ApiProperty } from '@nestjs/swagger';
import { VoteableTypes } from '@prisma/client';
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
  voteable_id: number;

  @IsNotEmpty()
  @ApiProperty()
  voteable_type: VoteableTypes;
}

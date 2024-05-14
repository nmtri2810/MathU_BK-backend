import { PartialType, PickType } from '@nestjs/swagger';
import { CreateVoteDto } from './create-vote.dto';

export class UpdateVoteDto extends PartialType(
  PickType(CreateVoteDto, ['is_upvoted'] as const),
) {}

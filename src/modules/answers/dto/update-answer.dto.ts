import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answer.dto';
import { IsOptional } from 'class-validator';

export class UpdateAnswerDto extends PartialType(
  OmitType(CreateAnswerDto, ['question_id', 'user_id'] as const),
) {
  @IsOptional()
  @ApiProperty()
  is_accepted: boolean;
}

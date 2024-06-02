import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answer.dto';

export class UpdateAnswerDto extends PartialType(
  OmitType(CreateAnswerDto, ['question_id', 'user_id'] as const),
) {}

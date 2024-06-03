import { ApiProperty } from '@nestjs/swagger';
import { QuestionsTags } from '@prisma/client';
import { Tag } from 'src/modules/tags/entities/tag.entity';

export class QuestionTag implements QuestionsTags {
  @ApiProperty()
  question_id: number;

  @ApiProperty()
  tag_id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  tag: Tag;
}

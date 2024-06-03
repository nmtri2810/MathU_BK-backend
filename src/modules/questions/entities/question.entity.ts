import { ApiProperty } from '@nestjs/swagger';
import { Questions } from '@prisma/client';
import { Answer } from 'src/modules/answers/entities/answer.entity';
import { QuestionTag } from 'src/modules/questions-tags/entities/question-tag.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Vote } from 'src/modules/votes/entities/vote.entity';

export class Question implements Questions {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;
}

export class FullQuestion extends Question {
  @ApiProperty()
  votes: Vote[];

  @ApiProperty()
  answers: Answer[];

  @ApiProperty()
  tags: QuestionTag[] | Tag[];

  @ApiProperty()
  user: Partial<User>;

  @ApiProperty()
  _count: {
    votes: number;
    answers: number;
    tags: number;
  };
}

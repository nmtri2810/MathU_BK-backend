import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'nestjs-prisma';
import { FullQuestion, Question } from './entities/question.entity';
import { UsersService } from '../users/users.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from '../users/entities/user.entity';
import { Action } from 'src/constants/enum';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';
import { questionIncludeConfig } from 'src/constants/prisma-config';

@Injectable()
export class QuestionsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private caslAbility: CaslAbilityFactory,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<FullQuestion> {
    const user = await this.usersService.findOne(createQuestionDto.user_id);

    if (user)
      return await this.prisma.questions.create({
        data: createQuestionDto,
        include: questionIncludeConfig,
      });
  }

  async findAll(
    page: number,
    perPage: number,
    keyword: string,
  ): Promise<PaginatedResult<FullQuestion>> {
    const paginate: PaginateFunction = paginator({ page, perPage });

    const questions: PaginatedResult<FullQuestion> = await paginate(
      this.prisma.questions,
      {
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        include: questionIncludeConfig,
        orderBy: [
          {
            created_at: 'desc',
          },
        ],
      },
    );

    questions.list = questions.list.map((question) => ({
      ...question,
      tags: question.tags.map((tag) => tag.tag), // cannot use type here?
    }));

    return questions;
  }

  async findOne(id: number): Promise<FullQuestion> {
    const question = await this.prisma.questions.findUniqueOrThrow({
      where: { id },
      include: questionIncludeConfig,
    });

    const transformedTags = question.tags.map((tagRelation) => tagRelation.tag);

    return {
      ...question,
      tags: transformedTags,
    };
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    currentUser: User,
  ): Promise<FullQuestion> {
    const questionToUpdate = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Update,
      Question,
      questionToUpdate,
    );

    return await this.prisma.questions.update({
      where: { id },
      data: updateQuestionDto,
      include: questionIncludeConfig,
    });
  }

  async remove(id: number, currentUser: User): Promise<FullQuestion> {
    const questionToDelete = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Delete,
      Question,
      questionToDelete,
    );

    return await this.prisma.questions.delete({
      where: { id },
      include: questionIncludeConfig,
    });
  }
}

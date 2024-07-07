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
import {
  answerIncludeConfig,
  questionIncludeConfig,
} from 'src/constants/prisma-config';
import { SearchFormat } from 'src/constants';

@Injectable()
export class QuestionsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private caslAbility: CaslAbilityFactory,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<FullQuestion> {
    const user = await this.usersService.findOne(createQuestionDto.user_id);

    if (user) {
      const { tag_ids, ...questionData } = createQuestionDto;

      return await this.prisma.questions.create({
        data: {
          ...questionData,
          tags: {
            create: tag_ids.map((tag_id) => ({
              tag: {
                connect: { id: tag_id },
              },
            })),
          },
        },
        include: {
          ...questionIncludeConfig,
          answers: {
            include: answerIncludeConfig,
            where: { parent_id: null },
            orderBy: [
              {
                is_accepted: 'desc',
              },
            ],
          },
        },
      });
    }
  }

  async findAll(
    page: number,
    perPage: number,
    keyword: string,
  ): Promise<PaginatedResult<FullQuestion>> {
    const paginate: PaginateFunction = paginator({ page, perPage });

    const formattedKeyword = this.handleKeyword(keyword);

    const questions: PaginatedResult<FullQuestion> = await paginate(
      this.prisma.questions,
      {
        where: this.handleWhereSearch(formattedKeyword, keyword),
        include: {
          ...questionIncludeConfig,
          answers: {
            include: answerIncludeConfig,
            where: { parent_id: null },
            orderBy: [
              {
                is_accepted: 'desc',
              },
            ],
          },
        },
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
      include: {
        ...questionIncludeConfig,
        answers: {
          include: answerIncludeConfig,
          where: { parent_id: null },
          orderBy: [
            {
              is_accepted: 'desc',
            },
          ],
        },
      },
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

    const { tag_ids, ...questionData } = updateQuestionDto;

    return await this.prisma.questions.update({
      where: { id },
      data: {
        ...questionData,
        tags: {
          deleteMany: {},
          create: tag_ids?.map((tag_id) => ({
            tag: {
              connect: { id: tag_id },
            },
          })),
        },
      },
      include: {
        ...questionIncludeConfig,
        answers: {
          include: answerIncludeConfig,
          where: { parent_id: null },
          orderBy: [
            {
              is_accepted: 'desc',
            },
          ],
        },
      },
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
      include: {
        ...questionIncludeConfig,
        answers: {
          include: answerIncludeConfig,
          where: { parent_id: null },
          orderBy: [
            {
              is_accepted: 'desc',
            },
          ],
        },
      },
    });
  }

  handleKeyword = (
    keyword: string,
  ): { format: string; value: string | number | boolean | null } => {
    if (!keyword) return;

    const formatMappings = [
      {
        format: `${SearchFormat.TAG}:`,
        handler: (value: string) => {
          return { format: SearchFormat.TAG, value };
        },
      },
      {
        format: `${SearchFormat.USER}:`,
        handler: (value: string) => {
          return { format: SearchFormat.USER, value };
        },
      },
      {
        format: `${SearchFormat.SCORE}:`,
        handler: (value: string) => {
          if (!Number(value)) return null;

          return { format: SearchFormat.SCORE, value: Number(value) };
        },
      },
      {
        format: `${SearchFormat.IS_ACCEPTED}:`,
        handler: (value: string) => {
          if (value === 'yes') {
            return { format: SearchFormat.IS_ACCEPTED, value: true };
          } else if (value === 'no') {
            return { format: SearchFormat.IS_ACCEPTED, value: false };
          } else {
            return null;
          }
        },
      },
    ];

    const matchingFormat = formatMappings.find((mapping) =>
      keyword.includes(mapping.format),
    );
    if (!matchingFormat) return null;

    const value = keyword.split(matchingFormat.format)[1];
    return matchingFormat.handler(value.trim());
  };

  handleWhereSearch = (
    formattedKeyword: {
      format: string;
      value: string | number | boolean | null;
    },
    keyword: string,
  ) => {
    if (!formattedKeyword) {
      const baseSearch = {
        OR: [
          {
            title: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        ],
      };

      return baseSearch;
    }

    switch (formattedKeyword.format) {
      case SearchFormat.TAG: {
        const tagSearch = {
          tags: {
            some: {
              tag: {
                name: { contains: formattedKeyword.value, mode: 'insensitive' },
              },
            },
          },
        };

        return tagSearch;
      }
      case SearchFormat.USER: {
        const userSearch = {
          user: {
            username: { contains: formattedKeyword.value, mode: 'insensitive' },
          },
        };

        return userSearch;
      }
      case SearchFormat.SCORE: {
        // temp
        const scoreSearch = {};

        return scoreSearch;
      }
      case SearchFormat.IS_ACCEPTED: {
        let isAcceptedSearch;

        if (formattedKeyword.value) {
          isAcceptedSearch = {
            answers: {
              some: { is_accepted: { equals: formattedKeyword.value } },
            },
          };
        } else {
          isAcceptedSearch = {
            answers: {
              every: { is_accepted: { equals: formattedKeyword.value } },
            },
          };
        }

        return isAcceptedSearch;
      }
    }
  };
}

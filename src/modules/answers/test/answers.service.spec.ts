import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AnswersService } from '../answers.service';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from 'src/modules/users/users.service';
import { QuestionsService } from 'src/modules/questions/questions.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';
import { Answer } from '../entities/answer.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Action } from 'src/constants/enum';
import { FullQuestion } from 'src/modules/questions/entities/question.entity';
import { PaginatedResult } from 'src/utils/paginator';

describe('AnswersService', () => {
  let service: AnswersService;
  let prisma: PrismaService;
  let usersService: UsersService;
  let questionsService: QuestionsService;
  let caslAbility: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersService,
        {
          provide: PrismaService,
          useValue: {
            answers: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: QuestionsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CaslAbilityFactory,
          useValue: {
            isSubjectForbidden: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnswersService>(AnswersService);
    prisma = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    questionsService = module.get<QuestionsService>(QuestionsService);
    caslAbility = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  describe('create', () => {
    it('should create and return answer when valid', async () => {
      const dto: CreateAnswerDto = {
        content: 'test',
        user_id: 1,
        question_id: 1,
        parent_id: null,
      };
      const user: User = { id: 1 } as User;
      const question: FullQuestion = { id: 1 } as FullQuestion;
      const result: Answer = { id: 1, ...dto } as Answer;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(questionsService, 'findOne').mockResolvedValue(question);
      jest.spyOn(prisma.answers, 'create').mockResolvedValue(result);

      expect(await service.create(dto)).toEqual(result);
      expect(usersService.findOne).toHaveBeenCalledWith(dto.user_id);
      expect(questionsService.findOne).toHaveBeenCalledWith(dto.question_id);
    });

    it('should throw BadRequestException if parent answer does not belong to question', async () => {
      const dto: CreateAnswerDto = {
        content: 'test',
        user_id: 1,
        question_id: 1,
        parent_id: 1,
      };
      const user: User = { id: 1 } as User;
      const question: FullQuestion = { id: 1 } as FullQuestion;
      const parentAnswer: Answer = { id: 1, question_id: 999 } as Answer;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(questionsService, 'findOne').mockResolvedValue(question);
      jest.spyOn(service, 'findOne').mockResolvedValue(parentAnswer);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(usersService.findOne).toHaveBeenCalledWith(dto.user_id);
      expect(questionsService.findOne).toHaveBeenCalledWith(dto.question_id);
      expect(service.findOne).toHaveBeenCalledWith(dto.parent_id);
    });
  });

  describe('findAll', () => {
    it('should return paginated answers', async () => {
      const question_id = 1;
      const page = 1;
      const perPage = 10;
      const paginatedResult: PaginatedResult<Answer> = {
        list: [
          { id: 1, content: '' } as Answer,
          { id: 2, content: '' } as Answer,
        ],
        meta: {
          total: 2,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
          prev: null,
          next: null,
        },
      };

      jest
        .spyOn(prisma.answers, 'count')
        .mockResolvedValue(paginatedResult.list.length);
      jest
        .spyOn(prisma.answers, 'findMany')
        .mockResolvedValue(paginatedResult.list);

      const result = await service.findAll(question_id, page, perPage);

      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return answer by id', async () => {
      const id = 1;
      const answer: Answer = { id, content: 'content' } as Answer;

      jest.spyOn(prisma.answers, 'findUniqueOrThrow').mockResolvedValue(answer);

      const result = await service.findOne(id);

      expect(result).toEqual(answer);
    });
  });

  describe('update', () => {
    it('should update answer successfully if no accepted answer exists and permissions allowed', async () => {
      const id = 1;
      const questionId = 2;
      const updateDto: UpdateAnswerDto = {
        content: 'updated',
      } as UpdateAnswerDto;
      const currentUser: User = { id: 10 } as User;
      const answerToUpdate: Answer = {
        id,
        user_id: 20,
        question_id: questionId,
      } as Answer;
      const acceptedAnswer = null;
      const answerInTransaction: Answer = { id, user_id: 20 } as Answer;
      const updatedAnswer: Answer = { id, content: 'updated' } as Answer;

      jest.spyOn(service, 'findOne').mockResolvedValue(answerToUpdate);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          answers: {
            findFirst: jest.fn().mockResolvedValue(acceptedAnswer),
            findUnique: jest.fn().mockResolvedValue(answerInTransaction),
            update: jest.fn().mockResolvedValue(updatedAnswer),
          },
          users: {
            update: jest.fn(),
          },
        }),
      );

      const result = await service.update(
        id,
        questionId,
        updateDto,
        currentUser,
      );

      expect(result).toEqual(updatedAnswer);
      expect(caslAbility.isSubjectForbidden).toHaveBeenCalledWith(
        currentUser,
        Action.Update,
        Answer,
        answerToUpdate,
      );
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if accepted answer exists', async () => {
      const id = 1;
      const questionId = 2;
      const updateDto: UpdateAnswerDto = {
        content: 'updated',
      } as UpdateAnswerDto;
      const currentUser: User = { id: 10 } as User;
      const answerToUpdate: Answer = {
        id,
        user_id: 20,
        question_id: questionId,
      } as Answer;
      const acceptedAnswer: Answer = { id: 3, is_accepted: true } as Answer;

      jest.spyOn(service, 'findOne').mockResolvedValue(answerToUpdate);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          answers: {
            findFirst: jest.fn().mockResolvedValue(acceptedAnswer),
            findUnique: jest.fn(),
            update: jest.fn(),
          },
          users: {
            update: jest.fn(),
          },
        }),
      );

      await expect(
        service.update(id, questionId, updateDto, currentUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove answer successfully if permissions allowed', async () => {
      const id = 1;
      const currentUser: User = { id: 10 } as User;
      const answerToDelete: Answer = { id, content: 'to delete' } as Answer;

      jest.spyOn(service, 'findOne').mockResolvedValue(answerToDelete);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      jest.spyOn(prisma.answers, 'delete').mockResolvedValue(answerToDelete);

      const result = await service.remove(id, currentUser);

      expect(result).toEqual(answerToDelete);
      expect(caslAbility.isSubjectForbidden).toHaveBeenCalledWith(
        currentUser,
        Action.Delete,
        Answer,
        answerToDelete,
      );
    });
  });
});

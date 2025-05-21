import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from '../questions.service';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from 'src/modules/users/users.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { FullQuestion, Question } from '../entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Action } from 'src/constants/enum';
import { PaginatedResult } from 'src/utils/paginator';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let prisma: PrismaService;
  let usersService: UsersService;
  let caslAbility: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaService,
          useValue: {
            questions: {
              create: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
              findMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: UsersService,
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

    service = module.get<QuestionsService>(QuestionsService);
    prisma = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    caslAbility = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  describe('create', () => {
    it('should create a question with tags and return it', async () => {
      const dto: CreateQuestionDto = {
        title: 'Test Title',
        description: 'Test Description',
        user_id: 1,
        tag_ids: [1, 2],
      };

      const user: User = { id: 1 } as User;
      const createdQuestion: FullQuestion = {
        id: 1,
        title: dto.title,
        description: dto.description,
      } as FullQuestion;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(prisma.questions, 'create').mockResolvedValue(createdQuestion);

      const result = await service.create(dto);

      expect(result).toEqual(createdQuestion);
      expect(usersService.findOne).toHaveBeenCalledWith(dto.user_id);
    });

    it('should not create if user not found (returns undefined)', async () => {
      const dto: CreateQuestionDto = {
        title: 'Test Title',
        description: 'Test Description',
        user_id: 1,
        tag_ids: [],
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await service.create(dto);

      expect(result).toBeUndefined();
      expect(usersService.findOne).toHaveBeenCalledWith(dto.user_id);
    });
  });

  describe('findAll', () => {
    const paginatedResult: PaginatedResult<FullQuestion> = {
      list: [
        {
          id: 1,
          tags: [
            { tag: { id: 1, name: 'tag1' } },
            { tag: { id: 2, name: 'tag2' } },
          ],
          answers: [],
        },
      ] as FullQuestion[],
      meta: {
        total: 1,
        lastPage: 1,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: null,
      },
    };

    beforeEach(() => {
      jest
        .spyOn(prisma.questions, 'count')
        .mockResolvedValue(paginatedResult.list.length);
      jest
        .spyOn(prisma.questions, 'findMany')
        .mockResolvedValue(paginatedResult.list);
    });

    test.each([
      ['', 'empty string'],
      ['no format', 'no format'],
      ['[tag]:test_tag', 'tag keyword'],
      ['[user]:test_user', 'user keyword'],
      ['[score]:1', 'score keyword'],
      ['[score]:test_score', 'score keyword'],
      ['[isaccepted]:yes', 'isaccepted keyword'],
      ['[isaccepted]:no', 'isaccepted keyword'],
      ['[isaccepted]:test_isaccepted', 'isaccepted keyword'],
    ])(
      'should return paginated questions with tags transformed for %s (%s)',
      async (keyword) => {
        const page = 1;
        const perPage = 10;

        const result = await service.findAll(page, perPage, keyword);

        expect(result.list[0].tags).toEqual([
          { id: 1, name: 'tag1' },
          { id: 2, name: 'tag2' },
        ]);
        expect(result.meta).toEqual(paginatedResult.meta);
      },
    );
  });

  describe('findOne', () => {
    it('should return question with tags transformed', async () => {
      const id = 1;
      const questionFromDb: FullQuestion = {
        id,
        tags: [
          { tag: { id: 1, name: 'tag1' } },
          { tag: { id: 2, name: 'tag2' } },
        ],
        answers: [],
      } as FullQuestion;

      jest
        .spyOn(prisma.questions, 'findUniqueOrThrow')
        .mockResolvedValue(questionFromDb);

      const result = await service.findOne(id);

      expect(result.tags).toEqual([
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ]);
      expect(result.id).toEqual(questionFromDb.id);
      expect(result.answers).toEqual(questionFromDb.answers);
    });
  });

  describe('update', () => {
    it('should update question and return updated question', async () => {
      const id = 1;
      const updateDto: UpdateQuestionDto = {
        title: 'updated title',
        description: 'updated desc',
        tag_ids: [1, 2],
      };
      const currentUser: User = { id: 1 } as User;
      const updatedQuestion: FullQuestion = {
        id,
        title: updateDto.title,
        description: updateDto.description,
        tags: [
          { tag: { id: 1, name: 'tag1' } },
          { tag: { id: 2, name: 'tag2' } },
        ],
      } as FullQuestion;

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedQuestion);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      jest.spyOn(prisma.questions, 'update').mockResolvedValue(updatedQuestion);

      const result = await service.update(id, updateDto, currentUser);

      expect(result).toEqual(updatedQuestion);
      expect(caslAbility.isSubjectForbidden).toHaveBeenCalledWith(
        currentUser,
        Action.Update,
        Question,
        updatedQuestion,
      );
    });
  });

  describe('remove', () => {
    it('should delete question and return deleted question', async () => {
      const id = 1;
      const currentUser: User = { id: 1 } as User;
      const questionToDelete: FullQuestion = { id } as FullQuestion;

      jest.spyOn(service, 'findOne').mockResolvedValue(questionToDelete);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      jest
        .spyOn(prisma.questions, 'delete')
        .mockResolvedValue(questionToDelete);

      const result = await service.remove(id, currentUser);

      expect(result).toEqual(questionToDelete);
      expect(caslAbility.isSubjectForbidden).toHaveBeenCalledWith(
        currentUser,
        Action.Delete,
        Question,
        questionToDelete,
      );
    });
  });
});

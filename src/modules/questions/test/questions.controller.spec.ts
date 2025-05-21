import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { QuestionsController } from '../questions.controller';
import { QuestionsService } from '../questions.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { FullQuestion } from '../entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { PaginatedResult } from 'src/utils/paginator';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let questionsService: QuestionsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AbilitiesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<QuestionsController>(QuestionsController);
    questionsService = module.get<QuestionsService>(QuestionsService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call questionsService.create and return result', async () => {
      const dto: CreateQuestionDto = {
        title: 'Title',
        description: 'Desc',
        user_id: 1,
        tag_ids: [1, 2],
      } as CreateQuestionDto;
      const result: FullQuestion = {
        id: 1,
        title: 'Title',
        description: 'Desc',
        user_id: 1,
      } as FullQuestion;

      jest.spyOn(questionsService, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(questionsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call questionsService.findAll and return list', async () => {
      const result: PaginatedResult<FullQuestion> = {
        list: [],
        meta: {
          total: 0,
          lastPage: 0,
          currentPage: 0,
          perPage: 0,
          prev: 0,
          next: 0,
        },
      };

      jest.spyOn(questionsService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(questionsService.findAll).toHaveBeenCalledWith(1, 10, '');
    });
  });

  describe('findOne', () => {
    it('should call questionsService.findOne and return one question', async () => {
      const id = 1;
      const result: FullQuestion = { id, title: 'Question 1' } as FullQuestion;

      jest.spyOn(questionsService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(questionsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call usersService.findOne and questionsService.update then return updated question', async () => {
      const id = 1;
      const updateDto: UpdateQuestionDto = {
        title: 'Updated title',
        description: 'Updated desc',
        tag_ids: [1],
      } as UpdateQuestionDto;
      const req = { user: { userId: 1 } } as unknown as Request;
      const currentUser: User = { id: 1 } as User;
      const result: FullQuestion = { id, ...updateDto } as FullQuestion;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(currentUser);
      jest.spyOn(questionsService, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateDto, req)).toBe(result);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(questionsService.update).toHaveBeenCalledWith(
        id,
        updateDto,
        currentUser,
      );
    });
  });

  describe('remove', () => {
    it('should call usersService.findOne and questionsService.remove then return result', async () => {
      const id = 1;
      const req = { user: { userId: 1 } } as unknown as Request;
      const currentUser: User = { id: 1 } as User;
      const result: FullQuestion = { id } as FullQuestion;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(currentUser);
      jest.spyOn(questionsService, 'remove').mockResolvedValue(result);

      expect(await controller.remove(id, req)).toBe(result);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(questionsService.remove).toHaveBeenCalledWith(id, currentUser);
    });
  });
});

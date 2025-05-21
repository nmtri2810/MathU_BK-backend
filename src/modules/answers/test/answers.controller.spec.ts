import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AnswersController } from '../answers.controller';
import { AnswersService } from '../answers.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { PaginatedResult } from 'src/utils/paginator';
import { Answer } from '../entities/answer.entity';
import { User } from 'src/modules/users/entities/user.entity';

describe('AnswersController', () => {
  let controller: AnswersController;
  let answersService: AnswersService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswersController],
      providers: [
        {
          provide: AnswersService,
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

    controller = module.get<AnswersController>(AnswersController);
    answersService = module.get<AnswersService>(AnswersService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call answersService.create and return result', async () => {
      const dto: CreateAnswerDto = { content: '' } as CreateAnswerDto;
      const result: Answer = { id: 1, ...dto } as Answer;

      jest.spyOn(answersService, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(answersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call answersService.findAll and return list', async () => {
      const question_id = 1;
      const result: PaginatedResult<Answer> = {
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

      jest.spyOn(answersService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(question_id)).toBe(result);
      expect(answersService.findAll).toHaveBeenCalledWith(question_id, 1, 10);
    });
  });

  describe('findOne', () => {
    it('should call answersService.findOne and return one answer', async () => {
      const id = 1;
      const result: Answer = { id, content: 'Answer 1' } as Answer;

      jest.spyOn(answersService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(answersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call usersService.findOne and answersService.update then return updated answer', async () => {
      const id = 1;
      const question_id = 2;
      const updateDto: UpdateAnswerDto = {
        content: 'Updated content',
      } as UpdateAnswerDto;
      const req = { user: { userId: 1 } } as unknown as Request;
      const currentUser: User = { id: 1 } as User;
      const result: Answer = { id, question_id, ...updateDto } as Answer;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(currentUser);
      jest.spyOn(answersService, 'update').mockResolvedValue(result);

      expect(await controller.update(id, question_id, updateDto, req)).toBe(
        result,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(answersService.update).toHaveBeenCalledWith(
        id,
        question_id,
        updateDto,
        currentUser,
      );
    });
  });

  describe('remove', () => {
    it('should call usersService.findOne and answersService.remove then return result', async () => {
      const id = 1;
      const req = { user: { userId: 123 } } as unknown as Request;
      const currentUser: User = { id: 1 } as User;
      const result: Answer = { id } as Answer;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(currentUser);
      jest.spyOn(answersService, 'remove').mockResolvedValue(result);

      expect(await controller.remove(id, req)).toBe(result);
      expect(usersService.findOne).toHaveBeenCalledWith(123);
      expect(answersService.remove).toHaveBeenCalledWith(id, currentUser);
    });
  });
});

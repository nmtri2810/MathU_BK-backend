import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from '../votes.service';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from 'src/modules/users/users.service';
import { QuestionsService } from 'src/modules/questions/questions.service';
import { AnswersService } from 'src/modules/answers/answers.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenException } from '@nestjs/common';
import { Vote } from '../entities/vote.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Action } from 'src/constants/enum';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { FullQuestion } from 'src/modules/questions/entities/question.entity';
import { Answer } from 'src/modules/answers/entities/answer.entity';

describe('VotesService', () => {
  let service: VotesService;
  let prisma: PrismaService;
  let usersService: UsersService;
  let questionsService: QuestionsService;
  let answersService: AnswersService;
  let caslAbility: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            votes: {
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
            },
            users: {
              update: jest.fn(),
            },
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: QuestionsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AnswersService,
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

    service = module.get<VotesService>(VotesService);
    prisma = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    questionsService = module.get<QuestionsService>(QuestionsService);
    answersService = module.get<AnswersService>(AnswersService);
    caslAbility = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  describe('create', () => {
    it('should create vote and update user reputation when user exists and target is question', async () => {
      const createVoteDto: CreateVoteDto = {
        user_id: 1,
        question_id: 10,
        is_upvoted: true,
      } as CreateVoteDto;
      const likedEntity: FullQuestion = { id: 1 } as FullQuestion;
      const createdVote: Vote = { id: 1, ...createVoteDto } as Vote;

      jest.spyOn(usersService, 'findOne').mockResolvedValue({ id: 1 } as User);
      jest.spyOn(questionsService, 'findOne').mockResolvedValue(likedEntity);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          users: {
            update: jest.fn().mockResolvedValue(null),
          },
          votes: {
            create: jest.fn().mockResolvedValue(createdVote),
          },
        }),
      );

      const result = await service.create(createVoteDto);

      expect(result).toEqual(createdVote);
      expect(usersService.findOne).toHaveBeenCalledWith(createVoteDto.user_id);
      expect(questionsService.findOne).toHaveBeenCalledWith(
        createVoteDto.question_id,
      );
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should create vote and update user reputation when target is answer', async () => {
      const createVoteDto: CreateVoteDto = {
        user_id: 1,
        is_upvoted: false,
        answer_id: 1,
      } as CreateVoteDto;
      const likedEntity: Answer = { id: 1 } as Answer;
      const createdVote: Vote = { id: 1, ...createVoteDto } as Vote;

      jest.spyOn(usersService, 'findOne').mockResolvedValue({ id: 1 } as User);
      jest.spyOn(answersService, 'findOne').mockResolvedValue(likedEntity);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          users: {
            update: jest.fn().mockResolvedValue(null),
          },
          votes: {
            create: jest.fn().mockResolvedValue(createdVote),
          },
        }),
      );

      const result = await service.create(createVoteDto);

      expect(result).toEqual(createdVote);
    });

    it('should throw ForbiddenException if user votes own entity', async () => {
      const createVoteDto: CreateVoteDto = {
        user_id: 1,
        question_id: 10,
        is_upvoted: true,
        answer_id: 1,
      };
      const likedEntity: FullQuestion = { id: 1, user_id: 1 } as FullQuestion;

      jest.spyOn(usersService, 'findOne').mockResolvedValue({ id: 1 } as User);
      jest.spyOn(questionsService, 'findOne').mockResolvedValue(likedEntity);

      await expect(service.create(createVoteDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all votes', async () => {
      const votes: Vote[] = [{ id: 1 }, { id: 2 }] as Vote[];
      jest.spyOn(prisma.votes, 'findMany').mockResolvedValue(votes);

      const result = await service.findAll();

      expect(result).toEqual(votes);
      expect(prisma.votes.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return vote by id', async () => {
      const vote: Vote = { id: 1 } as Vote;
      jest.spyOn(prisma.votes, 'findUniqueOrThrow').mockResolvedValue(vote);

      const result = await service.findOne(1);

      expect(result).toEqual(vote);
      expect(prisma.votes.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update vote and update user reputation when vote is for question', async () => {
      const id = 1;
      const updateDto = { is_upvoted: true };
      const currentUser: User = { id: 1 } as User;
      const voteToUpdate: Vote = {
        id,
        is_upvoted: false,
        question_id: 10,
      } as Vote;
      const likedEntity: FullQuestion = { id: 10, user_id: 2 } as FullQuestion;
      const updatedVote: Vote = { id, ...updateDto } as Vote;

      jest.spyOn(service, 'findOne').mockResolvedValue(voteToUpdate);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          users: {
            update: jest.fn().mockResolvedValue(null),
          },
          votes: {
            update: jest.fn().mockResolvedValue(updatedVote),
          },
        }),
      );
      jest.spyOn(questionsService, 'findOne').mockResolvedValue(likedEntity);

      const result = await service.update(id, updateDto, currentUser);

      expect(result).toEqual(updatedVote);
      expect(caslAbility.isSubjectForbidden).toHaveBeenCalledWith(
        currentUser,
        Action.Update,
        Vote,
        voteToUpdate,
      );
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(questionsService.findOne).toHaveBeenCalledWith(
        voteToUpdate.question_id,
      );
    });

    it('should update vote and update user reputation when vote is for answer', async () => {
      const id = 1;
      const updateDto = { is_upvoted: true };
      const currentUser: User = { id: 1 } as User;
      const voteToUpdate: Vote = {
        id,
        is_upvoted: true,
        answer_id: 5,
      } as Vote;
      const likedEntity: Answer = { id: 5, user_id: 2 } as Answer;
      const updatedVote: Vote = { id, ...updateDto } as Vote;

      jest.spyOn(service, 'findOne').mockResolvedValue(voteToUpdate);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          users: {
            update: jest.fn().mockResolvedValue(null),
          },
          votes: {
            update: jest.fn().mockResolvedValue(updatedVote),
          },
        }),
      );
      jest.spyOn(answersService, 'findOne').mockResolvedValue(likedEntity);

      const result = await service.update(id, updateDto, currentUser);

      expect(result).toEqual(updatedVote);
    });
  });

  describe('remove', () => {
    it('should delete vote and update user reputation for question vote', async () => {
      const id = 1;
      const currentUser: User = { id: 1 } as User;
      const voteToDelete: Vote = {
        id,
        is_upvoted: true,
        question_id: 10,
      } as Vote;
      const likedEntity: FullQuestion = { id: 10, user_id: 2 } as FullQuestion;

      jest.spyOn(service, 'findOne').mockResolvedValue(voteToDelete);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          users: {
            update: jest.fn().mockResolvedValue(null),
          },
          votes: {
            delete: jest.fn().mockResolvedValue(voteToDelete),
          },
        }),
      );
      jest.spyOn(questionsService, 'findOne').mockResolvedValue(likedEntity);

      const result = await service.remove(id, currentUser);

      expect(result).toEqual(voteToDelete);
      expect(caslAbility.isSubjectForbidden).toHaveBeenCalledWith(
        currentUser,
        Action.Delete,
        Vote,
        voteToDelete,
      );
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(questionsService.findOne).toHaveBeenCalledWith(
        voteToDelete.question_id,
      );
    });

    it('should delete vote and update user reputation for answer vote', async () => {
      const id = 1;
      const currentUser: User = { id: 1 } as User;
      const voteToDelete: Vote = {
        id,
        is_upvoted: false,
        answer_id: 5,
      } as Vote;
      const likedEntity: Answer = { id: 5, user_id: 2 } as Answer;

      jest.spyOn(service, 'findOne').mockResolvedValue(voteToDelete);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          users: {
            update: jest.fn().mockResolvedValue(null),
          },
          votes: {
            delete: jest.fn().mockResolvedValue(voteToDelete),
          },
        }),
      );
      jest.spyOn(answersService, 'findOne').mockResolvedValue(likedEntity);

      const result = await service.remove(id, currentUser);

      expect(result).toEqual(voteToDelete);
    });
  });
});

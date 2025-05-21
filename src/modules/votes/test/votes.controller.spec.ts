import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from '../votes.controller';
import { VotesService } from '../votes.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { UpdateVoteDto } from '../dto/update-vote.dto';
import { Vote } from '../entities/vote.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';

describe('VotesController', () => {
  let controller: VotesController;
  let votesService: VotesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [
        {
          provide: VotesService,
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

    controller = module.get<VotesController>(VotesController);
    votesService = module.get<VotesService>(VotesService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call votesService.create and return result', async () => {
      const dto: CreateVoteDto = { user_id: 1 } as CreateVoteDto;
      const result: Vote = { id: 1, ...dto } as Vote;

      jest.spyOn(votesService, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(votesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call votesService.findAll and return list', async () => {
      const result: Vote[] = [{ id: 1 }, { id: 2 }] as Vote[];

      jest.spyOn(votesService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(votesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call votesService.findOne and return one vote', async () => {
      const id = 1;
      const result: Vote = { id } as Vote;

      jest.spyOn(votesService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toEqual(result);
      expect(votesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call usersService.findOne and votesService.update then return updated vote', async () => {
      const id = 1;
      const updateDto: UpdateVoteDto = { is_upvoted: true };
      const req = { user: { userId: 123 } } as unknown as Request;
      const currentUser: User = { id: 123 } as User;
      const result: Vote = { id } as Vote;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(currentUser);
      jest.spyOn(votesService, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateDto, req)).toEqual(result);
      expect(usersService.findOne).toHaveBeenCalledWith(123);
      expect(votesService.update).toHaveBeenCalledWith(
        id,
        updateDto,
        currentUser,
      );
    });
  });

  describe('remove', () => {
    it('should call usersService.findOne and votesService.remove then return removed vote', async () => {
      const id = 1;
      const req = { user: { userId: 456 } } as unknown as Request;
      const currentUser: User = { id: 456 } as User;
      const result: Vote = { id } as Vote;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(currentUser);
      jest.spyOn(votesService, 'remove').mockResolvedValue(result);

      expect(await controller.remove(id, req)).toEqual(result);
      expect(usersService.findOne).toHaveBeenCalledWith(456);
      expect(votesService.remove).toHaveBeenCalledWith(id, currentUser);
    });
  });
});

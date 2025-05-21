import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AbilitiesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call service.create and return new User instance', async () => {
      const dto: CreateUserDto = {
        email: 'test@gmail.com',
        username: 'test',
        password: 'password',
      };
      const result: User = { id: 1, ...dto } as User;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return list of Users', async () => {
      const users: User[] = [
        { id: 1, username: 'user1' } as User,
        { id: 2, username: 'user2' } as User,
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return User', async () => {
      const id = 1;
      const user: User = { id, username: 'user1' } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      expect(await controller.findOne(id)).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call service.update and return updated User', async () => {
      const id = 1;
      const dto: UpdateUserDto = {
        username: 'updatedUser',
        reputation: 10,
      };
      const req = { user: { userId: 99 } } as unknown as Request;
      const updatedUser: User = { id, ...dto } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedUser);
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      expect(await controller.update(id, dto, req)).toEqual(updatedUser);
      expect(service.findOne).toHaveBeenCalledWith(99);
      expect(service.update).toHaveBeenCalledWith(id, dto, updatedUser);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return removed User', async () => {
      const id = 1;
      const removedUser: User = { id, username: 'user1' } as User;

      jest.spyOn(service, 'remove').mockResolvedValue(removedUser);

      expect(await controller.remove(id)).toEqual(removedUser);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

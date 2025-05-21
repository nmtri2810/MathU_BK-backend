import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from 'nestjs-prisma';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let caslAbility: CaslAbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
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

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    caslAbility = module.get<CaslAbilityFactory>(CaslAbilityFactory);

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'plainpassword',
      };
      const createdUser: User = {
        id: 1,
        email: dto.email,
        username: dto.username,
        password: 'hashed-plainpassword',
      } as User;
      jest.spyOn(prisma.users, 'create').mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(result).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 'salt');
    });
  });

  describe('findAll', () => {
    it('should return all users ordered by created_at desc', async () => {
      const users: User[] = [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
      ] as User[];
      jest.spyOn(prisma.users, 'findMany').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const user: User = { id: 1, username: 'user1' } as User;
      jest.spyOn(prisma.users, 'findUniqueOrThrow').mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmail', () => {
    it('should return user by email', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        username: 'user1',
      } as User;
      jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(user);

      const result = await service.findOneByEmail('test@example.com');

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update user and hash password if provided', async () => {
      const id = 1;
      const currentUser: User = { id: 99 } as User;
      const updateDto: UpdateUserDto = {
        username: 'updatedUser',
        password: 'newpassword',
      } as UpdateUserDto;
      const updatedUser: User = { id, username: 'updatedUser' } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedUser);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      jest.spyOn(prisma.users, 'update').mockResolvedValue(updatedUser);

      const result = await service.update(id, updateDto, currentUser);

      expect(result).toEqual(updatedUser);
    });

    it('should update user without hashing if password not provided', async () => {
      const id = 1;
      const currentUser: User = { id: 99 } as User;
      const updateDto: UpdateUserDto = {
        username: 'updatedUser',
      } as UpdateUserDto;
      const updatedUser: User = { id, username: 'updatedUser' } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedUser);
      jest
        .spyOn(caslAbility, 'isSubjectForbidden')
        .mockResolvedValue(undefined);
      jest.spyOn(prisma.users, 'update').mockResolvedValue(updatedUser);

      const result = await service.update(id, updateDto, currentUser);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete and return user', async () => {
      const user: User = { id: 1, username: 'user1' } as User;
      jest.spyOn(prisma.users, 'delete').mockResolvedValue(user);

      const result = await service.remove(1);

      expect(result).toEqual(user);
    });
  });

  describe('updateRefreshTokenInDB', () => {
    it('should hash refresh token and update in DB', async () => {
      const userId = 1;
      const refreshToken = 'refreshTokenValue';
      const hashedToken = 'hashedRefreshToken';

      jest.spyOn(service, 'hashData').mockResolvedValue(hashedToken);
      jest
        .spyOn(prisma.users, 'update')
        .mockResolvedValue({ id: userId } as User);

      const result = await service.updateRefreshTokenInDB(userId, refreshToken);

      expect(result).toEqual({ id: userId });
    });

    it('should update DB with null if refresh token is falsy', async () => {
      const userId = 1;
      jest
        .spyOn(prisma.users, 'update')
        .mockResolvedValue({ id: userId } as User);

      const result = await service.updateRefreshTokenInDB(userId, '');

      expect(result).toEqual({ id: userId });
    });
  });
});

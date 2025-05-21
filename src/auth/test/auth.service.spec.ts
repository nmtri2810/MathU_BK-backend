import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { User } from 'src/modules/users/entities/user.entity';
import { Messages } from 'src/constants';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    refresh_token: 'hashedrefreshtoken',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            updateRefreshTokenInDB: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        service.login('test@example.com', 'password'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if password is invalid', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user and tokens if login successful', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login('test@example.com', 'password');

      expect(result.tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('register', () => {
    it('should throw if email already exists', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: mockUser.email,
          password: '123',
          username: 'test',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create user and return tokens', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await service.register({
        email: mockUser.email,
        password: '123',
        username: 'test',
      });

      expect(result.tokens).toEqual({
        accessToken: 'mocked-token',
        refreshToken: 'mocked-token',
      });
      expect(usersService.updateRefreshTokenInDB).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      await service.logout(mockUser.id);

      expect(usersService.updateRefreshTokenInDB).toHaveBeenCalledWith(
        mockUser.id,
        null,
      );
    });
  });

  describe('refresh', () => {
    it('should throw if user has no refresh token', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue({ ...mockUser, refresh_token: null });

      await expect(service.refresh(mockUser.id, 'token')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw if refresh token is invalid', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue({ ...mockUser, refresh_token: 'xxxxxxxxx' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refresh(mockUser.id, 'wrongtoken')).rejects.toThrow(
        new ForbiddenException(Messages.ACCESS_DENIED),
      );
    });

    it('should return new tokens if refresh token matches', async () => {
      const userWithToken = {
        ...mockUser,
        refresh_token: 'hashedrefreshtoken',
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userWithToken);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.refresh(mockUser.id, 'token');

      expect(result).toEqual({
        accessToken: 'mocked-token',
        refreshToken: 'mocked-token',
      });

      expect(usersService.updateRefreshTokenInDB).toHaveBeenCalledWith(
        mockUser.id,
        'mocked-token',
      );
    });
  });

  describe('loginGoogle', () => {
    const googleUser = {
      email: 'google@example.com',
      name: 'Google User',
    } as any;

    it('should register a new user if Google user not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await service.loginGoogle(googleUser);
      expect(result.tokens).toBeDefined();
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should login if Google user exists', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginGoogle(googleUser);
      expect(result.tokens).toBeDefined();
    });
  });
});

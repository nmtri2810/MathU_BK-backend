import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      getToken: jest
        .fn()
        .mockResolvedValue({ tokens: { id_token: 'fake_id_token' } }),
      setCredentials: jest.fn(),
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: jest
          .fn()
          .mockReturnValue({ email: 'test@example.com', name: 'Test User' }),
      }),
    })),
    UserRefreshClient: jest.fn().mockImplementation(() => ({
      refreshAccessToken: jest.fn().mockResolvedValue({
        credentials: {
          access_token: 'new_access_token',
          expiry_date: Date.now() + 3600000,
        },
      }),
    })),
  };
});

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
    loginGoogle: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should call authService.login with correct params', async () => {
      const dto: LoginDto = { email: 'test@gmail.com', password: 'Aa@123456' };
      const result = { accessToken: 'token' };
      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(dto)).toBe(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
    });
  });

  describe('register', () => {
    it('should call authService.register with correct params', async () => {
      const dto: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'Aa@123456',
        username: 'test',
      };
      const result = { user: 'created' };
      mockAuthService.register.mockResolvedValue(result);

      expect(await authController.register(dto)).toBe(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with userId', async () => {
      const req: any = { user: { userId: '123' } };
      const result = { message: 'logged out' };
      mockAuthService.logout.mockResolvedValue(result);

      expect(await authController.logout(req)).toBe(result);
      expect(mockAuthService.logout).toHaveBeenCalledWith('123');
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh with userId and refreshToken', async () => {
      const req: any = { user: { userId: '123', refreshToken: 'ref-token' } };
      const result = { accessToken: 'new-token' };
      mockAuthService.refresh.mockResolvedValue(result);

      expect(await authController.refresh(req)).toBe(result);
      expect(mockAuthService.refresh).toHaveBeenCalledWith('123', 'ref-token');
    });
  });

  describe('loginGoogle', () => {
    it('should login user with Google OAuth', async () => {
      const code = 'test-code';
      const fakeUser = { email: 'test@example.com', name: 'Test User' };
      mockAuthService.loginGoogle.mockResolvedValue('logged-in-user');

      const result = await authController.loginGoogle(code);

      expect(mockAuthService.loginGoogle).toHaveBeenCalledWith(fakeUser);
      expect(result).toBe('logged-in-user');
    });
  });

  describe('loginGoogleRefreshToken', () => {
    it('should refresh Google token', async () => {
      const req: any = {
        body: {
          refreshToken: 'test-refresh-token',
        },
      };
      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      await authController.loginGoogleRefreshToken(req);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('src_auth_auth.controller.ts#109: '),
        expect.objectContaining({
          access_token: 'new_access_token',
        }),
      );

      logSpy.mockRestore();
    });
  });
});

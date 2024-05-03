import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth, Tokens } from './entity/auth.entity';
import { ResponseMessages } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<Auth> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException(ResponseMessages.INVALID_PASSWORD);

    const tokens = await this.getTokens(user.id);

    await this.usersService.updateRefreshTokenInDB(
      user.id,
      tokens.refreshToken,
    );

    delete user.password;
    delete user.refresh_token;

    return {
      user,
      tokens,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<Auth> {
    const userExists = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (userExists)
      throw new BadRequestException(ResponseMessages.USER_ALREADY_EXIST);

    const user = await this.usersService.create(createUserDto);

    const tokens = await this.getTokens(user.id);

    await this.usersService.updateRefreshTokenInDB(
      user.id,
      tokens.refreshToken,
    );

    delete user.password;
    delete user.refresh_token;

    return {
      user,
      tokens,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.updateRefreshTokenInDB(userId, null);
  }

  async refresh(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOne(userId);
    if (!user.refresh_token)
      throw new ForbiddenException(ResponseMessages.ACCESS_DENIED);

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException(ResponseMessages.ACCESS_DENIED);

    const tokens = await this.getTokens(user.id);

    await this.usersService.updateRefreshTokenInDB(
      user.id,
      tokens.refreshToken,
    );

    return tokens;
  }

  async getTokens(userId: number): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('auth.jwt_access.secret'),
          expiresIn: this.configService.get<string>('auth.jwt_access.expired'),
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('auth.jwt_refresh.secret'),
          expiresIn: this.configService.get<string>('auth.jwt_refresh.expired'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

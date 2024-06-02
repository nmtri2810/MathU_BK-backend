import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth, Tokens } from './entity/auth.entity';
import { DynamicMessage, Messages } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { TokenPayload } from 'google-auth-library';
import { faker } from '@faker-js/faker';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<Auth> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException(DynamicMessage.notFound('User'));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException(DynamicMessage.invalid('password'));

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
      throw new BadRequestException(DynamicMessage.duplicate('User'));

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
      throw new ForbiddenException(Messages.ACCESS_DENIED);

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException(Messages.ACCESS_DENIED);

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
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRED,
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRED,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginGoogle(user: TokenPayload) {
    const userExists = await this.usersService.findOneByEmail(user.email);
    const password = `${user.email}_${user.name}`;

    if (!userExists) {
      const randomUsername = faker.internet.userName({
        firstName: user.email,
        lastName: String(Math.floor(10000000 + Math.random() * 90000000)),
      });

      const createUserDto: CreateUserDto = {
        email: user.email,
        password,
        username: randomUsername,
        reputation: 0,
      };

      return this.register(createUserDto);
    }

    return this.login(user.email, password);
  }
}

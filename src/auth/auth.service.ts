import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from './entity/auth.entity';
import { PrismaService } from 'nestjs-prisma';
import { ResponseMessages } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<Auth> {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException(ResponseMessages.INVALID_PASSWORD);

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register() {}
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { ResponseMessages } from 'src/common/messages/response-messages';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { PrismaClientErrorCode } from 'src/common/constants/prisma-client-error-code';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await this.hashPassword(createUserDto.password);
      return await this.prisma.users.create({ data: createUserDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.CONFLICT
      ) {
        throw new ConflictException(ResponseMessages.EMAIL_DUPLICATED);
      }
    }
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.users.findMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashPassword(
          updateUserDto.password,
        );
      }

      return await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const errorCode = error.code;
        if (errorCode === PrismaClientErrorCode.NOT_FOUND) {
          throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);
        } else if (errorCode === PrismaClientErrorCode.CONFLICT) {
          throw new ConflictException(ResponseMessages.EMAIL_DUPLICATED);
        }
      }
    }
  }

  async remove(id: number): Promise<User> {
    try {
      return await this.prisma.users.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.NOT_FOUND
      ) {
        throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);
      }
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('auth.bcrypt.saltRounds');
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { ResponseMessages } from 'src/common/messages/response-messages';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { PrismaClientErrorCode } from 'src/common/constants/prisma-client-error-code';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.users.create({ data: createUserDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.CONFLICT
      ) {
        throw new HttpException(
          ResponseMessages.EMAIL_DUPLICATED,
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.users.findMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user)
      throw new HttpException(
        ResponseMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.NOT_FOUND
      ) {
        throw new HttpException(
          ResponseMessages.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.users.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.NOT_FOUND
      ) {
        throw new HttpException(
          ResponseMessages.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }
}

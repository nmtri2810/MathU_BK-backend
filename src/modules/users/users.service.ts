import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseMessages } from 'src/common/messages/response-messages';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.users.create({ data: createUserDto });
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });

    if (!user) throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);

    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.users.delete({ where: { id } });

    if (!user) throw new NotFoundException(ResponseMessages.USER_NOT_FOUND);

    return user;
  }
}

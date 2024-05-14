import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hashData(createUserDto.password);

    return await this.prisma.users.create({
      data: createUserDto,
      include: { role: true },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.users.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      include: { role: true },
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.users.findUniqueOrThrow({
      where: { id },
      include: { role: true },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.prisma.users.findUniqueOrThrow({
      where: { email },
      include: { role: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashData(updateUserDto.password);
    }

    return await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      include: { role: true },
    });
  }

  async remove(id: number): Promise<User> {
    return await this.prisma.users.delete({
      where: { id },
      include: { role: true },
    });
  }

  async hashData(data: string): Promise<string> {
    const saltRounds = this.configService.get<number>('auth.bcrypt.saltRounds');
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(data, salt);
  }

  async updateRefreshTokenInDB(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    let hashedRefreshToken: string;
    if (refreshToken) {
      hashedRefreshToken = await this.hashData(refreshToken);
    }

    return await this.prisma.users.update({
      where: { id: userId },
      data: { refresh_token: hashedRefreshToken },
    });
  }
}

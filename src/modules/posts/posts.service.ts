import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { PrismaClientErrorCode, DynamicMessage } from 'src/constants';
import { Post } from './entities/post.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const user = await this.usersService.findOne(createPostDto.user_id);

      if (user)
        return await this.prisma.posts.create({
          data: createPostDto,
        });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(DynamicMessage.notFound('User'));
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.CONFLICT
      ) {
        throw new ConflictException(DynamicMessage.duplicate('Title'));
      }
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.posts.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.prisma.posts.findUnique({
      where: { id },
    });

    if (!post) throw new NotFoundException(DynamicMessage.notFound('Post'));

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      return await this.prisma.posts.update({
        where: { id },
        data: updatePostDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const errorCode = error.code;
        if (errorCode === PrismaClientErrorCode.NOT_FOUND) {
          throw new NotFoundException(DynamicMessage.notFound('Post'));
        } else if (errorCode === PrismaClientErrorCode.CONFLICT) {
          throw new ConflictException(DynamicMessage.duplicate('Title'));
        }
      }
    }
  }

  async remove(id: number): Promise<Post> {
    try {
      return await this.prisma.posts.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.NOT_FOUND
      ) {
        throw new NotFoundException(DynamicMessage.notFound('Post'));
      }
    }
  }
}

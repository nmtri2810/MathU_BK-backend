import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from '../users/users.service';
import { Comment } from './entities/comment.entity';
import { PostsService } from '../posts/posts.service';
import { DynamicMessage, PrismaClientErrorCode } from 'src/constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const user = await this.usersService.findOne(createCommentDto.user_id);
      const post = await this.postsService.findOne(createCommentDto.post_id);

      if (user && post)
        return await this.prisma.comments.create({
          data: createCommentDto,
        });
    } catch (error) {
      if (error instanceof NotFoundException) {
        if (error.message.includes('User')) {
          throw new NotFoundException(DynamicMessage.notFound('User'));
        } else if (error.message.includes('Post')) {
          throw new NotFoundException(DynamicMessage.notFound('Post'));
        }
      }
    }
  }

  async findAll(): Promise<Comment[]> {
    return await this.prisma.comments.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.prisma.comments.findUnique({
      where: { id },
    });

    if (!comment)
      throw new NotFoundException(DynamicMessage.notFound('Comment'));

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    try {
      return await this.prisma.comments.update({
        where: { id },
        data: updateCommentDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const errorCode = error.code;
        if (errorCode === PrismaClientErrorCode.NOT_FOUND) {
          throw new NotFoundException(DynamicMessage.notFound('Comment'));
        }
      }
    }
  }

  async remove(id: number): Promise<Comment> {
    try {
      return await this.prisma.comments.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.NOT_FOUND
      ) {
        throw new NotFoundException(DynamicMessage.notFound('Comment'));
      }
    }
  }
}

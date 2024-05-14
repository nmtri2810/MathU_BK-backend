import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from '../users/users.service';
import { Comment } from './entities/comment.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const user = await this.usersService.findOne(createCommentDto.user_id);
    const post = await this.postsService.findOne(createCommentDto.post_id);

    if (user && post)
      return await this.prisma.comments.create({
        data: createCommentDto,
      });
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
    return await this.prisma.comments.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.prisma.comments.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: number): Promise<Comment> {
    return await this.prisma.comments.delete({ where: { id } });
  }
}

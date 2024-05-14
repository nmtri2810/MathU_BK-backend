import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'nestjs-prisma';
import { Post } from './entities/post.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersService.findOne(createPostDto.user_id);

    if (user)
      return await this.prisma.posts.create({
        data: createPostDto,
      });
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
    return await this.prisma.posts.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.prisma.posts.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: number): Promise<Post> {
    return await this.prisma.posts.delete({ where: { id } });
  }
}

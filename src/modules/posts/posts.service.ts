import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'nestjs-prisma';
import { Post } from './entities/post.entity';
import { UsersService } from '../users/users.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from '../users/entities/user.entity';
import { Action } from 'src/constants/enum';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private caslAbility: CaslAbilityFactory,
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

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    currentUser: User,
  ): Promise<Post> {
    const postToUpdate = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Update,
      Post,
      postToUpdate,
    );

    return await this.prisma.posts.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: number, currentUser: User): Promise<Post> {
    const postToDelete = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Delete,
      Post,
      postToDelete,
    );

    return await this.prisma.posts.delete({ where: { id } });
  }
}

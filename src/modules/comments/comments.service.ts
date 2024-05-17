import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from '../users/users.service';
import { Comment } from './entities/comment.entity';
import { PostsService } from '../posts/posts.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from '../users/entities/user.entity';
import { Action } from 'src/constants/enum';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private postsService: PostsService,
    private caslAbility: CaslAbilityFactory,
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
    currentUser: User,
  ): Promise<Comment> {
    const commentToUpdate = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Update,
      Comment,
      commentToUpdate,
    );

    return await this.prisma.comments.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: number, currentUser: User): Promise<Comment> {
    const commentToDelete = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Delete,
      Comment,
      commentToDelete,
    );

    return await this.prisma.comments.delete({ where: { id } });
  }
}

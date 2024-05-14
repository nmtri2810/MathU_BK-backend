import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';
import { DynamicMessage, PrismaClientErrorCode } from 'src/constants';
import { Vote } from './entities/vote.entity';
import { LikeableTypes, Prisma } from '@prisma/client';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class VotesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    try {
      const userExist = await this.usersService.findOne(createVoteDto.user_id);

      if (userExist) {
        let likeableItem: Post | Comment;

        if (createVoteDto.likeable_type === LikeableTypes.POST) {
          likeableItem = await this.postsService.findOne(
            createVoteDto.likeable_id,
          );
        } else if (createVoteDto.likeable_type === LikeableTypes.COMMENT) {
          likeableItem = await this.commentsService.findOne(
            createVoteDto.likeable_id,
          );
        } else {
          throw new NotFoundException();
        }

        if (likeableItem)
          return await this.prisma.votes.create({ data: createVoteDto });
      }
    } catch (error) {
      console.log('src_modules_votes_votes.service.ts#50: ', error);
      if (error instanceof NotFoundException) {
        if (error.message.includes('User')) {
          throw new NotFoundException(DynamicMessage.notFound('User'));
        } else if (error.message.includes('Post')) {
          throw new NotFoundException(DynamicMessage.notFound('Post'));
        } else if (error.message.includes('Comment')) {
          throw new NotFoundException(DynamicMessage.notFound('Comment'));
        } else {
          throw new NotFoundException(DynamicMessage.notFound('Type'));
        }
      } else if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.CONFLICT
      ) {
        throw new ConflictException(DynamicMessage.invalid('vote action'));
      } else {
        throw error;
      }
    }
  }

  async findAll(): Promise<Vote[]> {
    return await this.prisma.votes.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });
  }

  async findOne(id: number): Promise<Vote> {
    const vote = await this.prisma.votes.findUnique({
      where: { id },
    });

    if (!vote) throw new NotFoundException(DynamicMessage.notFound('Vote'));

    return vote;
  }

  async update(id: number, updateVoteDto: UpdateVoteDto): Promise<Vote> {
    try {
      return await this.prisma.votes.update({
        where: { id },
        data: updateVoteDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const errorCode = error.code;
        if (errorCode === PrismaClientErrorCode.NOT_FOUND) {
          throw new NotFoundException(DynamicMessage.notFound('Vote'));
        }
      }
    }
  }

  async remove(id: number): Promise<Vote> {
    try {
      return await this.prisma.votes.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaClientErrorCode.NOT_FOUND
      ) {
        throw new NotFoundException(DynamicMessage.notFound('Vote'));
      }
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';
import { DynamicMessage } from 'src/constants';
import { Vote } from './entities/vote.entity';
import { VoteableTypes } from '@prisma/client';

@Injectable()
export class VotesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    const userExist = await this.usersService.findOne(createVoteDto.user_id);

    if (userExist) {
      const service = await this.getServiceByTypes(createVoteDto.voteable_type);

      const likedItem = await service.findOne(createVoteDto.voteable_id);

      if (likedItem)
        return await this.prisma.votes.create({ data: createVoteDto });
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
    return await this.prisma.votes.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateVoteDto: UpdateVoteDto): Promise<Vote> {
    return await this.prisma.votes.update({
      where: { id },
      data: updateVoteDto,
    });
  }

  async remove(id: number): Promise<Vote> {
    return await this.prisma.votes.delete({ where: { id } });
  }

  async getServiceByTypes(type: string) {
    const servicesMap = {
      [VoteableTypes.POST]: this.postsService,
      [VoteableTypes.COMMENT]: this.commentsService,
    };

    if (!servicesMap[type])
      throw new NotFoundException(DynamicMessage.notFound('Type'));

    return servicesMap[type];
  }
}

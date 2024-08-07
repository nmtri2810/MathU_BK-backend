import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from '../users/users.service';
import { QuestionsService } from '../questions/questions.service';
import { AnswersService } from '../answers/answers.service';
import { Vote } from './entities/vote.entity';
import { User } from '../users/entities/user.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/constants/enum';
import { Messages, ReputationPoints } from 'src/constants';

@Injectable()
export class VotesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private caslAbility: CaslAbilityFactory,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    const userExist = await this.usersService.findOne(createVoteDto.user_id);

    if (userExist) {
      const { question_id, answer_id } = createVoteDto;
      const likedEntity = question_id
        ? await this.questionsService.findOne(question_id)
        : await this.answersService.findOne(answer_id);

      if (likedEntity.user_id === createVoteDto.user_id) {
        throw new ForbiddenException(Messages.NOT_ALLOWED);
      }

      return await this.prisma.$transaction(async (tx) => {
        await tx.users.update({
          data: {
            reputation: createVoteDto.is_upvoted
              ? { increment: ReputationPoints.QUES_ANS_UPVOTE }
              : { decrement: ReputationPoints.QUES_ANS_DOWNVOTE },
          },
          where: { id: likedEntity.user_id },
        });

        return await tx.votes.create({ data: createVoteDto });
      });
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

  async update(
    id: number,
    updateVoteDto: UpdateVoteDto,
    currentUser: User,
  ): Promise<Vote> {
    const voteToUpdate = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Update,
      Vote,
      voteToUpdate,
    );

    return await this.prisma.$transaction(async (tx) => {
      const { question_id, answer_id } = voteToUpdate;
      const likedEntity = question_id
        ? await this.questionsService.findOne(question_id)
        : await this.answersService.findOne(answer_id);

      await tx.users.update({
        data: {
          reputation: voteToUpdate.is_upvoted
            ? { decrement: ReputationPoints.QUES_ANS_UPDATED }
            : { increment: ReputationPoints.QUES_ANS_UPDATED },
        },
        where: { id: likedEntity.user_id },
      });

      return await tx.votes.update({
        where: { id },
        data: updateVoteDto,
      });
    });
  }

  async remove(id: number, currentUser: User): Promise<Vote> {
    const voteToDelete = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Delete,
      Vote,
      voteToDelete,
    );

    return await this.prisma.$transaction(async (tx) => {
      const { question_id, answer_id } = voteToDelete;
      const likedEntity = question_id
        ? await this.questionsService.findOne(question_id)
        : await this.answersService.findOne(answer_id);

      await tx.users.update({
        data: {
          reputation: voteToDelete.is_upvoted
            ? { decrement: ReputationPoints.QUES_ANS_UPVOTE }
            : { increment: ReputationPoints.QUES_ANS_DOWNVOTE },
        },
        where: { id: likedEntity.user_id },
      });

      return await tx.votes.delete({ where: { id } });
    });
  }
}

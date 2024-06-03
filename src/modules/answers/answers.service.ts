import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from '../users/users.service';
import { Answer } from './entities/answer.entity';
import { QuestionsService } from '../questions/questions.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from '../users/entities/user.entity';
import { Action } from 'src/constants/enum';
import { Messages } from 'src/constants';

@Injectable()
export class AnswersService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private questionsService: QuestionsService,
    private caslAbility: CaslAbilityFactory,
  ) {}

  async create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    const user = await this.usersService.findOne(createAnswerDto.user_id);
    const question = await this.questionsService.findOne(
      createAnswerDto.question_id,
    );

    if (user && question)
      return await this.prisma.answers.create({
        data: createAnswerDto,
      });
  }

  async findAll(): Promise<Answer[]> {
    return await this.prisma.answers.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });
  }

  async findOne(id: number): Promise<Answer> {
    return await this.prisma.answers.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(
    id: number,
    questionId: number,
    updateAnswerDto: UpdateAnswerDto,
    currentUser: User,
  ): Promise<Answer> {
    const answerToUpdate = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Update,
      Answer,
      answerToUpdate,
    );

    return this.prisma.$transaction(async (tx) => {
      const acceptedAnswer = await tx.answers.findFirst({
        where: {
          question_id: questionId,
          is_accepted: true,
        },
      });

      if (acceptedAnswer) {
        throw new BadRequestException(Messages.ACCEPTED_ANSWER_EXIST);
      }

      return await tx.answers.update({
        where: { id },
        data: updateAnswerDto,
      });
    });
  }

  async remove(id: number, currentUser: User): Promise<Answer> {
    const answerToDelete = await this.findOne(id);
    await this.caslAbility.isSubjectForbidden(
      currentUser,
      Action.Delete,
      Answer,
      answerToDelete,
    );

    return await this.prisma.answers.delete({ where: { id } });
  }
}

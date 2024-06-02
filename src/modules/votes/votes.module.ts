import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';
import { AnswersModule } from '../answers/answers.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [VotesController],
  providers: [VotesService],
  imports: [
    PrismaModule,
    UsersModule,
    QuestionsModule,
    AnswersModule,
    CaslModule,
  ],
})
export class VotesModule {}

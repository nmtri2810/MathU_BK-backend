import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [PrismaModule, UsersModule, QuestionsModule, CaslModule],
  exports: [AnswersService],
})
export class AnswersModule {}

import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import OpenAI from 'openai';
import { QuestionsModule } from 'src/modules/questions/questions.module';

@Module({
  providers: [
    OpenaiService,
    {
      provide: OpenAI,
      useFactory: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
  ],
  controllers: [OpenaiController],
  imports: [QuestionsModule],
})
export class OpenaiModule {}

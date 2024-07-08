import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import OpenAI from 'openai';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  providers: [
    OpenaiService,
    {
      provide: OpenAI,
      useFactory: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
  ],
  controllers: [OpenaiController],
  imports: [PrismaModule],
})
export class OpenaiModule {}

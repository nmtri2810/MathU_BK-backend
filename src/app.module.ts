import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/environments/configuration';
import { LoggerMiddleware } from './config/logger/logger.middleware';
import { LoggerModule } from './config/logger/logger.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { VotesModule } from './modules/votes/votes.module';
import { TagsModule } from './modules/tags/tags.module';
import { CaslModule } from './casl/casl.module';
import { QuestionsTagsModule } from './modules/questions-tags/questions-tags.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration], // not use in this app
    }),
    LoggerModule,
    QuestionsModule,
    AnswersModule,
    VotesModule,
    TagsModule,
    CaslModule,
    QuestionsTagsModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

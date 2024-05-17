import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [VotesController],
  providers: [VotesService],
  imports: [PrismaModule, UsersModule, PostsModule, CommentsModule, CaslModule],
})
export class VotesModule {}

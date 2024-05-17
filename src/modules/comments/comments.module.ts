import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [PrismaModule, UsersModule, PostsModule, CaslModule],
  exports: [CommentsService],
})
export class CommentsModule {}

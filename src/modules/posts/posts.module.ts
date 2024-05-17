import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, UsersModule, CaslModule],
  exports: [PostsService],
})
export class PostsModule {}

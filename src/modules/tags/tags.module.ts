import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaModule } from 'nestjs-prisma';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [PrismaModule, CaslModule, UsersModule],
})
export class TagsModule {}

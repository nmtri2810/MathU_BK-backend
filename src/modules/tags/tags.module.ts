import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [PrismaModule],
})
export class TagsModule {}

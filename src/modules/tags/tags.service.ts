import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'nestjs-prisma';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    return await this.prisma.tags.create({
      data: createTagDto,
    });
  }

  async findAll(): Promise<Tag[]> {
    return await this.prisma.tags.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });
  }

  async findOne(id: number): Promise<Tag> {
    return await this.prisma.tags.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return await this.prisma.tags.update({
      where: { id },
      data: updateTagDto,
    });
  }

  // Doesn't need to catch because of the exception filter
  async remove(id: number): Promise<Tag> {
    return await this.prisma.tags.delete({ where: { id } });
  }
}

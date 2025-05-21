import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from '../tags.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Tag } from '../entities/tag.entity';

describe('TagsService', () => {
  let service: TagsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: PrismaService,
          useValue: {
            tags: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create and return a tag', async () => {
      const dto: CreateTagDto = { name: 'tag1' } as CreateTagDto;
      const result: Tag = { id: 1, name: 'tag1' } as Tag;

      jest.spyOn(prisma.tags, 'create').mockResolvedValue(result);

      expect(await service.create(dto)).toBe(result);
      expect(prisma.tags.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('should return all tags ordered by created_at desc', async () => {
      const result: Tag[] = [
        { id: 1, name: 'tag1' } as Tag,
        { id: 2, name: 'tag2' } as Tag,
      ];

      jest.spyOn(prisma.tags, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(prisma.tags.findMany).toHaveBeenCalledWith({
        orderBy: [{ created_at: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      const id = 1;
      const result: Tag = { id, name: 'tag1' } as Tag;

      jest.spyOn(prisma.tags, 'findUniqueOrThrow').mockResolvedValue(result);

      expect(await service.findOne(id)).toBe(result);
      expect(prisma.tags.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('update', () => {
    it('should update and return the tag', async () => {
      const id = 1;
      const dto: UpdateTagDto = { name: 'updatedTag' };
      const result: Tag = { id, name: 'updatedTag' } as Tag;

      jest.spyOn(prisma.tags, 'update').mockResolvedValue(result);

      expect(await service.update(id, dto)).toBe(result);
      expect(prisma.tags.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should delete and return the tag', async () => {
      const id = 1;
      const result: Tag = { id, name: 'tag1' } as Tag;

      jest.spyOn(prisma.tags, 'delete').mockResolvedValue(result);

      expect(await service.remove(id)).toBe(result);
      expect(prisma.tags.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from '../tags.controller';
import { TagsService } from '../tags.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Tag } from '../entities/tag.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AbilitiesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  describe('create', () => {
    it('should call service.create and return created tag', async () => {
      const dto: CreateTagDto = { name: 'tag1' } as CreateTagDto;
      const result: Tag = { id: 1, name: 'tag1' } as Tag;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return tag list', async () => {
      const result: Tag[] = [
        { id: 1, name: 'tag1' } as Tag,
        { id: 2, name: 'tag2' } as Tag,
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return a tag', async () => {
      const id = 1;
      const result: Tag = { id, name: 'tag1' } as Tag;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call service.update and return updated tag', async () => {
      const id = 1;
      const dto: UpdateTagDto = { name: 'updatedTag' } as UpdateTagDto;
      const result: Tag = { id, name: 'updatedTag' } as Tag;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return removed tag', async () => {
      const id = 1;
      const result: Tag = { id, name: 'tag1' } as Tag;

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(id)).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { DynamicMessage } from 'src/constants';
import { Tag } from './entities/tag.entity';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int.pipe';

@Controller('tags')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('tag'))
  @ApiBody({
    type: CreateTagDto,
  })
  @ApiCreatedResponse({
    type: Tag,
    description: DynamicMessage.CRUD.createSuccess('tag'),
  })
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagsService.create(createTagDto);
  }

  @Get()
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('tag list'))
  @ApiOkResponse({
    type: Tag,
    isArray: true,
    description: DynamicMessage.CRUD.getSuccess('tag list'),
  })
  async findAll() {
    return await this.tagsService.findAll();
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('tag'))
  @ApiOkResponse({
    type: Tag,
    description: DynamicMessage.CRUD.getSuccess('tag'),
  })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return await this.tagsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(DynamicMessage.CRUD.updateSuccess('tag'))
  @ApiBody({
    type: UpdateTagDto,
  })
  @ApiOkResponse({
    type: Tag,
    description: DynamicMessage.CRUD.updateSuccess('tag'),
  })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return await this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('tag'))
  @ApiOkResponse({
    type: Tag,
    description: DynamicMessage.CRUD.deleteSuccess('tag'),
  })
  async remove(@Param('id', CustomParseIntPipe) id: number) {
    return await this.tagsService.remove(id);
  }
}

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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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
import { Post as PostEntity } from './entities/post.entity';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int.pipe';

@Controller('posts')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('post'))
  @ApiBody({
    type: CreatePostDto,
  })
  @ApiCreatedResponse({
    type: PostEntity,
    description: DynamicMessage.CRUD.createSuccess('post'),
  })
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  @Get()
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('post list'))
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
    description: DynamicMessage.CRUD.getSuccess('post list'),
  })
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('post'))
  @ApiOkResponse({
    type: PostEntity,
    description: DynamicMessage.CRUD.getSuccess('post'),
  })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(DynamicMessage.CRUD.updateSuccess('post'))
  @ApiBody({
    type: UpdatePostDto,
  })
  @ApiOkResponse({
    type: PostEntity,
    description: DynamicMessage.CRUD.updateSuccess('post'),
  })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('post'))
  @ApiOkResponse({
    type: PostEntity,
    description: DynamicMessage.CRUD.deleteSuccess('post'),
  })
  async remove(@Param('id', CustomParseIntPipe) id: number) {
    return await this.postsService.remove(id);
  }
}

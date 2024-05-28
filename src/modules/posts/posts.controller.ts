import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
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
import { CheckAbilites } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/constants/enum';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';

@Controller('posts')
@UseGuards(AccessTokenGuard, AbilitiesGuard)
@ApiBearerAuth()
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private usersService: UsersService,
  ) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('post'))
  @ApiBody({
    type: CreatePostDto,
  })
  @ApiCreatedResponse({
    type: PostEntity,
    description: DynamicMessage.CRUD.createSuccess('post'),
  })
  @CheckAbilites({ action: Action.Create, subject: PostEntity })
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
  @CheckAbilites({ action: Action.Read, subject: PostEntity })
  async findAll(
    @Query('page', CustomParseIntPipe) page: number = 1,
    @Query('perPage', CustomParseIntPipe) perPage: number = 10,
    @Query('keyword') keyword: string = '',
  ) {
    return await this.postsService.findAll(page, perPage, keyword.trim());
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('post'))
  @ApiOkResponse({
    type: PostEntity,
    description: DynamicMessage.CRUD.getSuccess('post'),
  })
  @CheckAbilites({ action: Action.Read, subject: PostEntity })
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
  @CheckAbilites({ action: Action.Update, subject: PostEntity })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.postsService.update(id, updatePostDto, currentUser);
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('post'))
  @ApiOkResponse({
    type: PostEntity,
    description: DynamicMessage.CRUD.deleteSuccess('post'),
  })
  @CheckAbilites({ action: Action.Delete, subject: PostEntity })
  async remove(
    @Param('id', CustomParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.postsService.remove(id, currentUser);
  }
}

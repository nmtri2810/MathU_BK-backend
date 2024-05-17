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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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
import { Comment } from './entities/comment.entity';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int.pipe';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { CheckAbilites } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/constants/enum';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('comments')
@UseGuards(AccessTokenGuard, AbilitiesGuard)
@ApiBearerAuth()
@ApiTags('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private usersService: UsersService,
  ) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('comment'))
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiCreatedResponse({
    type: Comment,
    description: DynamicMessage.CRUD.createSuccess('comment'),
  })
  @CheckAbilites({ action: Action.Create, subject: Comment })
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @Get()
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('comment list'))
  @ApiOkResponse({
    type: Comment,
    isArray: true,
    description: DynamicMessage.CRUD.getSuccess('comment list'),
  })
  @CheckAbilites({ action: Action.Read, subject: Comment })
  async findAll() {
    return await this.commentsService.findAll();
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('comment'))
  @ApiOkResponse({
    type: Comment,
    description: DynamicMessage.CRUD.getSuccess('comment'),
  })
  @CheckAbilites({ action: Action.Read, subject: Comment })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return await this.commentsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(DynamicMessage.CRUD.updateSuccess('comment'))
  @ApiBody({
    type: UpdateCommentDto,
  })
  @ApiOkResponse({
    type: Comment,
    description: DynamicMessage.CRUD.updateSuccess('comment'),
  })
  @CheckAbilites({ action: Action.Update, subject: Comment })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.commentsService.update(id, updateCommentDto, currentUser);
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('comment'))
  @ApiOkResponse({
    type: Comment,
    description: DynamicMessage.CRUD.deleteSuccess('comment'),
  })
  @CheckAbilites({ action: Action.Delete, subject: Comment })
  async remove(
    @Param('id', CustomParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.commentsService.remove(id, currentUser);
  }
}

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

@Controller('comments')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('comment'))
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiCreatedResponse({
    type: Comment,
    description: DynamicMessage.CRUD.createSuccess('comment'),
  })
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
  async findAll() {
    return await this.commentsService.findAll();
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('comment'))
  @ApiOkResponse({
    type: Comment,
    description: DynamicMessage.CRUD.getSuccess('comment'),
  })
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
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('comment'))
  @ApiOkResponse({
    type: Comment,
    description: DynamicMessage.CRUD.deleteSuccess('comment'),
  })
  async remove(@Param('id', CustomParseIntPipe) id: number) {
    return await this.commentsService.remove(id);
  }
}

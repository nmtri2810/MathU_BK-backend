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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
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
import { Question } from './entities/question.entity';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int.pipe';
import { CheckAbilites } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/constants/enum';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';

@Controller('questions')
@ApiTags('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard, AbilitiesGuard)
  @ApiBearerAuth()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('question'))
  @ApiBody({
    type: CreateQuestionDto,
  })
  @ApiCreatedResponse({
    type: Question,
    description: DynamicMessage.CRUD.createSuccess('question'),
  })
  @CheckAbilites({ action: Action.Create, subject: Question })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionsService.create(createQuestionDto);
  }

  @Get()
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('question list'))
  @ApiOkResponse({
    type: Question,
    isArray: true,
    description: DynamicMessage.CRUD.getSuccess('question list'),
  })
  @CheckAbilites({ action: Action.Read, subject: Question })
  async findAll(
    @Query('page', CustomParseIntPipe) page: number = 1,
    @Query('perPage', CustomParseIntPipe) perPage: number = 10,
    @Query('keyword') keyword: string = '',
  ) {
    return await this.questionsService.findAll(page, perPage, keyword.trim());
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('question'))
  @ApiOkResponse({
    type: Question,
    description: DynamicMessage.CRUD.getSuccess('question'),
  })
  @CheckAbilites({ action: Action.Read, subject: Question })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return await this.questionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, AbilitiesGuard)
  @ApiBearerAuth()
  @ResponseMessage(DynamicMessage.CRUD.updateSuccess('question'))
  @ApiBody({
    type: UpdateQuestionDto,
  })
  @ApiOkResponse({
    type: Question,
    description: DynamicMessage.CRUD.updateSuccess('question'),
  })
  @CheckAbilites({ action: Action.Update, subject: Question })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.questionsService.update(
      id,
      updateQuestionDto,
      currentUser,
    );
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, AbilitiesGuard)
  @ApiBearerAuth()
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('question'))
  @ApiOkResponse({
    type: Question,
    description: DynamicMessage.CRUD.deleteSuccess('question'),
  })
  @CheckAbilites({ action: Action.Delete, subject: Question })
  async remove(
    @Param('id', CustomParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.questionsService.remove(id, currentUser);
  }
}

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
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
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
import { Answer } from './entities/answer.entity';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int.pipe';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { CheckAbilites } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/constants/enum';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('answers')
@ApiTags('answers')
export class AnswersController {
  constructor(
    private readonly answersService: AnswersService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard, AbilitiesGuard)
  @ApiBearerAuth()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('answer'))
  @ApiBody({
    type: CreateAnswerDto,
  })
  @ApiCreatedResponse({
    type: Answer,
    description: DynamicMessage.CRUD.createSuccess('answer'),
  })
  @CheckAbilites({ action: Action.Create, subject: Answer })
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    return await this.answersService.create(createAnswerDto);
  }

  @Get()
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('answer list'))
  @ApiOkResponse({
    type: Answer,
    isArray: true,
    description: DynamicMessage.CRUD.getSuccess('answer list'),
  })
  @CheckAbilites({ action: Action.Read, subject: Answer })
  async findAll() {
    return await this.answersService.findAll();
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('answer'))
  @ApiOkResponse({
    type: Answer,
    description: DynamicMessage.CRUD.getSuccess('answer'),
  })
  @CheckAbilites({ action: Action.Read, subject: Answer })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return await this.answersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, AbilitiesGuard)
  @ApiBearerAuth()
  @ResponseMessage(DynamicMessage.CRUD.updateSuccess('answer'))
  @ApiBody({
    type: UpdateAnswerDto,
  })
  @ApiOkResponse({
    type: Answer,
    description: DynamicMessage.CRUD.updateSuccess('answer'),
  })
  @CheckAbilites({ action: Action.Update, subject: Answer })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Param('questionId', CustomParseIntPipe) questionId: number,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.answersService.update(
      id,
      questionId,
      updateAnswerDto,
      currentUser,
    );
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, AbilitiesGuard)
  @ApiBearerAuth()
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('answer'))
  @ApiOkResponse({
    type: Answer,
    description: DynamicMessage.CRUD.deleteSuccess('answer'),
  })
  @CheckAbilites({ action: Action.Delete, subject: Answer })
  async remove(
    @Param('id', CustomParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.answersService.remove(id, currentUser);
  }
}

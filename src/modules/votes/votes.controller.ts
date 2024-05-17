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
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
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
import { Vote } from './entities/vote.entity';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int.pipe';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { CheckAbilites } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/constants/enum';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('votes')
@UseGuards(AccessTokenGuard, AbilitiesGuard)
@ApiBearerAuth()
@ApiTags('votes')
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
    private usersService: UsersService,
  ) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('vote'))
  @ApiBody({
    type: CreateVoteDto,
  })
  @ApiCreatedResponse({
    type: Vote,
    description: DynamicMessage.CRUD.createSuccess('vote'),
  })
  @CheckAbilites({ action: Action.Create, subject: Vote })
  async create(@Body() createVoteDto: CreateVoteDto) {
    return await this.votesService.create(createVoteDto);
  }

  @Get()
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('vote list'))
  @ApiOkResponse({
    type: Vote,
    isArray: true,
    description: DynamicMessage.CRUD.getSuccess('vote list'),
  })
  @CheckAbilites({ action: Action.Read, subject: Vote })
  async findAll() {
    return await this.votesService.findAll();
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('vote'))
  @ApiOkResponse({
    type: Vote,
    description: DynamicMessage.CRUD.getSuccess('vote'),
  })
  @CheckAbilites({ action: Action.Read, subject: Vote })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return await this.votesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(DynamicMessage.CRUD.updateSuccess('vote'))
  @ApiBody({
    type: UpdateVoteDto,
  })
  @ApiOkResponse({
    type: Vote,
    description: DynamicMessage.CRUD.updateSuccess('vote'),
  })
  @CheckAbilites({ action: Action.Update, subject: Vote })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateVoteDto: UpdateVoteDto,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.votesService.update(id, updateVoteDto, currentUser);
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('vote'))
  @ApiOkResponse({
    type: Vote,
    description: DynamicMessage.CRUD.deleteSuccess('vote'),
  })
  @CheckAbilites({ action: Action.Delete, subject: Vote })
  async remove(
    @Param('id', CustomParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return await this.votesService.remove(id, currentUser);
  }
}

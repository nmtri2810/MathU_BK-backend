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

@Controller('votes')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('vote'))
  @ApiBody({
    type: CreateVoteDto,
  })
  @ApiCreatedResponse({
    type: Vote,
    description: DynamicMessage.CRUD.createSuccess('vote'),
  })
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
  async findAll() {
    return await this.votesService.findAll();
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('vote'))
  @ApiOkResponse({
    type: Vote,
    description: DynamicMessage.CRUD.getSuccess('vote'),
  })
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
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateVoteDto: UpdateVoteDto,
  ) {
    return await this.votesService.update(id, updateVoteDto);
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('vote'))
  @ApiOkResponse({
    type: Vote,
    description: DynamicMessage.CRUD.deleteSuccess('vote'),
  })
  async remove(@Param('id', CustomParseIntPipe) id: number) {
    return await this.votesService.remove(id);
  }
}

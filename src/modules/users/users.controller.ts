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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int.pipe';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { DynamicMessage } from 'src/constants';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { CheckAbilites } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/constants/enum';
import { Request } from 'express';

@Controller('users')
@UseGuards(AccessTokenGuard, AbilitiesGuard)
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage(DynamicMessage.CRUD.createSuccess('user'))
  @ApiBody({
    type: CreateUserDto,
    examples: {
      user1: {
        value: {
          email: 'test@gmail.com',
          username: 'test',
          password: 'password',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: User,
    description: DynamicMessage.CRUD.createSuccess('user'),
  })
  @CheckAbilites({ action: Action.Create, subject: User })
  async create(@Body() createUserDto: CreateUserDto) {
    return new User(await this.usersService.create(createUserDto));
  }

  @Get()
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: DynamicMessage.CRUD.getSuccess('user list'),
  })
  @CheckAbilites({ action: Action.Read, subject: User })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new User(user));
  }

  @Get(':id')
  @ResponseMessage(DynamicMessage.CRUD.getSuccess('user'))
  @ApiOkResponse({
    type: User,
    description: DynamicMessage.CRUD.getSuccess('user'),
  })
  @CheckAbilites({ action: Action.Read, subject: User })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return new User(await this.usersService.findOne(id));
  }

  @Patch(':id')
  @ResponseMessage(DynamicMessage.CRUD.updateSuccess('user'))
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      user1: {
        value: {
          email: 'test@gmail.com',
          username: 'test',
          password: 'password',
          reputation: 1,
        },
      },
    },
  })
  @ApiOkResponse({
    type: User,
    description: DynamicMessage.CRUD.updateSuccess('user'),
  })
  @CheckAbilites({ action: Action.Update, subject: User })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const currentUser = await this.usersService.findOne(req.user['userId']);

    return new User(
      await this.usersService.update(id, updateUserDto, currentUser),
    );
  }

  @Delete(':id')
  @ResponseMessage(DynamicMessage.CRUD.deleteSuccess('user'))
  @ApiOkResponse({
    type: User,
    description: DynamicMessage.CRUD.deleteSuccess('user'),
  })
  @CheckAbilites({ action: Action.Delete, subject: User })
  async remove(@Param('id', CustomParseIntPipe) id: number) {
    return new User(await this.usersService.remove(id));
  }
}

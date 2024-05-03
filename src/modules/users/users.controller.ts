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
import { AccessTokenGuard } from 'src/common/guard/accessToken.guard';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ResponseMessages } from 'src/common/constants';

@Controller('users')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage(ResponseMessages.CREATE_USER_SUCCESSFULLY)
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
  @ApiCreatedResponse({ type: User, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto) {
    return new User(await this.usersService.create(createUserDto));
  }

  @Get()
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Get user list successfully',
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new User(user));
  }

  @Get(':id')
  @ResponseMessage(ResponseMessages.GET_USER_SUCCESSFULLY)
  @ApiOkResponse({ type: User, description: 'Get user successfully' })
  async findOne(@Param('id', CustomParseIntPipe) id: number) {
    return new User(await this.usersService.findOne(id));
  }

  @Patch(':id')
  @ResponseMessage(ResponseMessages.UPDATE_USER_SUCCESSFULLY)
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
  @ApiOkResponse({ type: User, description: 'Update user successfully' })
  async update(
    @Param('id', CustomParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new User(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ResponseMessage(ResponseMessages.DELETE_USER_SUCCESSFULLY)
  @ApiOkResponse({ type: User, description: 'Delete user successfully' })
  async remove(@Param('id', CustomParseIntPipe) id: number) {
    return new User(await this.usersService.remove(id));
  }
}

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { DynamicMessage } from 'src/constants';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guard/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guard/refreshToken.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ResponseMessage(DynamicMessage.actionSuccess('Login'))
  @ApiBody({
    type: LoginDto,
    examples: {
      user1: {
        value: {
          email: 'test@gmail.com',
          password: 'Aa@123456',
        },
      },
    },
  })
  @ApiOkResponse({ type: Auth, description: 'Login successfully' })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ResponseMessage(DynamicMessage.actionSuccess('Register'))
  @ApiBody({
    type: CreateUserDto,
    examples: {
      user1: {
        value: {
          email: 'test@gmail.com',
          password: 'Aa@123456',
          username: 'test',
        },
      },
    },
  })
  @ApiOkResponse({ type: Auth, description: 'Login successfully' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('logout')
  @ResponseMessage(DynamicMessage.actionSuccess('Logout'))
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async logout(@Req() req: Request) {
    return this.authService.logout(req.user['userId']);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  async refresh(@Req() req: Request) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refresh(userId, refreshToken);
  }
}

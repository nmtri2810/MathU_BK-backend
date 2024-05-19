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
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { OAuth2Client, UserRefreshClient } from 'google-auth-library';

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
  async login(@Body() { email, password }: LoginDto) {
    return await this.authService.login(email, password);
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

  @Post('google')
  async loginGoogle(@Body() code: string) {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );

    // access token, refresh token and id token interact with Google
    const { tokens } = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(tokens);

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const user = ticket.getPayload();

    return this.authService.loginGoogle(user);
  }

  // Temp
  @Post('google-refresh')
  async loginGoogleRefreshToken(@Req() req: Request) {
    const user = new UserRefreshClient(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      req.body.refreshToken,
    );
    const { credentials } = await user.refreshAccessToken(); // optain new tokens
    console.log('src_auth_auth.controller.ts#109: ', credentials);
  }
}

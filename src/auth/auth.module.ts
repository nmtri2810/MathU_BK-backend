import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategy/accessToken.strategy';
import { UsersModule } from 'src/modules/users/users.module';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  imports: [PassportModule, JwtModule.register({}), UsersModule],
})
export class AuthModule {}

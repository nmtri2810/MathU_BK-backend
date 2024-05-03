import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class Auth {
  @ApiProperty()
  user: User;

  @ApiProperty()
  tokens: Tokens;
}

import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User implements Users {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role_id: number;

  @Exclude()
  refresh_token: string;
}

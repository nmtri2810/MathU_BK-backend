import { ApiProperty } from '@nestjs/swagger';
import { Tags } from '@prisma/client';

export class Tag implements Tags {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  deleted_at: Date;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  description: string;
}

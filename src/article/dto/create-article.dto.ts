import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArticle {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly body: string;

  @ApiProperty()
  readonly tagList?: Array<string>;
}

export class CreateArticleDto {
  @ApiProperty()
  readonly article: CreateArticle;
}

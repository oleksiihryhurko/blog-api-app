import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticle {
  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly body: string;

  @ApiProperty()
  readonly tagList?: Array<string>;
}

export class UpdateArticleDto {
  @ApiProperty()
  readonly article: UpdateArticle;
}

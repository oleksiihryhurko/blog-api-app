import { ApiProperty, PickType } from '@nestjs/swagger';
import { Profile } from '../../profile/dto/profile-response.dto';
import { ArticleModel } from '../schemas/article.schema';

class ArticleResponse extends PickType(ArticleModel, [
  'slug',
  'title',
  'description',
  'body',
  'tagList',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  favoritesCount: number;

  @ApiProperty()
  author: Profile;
}

export class ArticleResponseDto {
  @ApiProperty()
  readonly article: ArticleResponse;
}

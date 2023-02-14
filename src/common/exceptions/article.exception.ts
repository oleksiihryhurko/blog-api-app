import { HttpException, HttpStatus } from '@nestjs/common';

export class ArticleNotFoundException extends HttpException {
  constructor(slug: string) {
    super(`article with slug: ${slug} is not found`, HttpStatus.NOT_FOUND);
  }
}

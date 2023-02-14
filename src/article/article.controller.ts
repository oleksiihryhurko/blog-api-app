import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRequest } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import { UserModel } from '../user/schemas/user.schema';
import { ArticleService } from './article.service';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CreateArticle, CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticle, UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
@ApiTags('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create article' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateArticleDto })
  @ApiCreatedResponse({ type: ArticleResponseDto })
  async createArticle(
    @UserRequest() user: UserModel,
    @Body('article') createArticle: CreateArticle,
  ) {
    const article = await this.articleService.createArticle(
      user,
      createArticle,
    );

    const author = await this.articleService.getArticleAuthor(user, article);
    return this.articleService.buildArticleResponse(article, author);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get article' })
  @ApiOkResponse({ type: ArticleResponseDto })
  async getArticle(
    @UserRequest() user: UserModel,
    @Param('slug') slug: string,
  ) {
    const article = await this.articleService.getArticleBySlug(slug);
    const author = await this.articleService.getArticleAuthor(user, article);
    return this.articleService.buildArticleResponse(article, author);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update article' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateArticleDto })
  @ApiOkResponse({ type: ArticleResponseDto })
  async updateArticle(
    @UserRequest() user: UserModel,
    @Param('slug') slug: string,
    @Body('article') updateArticle: UpdateArticle,
  ) {
    const article = await this.articleService.updateArticle(
      user,
      slug,
      updateArticle,
    );
    const author = await this.articleService.getArticleAuthor(user, article);
    return this.articleService.buildArticleResponse(article, author);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete article' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'article deleted' })
  async deleteArticle(
    @UserRequest() user: UserModel,
    @Param('slug') slug: string,
  ) {
    await this.articleService.deleteArticle(user, slug);
    return { description: 'article deleted' };
  }
}

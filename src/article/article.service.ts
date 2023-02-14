import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleNotFoundException } from 'src/common/exceptions/article.exception';
import { ProfileNotFoundException } from 'src/common/exceptions/profile.exception';
import { Profile } from '../profile/dto/profile-response.dto';
import { ProfileService } from '../profile/profile.service';
import { UserModel } from '../user/schemas/user.schema';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CreateArticle } from './dto/create-article.dto';
import { UpdateArticle } from './dto/update-article.dto';
import { ArticleModel, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(ArticleModel.name)
    private articleModel: Model<ArticleDocument>,
    private profileService: ProfileService,
  ) {}

  async createArticle(
    author: UserModel,
    createArticle: CreateArticle,
  ): Promise<ArticleModel> {
    const slug = this.generateSlug(createArticle.title);
    const newArticle = new this.articleModel({
      author: author.username,
      slug,
      title: createArticle.title,
      description: createArticle.description,
      body: createArticle.body,
      tagList: createArticle.tagList ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await newArticle.save();
    return newArticle.toObject();
  }

  async getArticleAuthor(
    user: UserModel,
    article: ArticleModel,
  ): Promise<Profile> {
    const profile = await this.profileService.getProfileByUsername(
      article.author,
    );
    if (!profile) {
      throw new ProfileNotFoundException(article.author);
    }

    let isFollowing = false;
    if (user) {
      isFollowing = this.profileService.isFollowing(user, profile);
    }
    return { ...profile, following: isFollowing } as Profile;
  }

  async getArticleDocumentBySlug(slug: string) {
    const article = await this.articleModel.findOne({ slug });
    if (!article) {
      throw new ArticleNotFoundException(slug);
    }
    return article;
  }

  async getArticleBySlug(slug: string): Promise<ArticleModel> {
    const article = await this.getArticleDocumentBySlug(slug);
    return article.toObject();
  }

  async updateArticle(
    user: UserModel,
    slug: string,
    updateArticle: UpdateArticle,
  ): Promise<ArticleModel> {
    const article = await this.getArticleDocumentBySlug(slug);
    if (article.author !== user.username) {
      throw new UnauthorizedException();
    }
    const newSlug = updateArticle.title
      ? this.generateSlug(updateArticle.title)
      : slug;

    Object.assign(article, { slug: newSlug, ...updateArticle });
    await article.save();
    return article;
  }

  async deleteArticle(user: UserModel, slug: string): Promise<void> {
    const article = await this.getArticleDocumentBySlug(slug);
    if (article.author !== user.username) {
      throw new UnauthorizedException();
    }
    await article.delete();
  }

  private generateSlug(title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s/g, '-');
    const randomString = (Math.random() + 1).toString(36).substring(2);
    return slug + '-' + randomString;
  }

  buildArticleResponse(
    article: ArticleModel,
    profile: Profile,
  ): ArticleResponseDto {
    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: false,
        favoritesCount: 0,
        author: {
          username: profile.username,
          bio: profile.bio,
          image: profile.image,
          following: profile.following,
        },
      },
    };
  }
}

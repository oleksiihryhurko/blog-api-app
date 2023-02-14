import { Injectable } from '@nestjs/common';
import { Tag, TagDocument } from './schemas/tag.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TagsResponseDto } from './dto/tags-response.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
  ) {}

  async findAll(): Promise<TagsResponseDto> {
    const tags = await this.tagModel.find().lean();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}

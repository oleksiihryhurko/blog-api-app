import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagsResponseDto } from './dto/tags-response.dto';

@Controller()
@ApiTags('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('tags')
  @ApiOkResponse({ type: TagsResponseDto })
  async findAll(): Promise<TagsResponseDto> {
    return this.tagService.findAll();
  }
}

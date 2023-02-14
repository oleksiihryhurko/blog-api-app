import { ApiProperty } from '@nestjs/swagger';

export class TagsResponseDto {
  @ApiProperty()
  tags: Array<string>;
}

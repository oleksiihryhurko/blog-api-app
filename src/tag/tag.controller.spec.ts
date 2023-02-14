import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('[Unit] Tag Controller', () => {
  let tagService: TagService;
  let tagController: TagController;

  beforeAll(async () => {
    const TagServiceProvider = {
      provide: TagService,
      useFactory: () => ({
        findAll: jest.fn(() => []),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagServiceProvider],
    }).compile();
    tagService = app.get<TagService>(TagService);
    tagController = app.get<TagController>(TagController);
  });

  test('should be defined', () => {
    expect(tagService).toBeDefined();
  });

  test('should call findAll method', async () => {
    tagController.findAll();
    expect(tagService.findAll).toBeCalled();
  });
});

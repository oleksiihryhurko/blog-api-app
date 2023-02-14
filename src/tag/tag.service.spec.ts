// import { getModelToken } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { Tag } from './schemas/tag.schema';
// import { TagService } from './tag.service';

// describe('[Unit] Tag Service', () => {
//   let tagService: TagService;

//   const lean = { lean: jest.fn() };
//   const tagRepositoryFactory = () => ({
//     find: () => lean,
//     map: () => [],
//   });

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         TagService,
//         {
//           useFactory: tagRepositoryFactory,
//           provide: getModelToken(Tag.name),
//         },
//       ],
//     }).compile();
//     tagService = module.get<TagService>(TagService);
//   });

//   test('should be defined', () => {
//     expect(tagService).toBeDefined();
//   });

//   test('should return tags', async () => {
//     const result = { tags: ['test'] };
//     tagRepositoryFactory().find().lean.mockReturnValueOnce(result);
//     expect(await tagService.findAll()).toStrictEqual(result);
//   });
// });

import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { DontBeAService } from './dontbea.service';
import { DontBeA } from './dontbea.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DontbeaService', () => {
  let service: DontBeAService;
  const dontBeAs = [
    {
      "id": "0066fc28-0594-43ee-87ec-b49b369d3b0e",
      "created_at": "2017-12-29 14:21:33",
      "updated_at": "2017-12-29 14:21:33",
      "phrase": "Don't be the ribs that flip over Fred Flintstone's car.",
      "episode_no": "S04E05",
      "episode_title": "Shawn Gets the Yips"
    },
    {
      "id": "0287245a-781d-4be7-8346-f86046b4a777",
      "created_at": "2017-12-13 20:44:51",
      "updated_at": "2017-12-13 20:44:51",
      "phrase": "Don't be your jury summons that I accidentally threw away last month along with something called a w-2.",
      "episode_no": "S05E11",
      "episode_title": "In Plain Fright"
    },
    {
      "id": "05b04ef9-7f10-4f37-a2c0-71a65474dc9d",
      "created_at": "2017-12-29 14:21:33",
      "updated_at": "2017-12-29 14:21:33",
      "phrase": "Don't be Nic Cage's accent from Con Air",
      "episode_no": "S04E13",
      "episode_title": "Death Is in the Air"
    },
    {
      "id": "06be3183-189a-4f8f-af1a-e6382426b1c7",
      "created_at": "2017-12-29 14:21:33",
      "updated_at": "2017-12-29 14:21:33",
      "phrase": "Don't be Leon from the 'Like a Prayer' video.",
      "episode_no": "S04E15",
      "episode_title": "The Head, The Tail, The Whole Damn Episode"
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DontBeAService,
        {
          provide: getRepositoryToken(DontBeA),
          useValue: {
            find() {
              return dontBeAs;
            },
          },
        },
      ],
    }).compile();
    service = module.get(DontBeAService);
  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all entries', async () => {
      jest.spyOn(service, 'findAll');

      expect(await service.findAll()).toEqual(dontBeAs);
    });
  });

  describe('findRand', () => {
    it('should return a random entries', async () => {
      jest.spyOn(service, 'findRand');

      expect(await service.findRand())
        .toEqual(
          expect.objectContaining({
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            phrase: expect.any(String),
            episode_no: expect.any(String),
            episode_title: expect.any(String),
          }),
        );
    });
  });
});

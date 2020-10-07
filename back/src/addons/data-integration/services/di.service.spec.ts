import { Test, TestingModule } from '@nestjs/testing';
import { DiService } from './di.service';

describe('DiService', () => {
  let service: DiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiService],
    }).compile();

    service = module.get<DiService>(DiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

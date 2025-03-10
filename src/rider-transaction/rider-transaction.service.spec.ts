import { Test, TestingModule } from '@nestjs/testing';
import { RiderTransactionService } from './rider-transaction.service';

describe('RiderTransactionService', () => {
  let service: RiderTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiderTransactionService],
    }).compile();

    service = module.get<RiderTransactionService>(RiderTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

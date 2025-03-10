import { Test, TestingModule } from '@nestjs/testing';
import { RiderTransactionController } from './rider-transaction.controller';

describe('RiderTransactionController', () => {
  let controller: RiderTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiderTransactionController],
    }).compile();

    controller = module.get<RiderTransactionController>(RiderTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

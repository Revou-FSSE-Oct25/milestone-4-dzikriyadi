import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: jest.Mocked<
    Pick<
      TransactionService,
      'deposit' | 'withdraw' | 'transfer' | 'findAll' | 'findOne'
    >
  >;

  beforeEach(() => {
    transactionService = {
      deposit: jest.fn(),
      withdraw: jest.fn(),
      transfer: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    controller = new TransactionController(
      transactionService as unknown as TransactionService,
    );
  });

  it('should pass the authenticated user id to transfer', async () => {
    transactionService.transfer.mockResolvedValue({
      id: 'trx-1',
      amount: 10000,
      type: 'TRANSFER' as never,
      status: 'SUCCESS' as never,
      createdAt: new Date(),
    });

    await controller.transfer(
      { id: 'user-1', email: 'user@revobank.com', role: 'CUSTOMER' as never },
      {
        fromAccountId: 'acc-1',
        toAccountId: 'acc-2',
        amount: 10000,
      },
    );

    expect(transactionService.transfer).toHaveBeenCalledWith('user-1', {
      fromAccountId: 'acc-1',
      toAccountId: 'acc-2',
      amount: 10000,
    });
  });
});

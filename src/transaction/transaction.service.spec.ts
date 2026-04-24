import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: {
    createDeposit: jest.Mock;
    createWithdraw: jest.Mock;
    createTransfer: jest.Mock;
    findByUser: jest.Mock;
    findById: jest.Mock;
    findByIdForUser: jest.Mock;
  };
  let accountRepository: {
    findById: jest.Mock;
  };

  beforeEach(() => {
    transactionRepository = {
      createDeposit: jest.fn(),
      createWithdraw: jest.fn(),
      createTransfer: jest.fn(),
      findByUser: jest.fn(),
      findById: jest.fn(),
      findByIdForUser: jest.fn(),
    };
    accountRepository = {
      findById: jest.fn(),
    };

    service = new TransactionService(
      transactionRepository as never,
      accountRepository as never,
    );
  });

  it('withdraw should reject insufficient balance', async () => {
    accountRepository.findById.mockResolvedValue({
      id: 'acc-1',
      userId: 'user-1',
      balance: { toNumber: () => 5000 },
    });

    await expect(
      service.withdraw('user-1', {
        fromAccountId: 'acc-1',
        amount: 10000,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deposit should reject access to another users account', async () => {
    accountRepository.findById.mockResolvedValue({
      id: 'acc-1',
      userId: 'other-user',
      balance: { toNumber: () => 0 },
    });

    await expect(
      service.deposit('user-1', {
        toAccountId: 'acc-1',
        amount: 10000,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('transfer should reject same source and destination account', async () => {
    accountRepository.findById.mockResolvedValue({
      id: 'acc-1',
      userId: 'user-1',
      balance: { toNumber: () => 50000 },
    });

    await expect(
      service.transfer('user-1', {
        fromAccountId: 'acc-1',
        toAccountId: 'acc-1',
        amount: 1000,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('transfer should return a transaction entity when valid', async () => {
    accountRepository.findById
      .mockResolvedValueOnce({
        id: 'acc-1',
        userId: 'user-1',
        balance: { toNumber: () => 50000 },
      })
      .mockResolvedValueOnce({
        id: 'acc-2',
        userId: 'user-2',
        balance: { toNumber: () => 1000 },
      });
    transactionRepository.createTransfer.mockResolvedValue({
      id: 'trx-1',
      fromAccountId: 'acc-1',
      toAccountId: 'acc-2',
      amount: { toNumber: () => 10000 },
      type: TransactionType.TRANSFER,
      status: 'SUCCESS',
      description: 'Rent',
      createdAt: new Date(),
    });

    const result = await service.transfer('user-1', {
      fromAccountId: 'acc-1',
      toAccountId: 'acc-2',
      amount: 10000,
      description: 'Rent',
    });

    expect(transactionRepository.createTransfer).toHaveBeenCalledWith(
      'acc-1',
      'acc-2',
      10000,
      'Rent',
    );
    expect(result.type).toBe(TransactionType.TRANSFER);
  });
});

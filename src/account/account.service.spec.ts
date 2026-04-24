import { ForbiddenException } from '@nestjs/common';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: {
    create: jest.Mock;
    findByUserId: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    accountRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new AccountService(accountRepository as never);
  });

  it('create should assign the account to the authenticated user', async () => {
    accountRepository.create.mockImplementation(async (data) => ({
      id: 'acc-1',
      accountNumber: data.accountNumber,
      balance: { toNumber: () => 0 },
      currency: data.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.create('user-1', { currency: 'IDR' });

    expect(accountRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        currency: 'IDR',
        user: { connect: { id: 'user-1' } },
      }),
    );
    expect(result.currency).toBe('IDR');
  });

  it('findOne should reject access to another users account', async () => {
    accountRepository.findById.mockResolvedValue({
      id: 'acc-1',
      userId: 'other-user',
      accountNumber: 'ACC123',
      balance: { toNumber: () => 0 },
      currency: 'IDR',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.findOne('user-1', 'acc-1')).rejects.toThrow(
      ForbiddenException,
    );
  });
});

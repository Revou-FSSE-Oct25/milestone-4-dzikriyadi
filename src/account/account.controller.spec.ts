import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let accountService: jest.Mocked<
    Pick<AccountService, 'create' | 'findAll' | 'findOne' | 'update' | 'remove'>
  >;

  beforeEach(() => {
    accountService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    controller = new AccountController(
      accountService as unknown as AccountService,
    );
  });

  it('should pass the authenticated user id to create', async () => {
    accountService.create.mockResolvedValue({
      id: 'acc-1',
      accountNumber: 'ACC123',
      balance: 0,
      currency: 'IDR',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await controller.create(
      { id: 'user-1', email: 'user@revobank.com', role: 'CUSTOMER' as never },
      { currency: 'IDR' },
    );

    expect(accountService.create).toHaveBeenCalledWith('user-1', {
      currency: 'IDR',
    });
  });
});

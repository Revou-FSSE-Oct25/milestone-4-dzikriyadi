import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<Pick<UserService, 'getProfile' | 'updateProfile'>>;

  beforeEach(() => {
    userService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    controller = new UserController(userService as unknown as UserService);
  });

  it('should delegate getProfile to the service', async () => {
    userService.getProfile.mockResolvedValue({
      id: 'user-1',
      name: 'Dzikri',
      email: 'user@revobank.com',
      role: 'CUSTOMER' as never,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await controller.getProfile({
      id: 'user-1',
      email: 'user@revobank.com',
      role: 'CUSTOMER' as never,
    });

    expect(userService.getProfile).toHaveBeenCalledWith('user-1');
  });
});

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: {
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    service = new UserService(userRepository as never);
  });

  it('create should hash the password before saving', async () => {
    userRepository.create.mockImplementation(async (data) => ({
      id: 'user-1',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    }));

    await service.create({
      name: 'Dzikri',
      email: 'user@revobank.com',
      password: 'secret123',
    });

    expect(userRepository.create).toHaveBeenCalled();
    expect(userRepository.create.mock.calls[0][0].password).not.toBe('secret123');
    expect(
      await bcrypt.compare('secret123', userRepository.create.mock.calls[0][0].password),
    ).toBe(true);
  });

  it('getProfile should throw when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(service.getProfile('missing-user')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updateProfile should hash a new password', async () => {
    userRepository.findById.mockResolvedValue({
      id: 'user-1',
      name: 'Dzikri',
      email: 'user@revobank.com',
      role: 'CUSTOMER',
      password: 'old-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    userRepository.update.mockImplementation(async (_id, data) => ({
      id: 'user-1',
      name: data.name ?? 'Dzikri',
      email: data.email ?? 'user@revobank.com',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await service.updateProfile('user-1', {
      password: 'newsecret123',
    });

    expect(userRepository.update).toHaveBeenCalled();
    expect(userRepository.update.mock.calls[0][1].password).not.toBe(
      'newsecret123',
    );
    expect(
      await bcrypt.compare(
        'newsecret123',
        userRepository.update.mock.calls[0][1].password,
      ),
    ).toBe(true);
  });

  it('create should map duplicate email into conflict exception', async () => {
    userRepository.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.create({
        name: 'Dzikri',
        email: 'user@revobank.com',
        password: 'secret123',
      }),
    ).rejects.toThrow(ConflictException);
  });
});

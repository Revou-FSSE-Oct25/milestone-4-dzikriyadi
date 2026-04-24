import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: {
    findByEmail: jest.Mock;
    create: jest.Mock;
  };
  let jwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };

    service = new AuthService(
      userRepository as never,
      jwtService as unknown as JwtService,
    );
  });

  it('register should hash password before saving', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockImplementation(async (data) => ({
      id: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    }));

    const result = await service.register({
      name: 'Dzikri',
      email: 'user@revobank.com',
      password: 'secret123',
    });

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@revobank.com',
        role: Role.CUSTOMER,
        password: expect.any(String),
      }),
    );
    expect(userRepository.create.mock.calls[0][0].password).not.toBe('secret123');
    expect(await bcrypt.compare('secret123', userRepository.create.mock.calls[0][0].password)).toBe(true);
    expect(result.email).toBe('user@revobank.com');
  });

  it('register should reject duplicate email', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
    });

    await expect(
      service.register({
        name: 'Dzikri',
        email: 'user@revobank.com',
        password: 'secret123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('login should return an access token for valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      name: 'Dzikri',
      email: 'user@revobank.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.login({
      email: 'user@revobank.com',
      password: 'secret123',
    });

    expect(result.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('user@revobank.com');
  });

  it('login should reject invalid password', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      name: 'Dzikri',
      email: 'user@revobank.com',
      password: await bcrypt.hash('secret123', 10),
      role: Role.CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.login({
        email: 'user@revobank.com',
        password: 'wrongpass',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

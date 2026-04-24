import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  private generateAccountNumber(): string {
    return `ACC${Date.now()}`;
  }

  async create(userId: string, dto: CreateAccountDto): Promise<AccountEntity> {
    const account = await this.accountRepository.create({
      accountNumber: dto.accountNumber ?? this.generateAccountNumber(),
      currency: dto.currency ?? 'IDR',
      balance: 0,
      user: {
        connect: { id: userId },
      },
    });

    return new AccountEntity(account);
  }

  async findAll(userId: string): Promise<AccountEntity[]> {
    const accounts = await this.accountRepository.findByUserId(userId);
    return accounts.map((account) => new AccountEntity(account));
  }

  async findOne(userId: string, id: string): Promise<AccountEntity> {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return new AccountEntity(account);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAccountDto,
  ): Promise<AccountEntity> {
    await this.findOne(userId, id);

    const account = await this.accountRepository.update(id, dto);
    return new AccountEntity(account);
  }

  async remove(userId: string, id: string): Promise<AccountEntity> {
    await this.findOne(userId, id);

    const account = await this.accountRepository.delete(id);
    return new AccountEntity(account);
  }
}

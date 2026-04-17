import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from 'src/account/account.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  //  DEPOSIT
  async deposit(userId: string, dto: CreateTransactionDto) {
    const account = await this.accountRepository.findById(dto.toAccountId!);

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId)
      throw new ForbiddenException('Access denied');

    await this.transactionRepository.updateBalance(account.id, dto.amount);

    const transaction = await this.transactionRepository.create({
      toAccount: { connect: { id: account.id } },
      amount: dto.amount,
      type: TransactionType.DEPOSIT,
      description: dto.description,
    });

    return new TransactionEntity(transaction);
  }

  // WITHDRAW
  async withdraw(userId: string, dto: CreateTransactionDto) {
    const account = await this.accountRepository.findById(dto.fromAccountId!);

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId)
      throw new ForbiddenException('Access denied');

    if (account.balance.toNumber() < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    await this.transactionRepository.decrementBalance(account.id, dto.amount);

    const transaction = await this.transactionRepository.create({
      fromAccount: { connect: { id: account.id } },
      amount: dto.amount,
      type: TransactionType.WITHDRAW,
      description: dto.description,
    });

    return new TransactionEntity(transaction);
  }

  // TRANSFER
  async transfer(userId: string, dto: CreateTransactionDto) {
    const from = await this.accountRepository.findById(dto.fromAccountId!);
    const to = await this.accountRepository.findById(dto.toAccountId!);

    if (!from || !to) throw new NotFoundException('Account not found');

    if (from.userId !== userId) throw new ForbiddenException('Access denied');

    if (from.balance.toNumber() < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Ideally pakai transaction DB (atomic)
    await this.transactionRepository.decrementBalance(from.id, dto.amount);
    await this.transactionRepository.updateBalance(to.id, dto.amount);

    const transaction = await this.transactionRepository.create({
      fromAccount: { connect: { id: from.id } },
      toAccount: { connect: { id: to.id } },
      amount: dto.amount,
      type: TransactionType.TRANSFER,
      description: dto.description,
    });

    return new TransactionEntity(transaction);
  }

  // GET ALL TRANSACTIONS
  async findAll(userId: string) {
    const transactions = await this.transactionRepository.findByUser(userId);
    return transactions.map((t) => new TransactionEntity(t));
  }

  // GET DETAIL
  async findOne(userId: string, id: string) {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return new TransactionEntity(transaction);
  }
}
